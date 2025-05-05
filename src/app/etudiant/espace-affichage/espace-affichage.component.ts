import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, finalize, of } from 'rxjs';
import { SoutenanceView } from 'src/app/models/soutenance-view.model';
import { Projet } from 'src/app/models/projet.model';
import { BinomeService } from 'src/app/services/binome.service';
import { SoutenanceService } from 'src/app/services/soutenance.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-espace-affichage',
  templateUrl: './espace-affichage.component.html',
  styleUrls: ['./espace-affichage.component.css']
})
export class EspaceAffichageComponent implements OnInit {
  soutenanceInfo: SoutenanceView | null = null;
  projetInfo: Projet | null = null;
  
  loadingSoutenance = false;
  loadingProjet = false;
  
  soutenanceError = false;
  projetError = false;
  
  errorMessage = '';
  isSoutenancePlanned = false;

  // TEST MODE CONFIG
  private TEST_MODE = true; // CHANGE TO FALSE IN PRODUCTION
  private TEST_BINOME_ID = 3; // CHANGE THIS TO YOUR TEST BINOME ID

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private soutenanceService: SoutenanceService,
    private binomeService: BinomeService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadDetails();
  }

  loadDetails(): void {
    // First check route parameters
    this.route.params.subscribe(params => {
      const soutenanceId = params['id'] || params['soutenanceId'];
      const binomeId = params['binomeId'];
      
      if (soutenanceId) {
        // If we have a soutenance ID, load soutenance directly
        this.loadSoutenanceById(+soutenanceId);
      } else if (binomeId) {
        // If we have a binome ID, load projet first, then soutenance separately
        this.loadProjetByBinomeId(+binomeId);
        this.loadSoutenanceByBinomeId(+binomeId);
      } else {
        // If no ID in route, try to load current user's data
        this.loadUserData();
      }
    });
  }

  loadUserData(): void {
    // FOR TESTING: If test mode is enabled, use the test binome ID directly
    if (this.TEST_MODE) {
      console.log('🧪 TEST MODE ACTIVE - Using binome ID:', this.TEST_BINOME_ID);
      this.loadProjetByBinomeId(this.TEST_BINOME_ID);
      this.loadSoutenanceByBinomeId(this.TEST_BINOME_ID);
      return;
    }
    
    // NORMAL FLOW: Check if user is logged in and get their binome ID
    if (this.authService.isLoggedIn()) {
      const binomeId = this.authService.getUserBinomeId();
      
      if (binomeId) {
        // If user has a binome ID, load project and soutenance separately
        this.loadProjetByBinomeId(binomeId);
        this.loadSoutenanceByBinomeId(binomeId);
      } else {
        // If no binome ID in user object, display error
        this.errorMessage = 'Vous n\'êtes pas assigné à un binôme.';
      }
    } else {
      // If user is not logged in, redirect to login
      this.router.navigate(['/login']);
    }
  }

  /**
   * Load soutenance by its ID
   */
  loadSoutenanceById(id: number): void {
    this.loadingSoutenance = true;
    this.soutenanceService.getSoutenanceByBinomeId(id)
      .pipe(
        catchError(error => {
          console.error('Error loading soutenance:', error);
          this.soutenanceError = true;
          this.errorMessage = 'Erreur lors du chargement de la soutenance.';
          return of(null);
        }),
        finalize(() => {
          this.loadingSoutenance = false;
        })
      )
      .subscribe(soutenance => {
        if (soutenance) {
          this.soutenanceInfo = soutenance;
          this.checkSoutenancePlanned();
          
          // If soutenance has binome info and we don't have project info yet,
          // load the project separately
          if (soutenance.binomeId && !this.projetInfo) {
            this.loadProjetByBinomeId(soutenance.binomeId);
          }
        }
      });
  }

  /**
   * Load project by binome ID
   */
  loadProjetByBinomeId(binomeId: number): void {
    this.loadingProjet = true;
    this.binomeService.getProjetByBinomeId(binomeId)
      .pipe(
        catchError(error => {
          console.error('Error loading project for binome:', error);
          this.projetError = true;
          this.errorMessage = 'Erreur lors du chargement du projet pour ce binôme.';
          return of(null);
        }),
        finalize(() => {
          this.loadingProjet = false;
        })
      )
      .subscribe(projet => {
        if (projet) {
          this.projetInfo = projet;
        } else {
          console.log('No project assigned to this binome');
        }
      });
  }

/**
 * Load soutenance by binome ID
 * This will search all soutenances for one matching the binome ID
 */
loadSoutenanceByBinomeId(binomeId: number): void {
  this.loadingSoutenance = true;
  this.soutenanceService.getSoutenanceByBinomeId(binomeId)
    .pipe(
      catchError(error => {
        console.error('Error loading soutenance for binome:', error);
        this.soutenanceError = true;
        this.errorMessage = 'Erreur lors du chargement de la soutenance pour ce binôme.';
        return of(null);
      }),
      finalize(() => {
        this.loadingSoutenance = false;
      })
    )
    .subscribe(soutenance => {
      if (soutenance) {
        console.log('Soutenance loaded successfully:', soutenance);
        this.soutenanceInfo = soutenance;
        
        // Ensure jury members have full names displayed
        if (this.soutenanceInfo.juryMembers && this.soutenanceInfo.juryMembers.length > 0) {
          this.soutenanceInfo.juryMembers = this.soutenanceInfo.juryMembers.map(member => {
            // If no name set, use role-specific teacher names from soutenance if available
            if (!member.fullName && !member.nomComplet) {
              if (member.role === 'encadrant' && this.soutenanceInfo?.encadrant !== 'Non assigné') {
                member.fullName = this.soutenanceInfo?.encadrant || member.role;
              } else if (member.role === 'examinateur' && this.soutenanceInfo?.examinateur !== 'Non assigné') {
                member.fullName = this.soutenanceInfo?.examinateur || member.role;
              } else {
                // Fallback naming based on role
                member.fullName = `${member.role.charAt(0).toUpperCase() + member.role.slice(1)}`;
              }
            }
            return member;
          });
        }
        
        this.checkSoutenancePlanned();
      } else {
        console.log('Aucune soutenance trouvée pour ce binôme');
        this.isSoutenancePlanned = false;
      }
    });
}

checkSoutenancePlanned(): void {
  if (!this.soutenanceInfo) {
    this.isSoutenancePlanned = false;
    return;
  }

  console.log('Checking if soutenance is planned with data:', {
    date: this.soutenanceInfo.dateSoutenance,
    heure: this.soutenanceInfo.heureDebut,
    salle: this.soutenanceInfo.salle
  });

  // Check if soutenance has date, time and room assigned
  this.isSoutenancePlanned = !!(
    this.soutenanceInfo.dateSoutenance && 
    this.soutenanceInfo.dateSoutenance !== 'Date non définie' &&
    this.soutenanceInfo.heureDebut && 
    this.soutenanceInfo.heureDebut !== 'Heure non définie' &&
    this.soutenanceInfo.salle && 
    this.soutenanceInfo.salle !== 'Salle non affectée'
  );

  console.log('Is soutenance planned:', this.isSoutenancePlanned);

  // Format the enseignants string if not already set
  if (!this.soutenanceInfo.enseignants && 
      (this.soutenanceInfo.encadrant !== 'Non assigné' || 
       this.soutenanceInfo.examinateur !== 'Non assigné')) {
    
    let enseignants = '';
    
    if (this.soutenanceInfo.encadrant !== 'Non assigné') {
      enseignants = `${this.soutenanceInfo.encadrant} (Encadrant)`;
    }
    
    if (this.soutenanceInfo.examinateur !== 'Non assigné') {
      if (enseignants) {
        enseignants += `, ${this.soutenanceInfo.examinateur} (Examinateur)`;
      } else {
        enseignants = `${this.soutenanceInfo.examinateur} (Examinateur)`;
      }
    }
    
    this.soutenanceInfo.enseignants = enseignants || 'Non assignés';
  }
}
  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}