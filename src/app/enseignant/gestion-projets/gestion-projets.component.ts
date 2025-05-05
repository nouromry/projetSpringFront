import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Projet } from 'src/app/models/projet.model';
import { ProjetService } from 'src/app/services/projet.service';
import { Enseignant } from 'src/app/models/enseignant.model'; 
import { EnseignantService } from 'src/app/services/enseignant.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-gestion-projets',
  templateUrl: './gestion-projets.component.html',
  styleUrls: ['./gestion-projets.component.css']
})
export class GestionProjetsComponent implements OnInit {
  activeTab: string = 'validation';
  showDetail: boolean = false;
  selectedProjet!: Projet;
  showAddForm: boolean = false;
  projetForm!: FormGroup;
  enseignants: Enseignant[] = [];

  projets: Projet[] = [];
  filteredProjets: Projet[] = [];
  groupedProjets: { [key: string]: Projet[] } = {};
  selectedStatus: string = 'tous';
  searchTerm: string = '';
  filiereFilter: string = 'tous';
  private searchTimeout: any;
  role: string = 'Chef de département';
  currentUser: any;

  constructor(
    private projetService: ProjetService,
    private enseignantService: EnseignantService,
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.currentUser = this.authService.currentUserValue;
    this.role = user?.role || 'Invité';
    this.loadProjets();
    this.initForm();
  }

  loadProjets(): void {
    this.projetService.getAllProjets().subscribe(data => {
      this.projets = data;
      this.filteredProjets = [...data];   
      this.groupedProjets = this.groupByEncadrant(this.projets);
    });
  }



  initForm(): void {
    this.projetForm = this.fb.group({
      titre: ['', Validators.required],
      description: ['', Validators.required],
      technologies: ['', Validators.required],
      filiere: ['', Validators.required],
    });
  }

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) {
      this.projetForm.reset();
    }
  }


  onSubmitProjet(): void {
    if (this.projetForm.invalid || !this.currentUser?.id) return;

    const formValue = this.projetForm.value;
    const today = new Date().toISOString().split('T')[0];
    
    const projectData = {
      titre: formValue.titre,
      description: formValue.description,
      technologies: formValue.technologies,
      etat: 'EN_ATTENTE', // Default status
      dateDepot: today,
      filiere: formValue.filiere
    };

    this.enseignantService.createProject(this.currentUser.id, projectData).subscribe({
      next: (createdProjet) => {
        this.projets.unshift(createdProjet); // Add new project at beginning
        this.toggleAddForm();
      },
      error: (error) => {
        console.error('Failed to create project:', error);
        // Add error handling UI feedback
      }
    });
  }

  // Rest of your component code remains unchanged
  groupByEncadrant(projets: Projet[]): { [key: string]: Projet[] } {
    return projets.reduce((acc, projet) => {
      const enseignantNom = projet.enseignant.nom;
      if (!acc[enseignantNom]) {
        acc[enseignantNom] = [];
      }
      acc[enseignantNom].push(projet);
      return acc;
    }, {} as { [key: string]: Projet[] });
  }
  
  objectKeys(obj: { [key: string]: any }): string[] {
    return Object.keys(obj);
  }

  switchTab(tab: string): void {
    this.activeTab = tab;
    this.showDetail = false;
    this.showAddForm = false;
    if (tab === 'validation') {
      this.filterByStatus('tous');
    } else if (tab === 'liste') {
      const projetsValides = this.projets.filter(p => p.etat.toUpperCase() === 'VALIDE');
      this.groupedProjets = this.groupByEncadrant(projetsValides);
      this.filterProjets();
    }
  }

  filterByStatus(status: string): void {
    this.selectedStatus = status;
    if (status === 'tous') {
      this.filteredProjets = [...this.projets];
    } else {
      const compareStatus = status.toUpperCase();
      this.filteredProjets = this.projets.filter(projet => 
        projet.etat.toUpperCase() === compareStatus
      );
    }
  }

  onSearchInput(): void {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      const term = this.searchTerm.toLowerCase();

      if (this.activeTab === 'validation') {
        this.filteredProjets = this.projets.filter(p =>
          p.titre.toLowerCase().includes(term) ||
          p.enseignant.nom.toLowerCase().includes(term)
        );
      } else if (this.activeTab === 'liste') {
        const projetsValides = this.projets.filter(p => 
          p.etat.toUpperCase() === 'VALIDE' &&
          (p.titre.toLowerCase().includes(term) || p.enseignant.nom.toLowerCase().includes(term))
        );
        this.groupedProjets = this.groupByEncadrant(projetsValides);
      }
    }, 300);
  }

  showProjetDetail(projet: Projet): void {
    this.selectedProjet = { ...projet };
    this.showDetail = true;
  }

  backToList(): void {
    this.showDetail = false;
  }

  validerProjet(): void {
    this.updateProjetStatus('VALIDE');
  }
  
  refuserProjet(): void {
    this.updateProjetStatus('ANNULEE');
  }

  private updateProjetStatus(status: string): void {
    if (!this.selectedProjet) return;
    
    this.projetService.updateProjetStatus(this.selectedProjet.id, status)
      .subscribe({
        next: (updatedProjet) => {
          console.log('Project updated successfully:', updatedProjet);
          this.loadProjets();
          this.backToList();
        },
        error: (error) => {
          console.error('Failed to update project status:', error);
        }
      });
  }

  getStatusClass(status: string): string {
    const cleanStatus = (status || '').trim().toUpperCase();
    switch (cleanStatus) {
      case 'VALIDE':
        return 'status-valide';
      case 'EN_ATTENTE':
        return 'status-attente';
      case 'ANNULEE':
        return 'status-annulee';
      default:
        return '';
    }
  }
  
  filterProjets(): void {
    this.filteredProjets = this.filiereFilter === 'tous'
      ? [...this.projets]
      : this.projets.filter(p => p.filiere === this.filiereFilter);
  }

  getFiliereClass(filiere: string): string {
    return filiere === 'GSIL' ? 'badge-gsil' : 'badge-meca';
  }
}