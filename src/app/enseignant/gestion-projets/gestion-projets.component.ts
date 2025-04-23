import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Projet } from 'src/app/models/projet.model';
import { ProjetService } from 'src/app/services/projet.service';
import { Enseignant } from 'src/app/models/enseignant.model'; 
import { EnseignantService } from 'src/app/services/enseignant.service';

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

  constructor(
    private projetService: ProjetService,
    private enseignantService: EnseignantService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.role = user?.role || 'Invité';
    this.loadProjets();
    this.loadEnseignants();
    this.initForm();
  }

  loadProjets(): void {
    this.projetService.getAllProjets().subscribe(data => {
      this.projets = data;
      this.filteredProjets = [...data];   
      this.groupedProjets = this.groupByEncadrant(this.projets);
    });
  }

  loadEnseignants(): void {
    this.enseignantService.getAllEnseignants().subscribe(data => {
      this.enseignants = data;
    });
  }

  initForm(): void {
    this.projetForm = this.fb.group({
      titre: ['', Validators.required],
      description: ['', Validators.required],
      technologies: ['', Validators.required],
      filiere: ['', Validators.required],
      enseignant: [null, Validators.required]
    });
  }

  toggleAddForm(): void {
    this.showAddForm = !this.showAddForm;
    if (!this.showAddForm) {
      this.projetForm.reset();
    }
  }

  onSubmitProjet(): void {
    if (this.projetForm.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.projetForm.controls).forEach(key => {
        const control = this.projetForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    const formValue = this.projetForm.value;
    
    // Create new projet object directly from form values and defaults
    const newProjet: Projet = {
      id: 0, // This will be assigned by the backend
      titre: formValue.titre,
      description: formValue.description,
      technologies: formValue.technologies,
      etat: 'EN_ATTENTE', // Default status for new projects
      dateDepot: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
      dateAffectation: '',
      filiere: formValue.filiere,
      enseignant: formValue.enseignant // This is the entire Enseignant object
    };

    this.projetService.createProjet(newProjet).subscribe({
      next: (createdProjet) => {
        console.log('Project created successfully:', createdProjet);
        this.loadProjets(); // Reload projects list
        this.toggleAddForm(); // Close the form
      },
      error: (error) => {
        console.error('Failed to create project:', error);
      }
    });
  }

  // Rest of your component code remains the same
  groupByEncadrant(projets: Projet[]): { [key: string]: Projet[] } {
    return projets.reduce((acc, projet) => {
      const enseignantNom = projet.enseignant.nom; // Utiliser le nom de l'enseignant pour regrouper
      if (!acc[enseignantNom]) {
        acc[enseignantNom] = [];
      }
      acc[enseignantNom].push(projet); // Utiliser enseignantNom et non enseignant.nom
      return acc;
    }, {} as { [key: string]: Projet[] }); // Spécifier le type de `acc`
  }
  
  objectKeys(obj: { [key: string]: any }): string[] {
    return Object.keys(obj);
  }

  switchTab(tab: string): void {
    this.activeTab = tab;
    this.showDetail = false;
    this.showAddForm = false; // Close add form when switching tabs
    if (tab === 'validation') {
      this.filterByStatus('tous');
    } else if (tab === 'liste') {
      const projetsValides = this.projets.filter(p => p.etat.toUpperCase() === 'VALIDE');
      this.groupedProjets = this.groupByEncadrant(projetsValides);
      this.filterProjets(); // pour appliquer le filtre par filière
    }
  }

  filterByStatus(status: string): void {
    this.selectedStatus = status;
    if (status === 'tous') {
      this.filteredProjets = [...this.projets];
    } else {
      // Convert the status for comparison
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