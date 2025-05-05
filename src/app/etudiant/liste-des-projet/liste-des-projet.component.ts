import { Component, OnInit } from '@angular/core';
import { ProjetService } from '../../services/projet.service';
import { AuthService } from '../../services/auth.service';
import { Projet } from '../../models/projet.model';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Etudiant } from 'src/app/models/etudiant.model';
import { EtudiantService } from 'src/app/services/etudiant.service';
@Component({
  selector: 'app-liste-des-projet',
  templateUrl: './liste-des-projet.component.html',
  styleUrls: ['./liste-des-projet.component.css']
})
export class ListeDesProjetComponent implements OnInit {
  projets: Projet[] = [];
  currentUser: any;
  etudiantDetails: Etudiant | null = null;
  projetForm: FormGroup;
  isSubmitting = false;
  showForm = false;
  showDetail = false;
  activeTab = 'validation'; // Default tab
  selectedProjet: Partial<Projet> = {};
  submissionResult = { success: false, message: '' };

  constructor(
    private etudiantService: EtudiantService,
    private projetService: ProjetService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.projetForm = this.fb.group({
      titre: ['', [Validators.required]],
      description: ['', [Validators.required]],
      technologies: ['', [Validators.required]],
      filiere: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    this.loadEtudiantDetails();
    this.loadProjets();
  }

  loadEtudiantDetails(): void {
    if (this.currentUser && this.currentUser.id) {
      this.etudiantService.getEtudiantDetails(this.currentUser.id).subscribe(
        etudiant => {
          this.etudiantDetails = etudiant;
        },
        error => {
          console.error('Erreur lors du chargement des détails de l\'étudiant:', error);
        }
      );
    }
  }

  loadProjets(): void {
    this.projetService.getAllProjets().subscribe(
      projets => {
        this.projets = projets;
      },
      error => {
        console.error('Erreur lors du chargement des projets:', error);
      }
    );
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (this.showForm) {
      this.projetForm.reset();
      this.submissionResult = { success: false, message: '' };
    }
  }

  onSubmit(): void {
    if (this.projetForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.submissionResult = { success: false, message: '' };

    const projetData = this.projetForm.value;

    if (this.currentUser && this.currentUser.id) {
      this.etudiantService.creerProjet(this.currentUser.id, projetData).subscribe(
        (nouveauProjet) => {
          this.isSubmitting = false;
          this.submissionResult = { 
            success: true, 
            message: 'Projet créé avec succès!' 
          };
          this.loadProjets(); // Recharger la liste des projets
          this.projetForm.reset();
          setTimeout(() => {
            this.showForm = false;
          }, 2000);
        },
        (error) => {
          this.isSubmitting = false;
          this.submissionResult = { 
            success: false, 
            message: 'Erreur lors de la création du projet. Veuillez réessayer.' 
          };
          console.error('Erreur lors de la création du projet:', error);
        }
      );
    } else {
      this.isSubmitting = false;
      this.submissionResult = { 
        success: false, 
        message: 'Utilisateur non connecté ou ID non disponible.' 
      };
    }
  }
  // Méthode pour afficher les détails d'un projet
  showProjetDetail(projet: Projet): void {
    this.selectedProjet = { ...projet };
    this.showDetail = true;
  }

  // Méthode pour revenir à la liste des projets
  backToList(): void {
    this.showDetail = false;
    this.selectedProjet = {};
  }
}