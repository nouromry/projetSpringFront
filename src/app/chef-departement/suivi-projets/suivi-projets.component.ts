import { Component, OnInit } from '@angular/core';
import { Projet } from 'src/app/models/projet.model';
import { ProjetService } from 'src/app/services/projet.service';
import { Enseignant } from 'src/app/models/enseignant.model'; 
@Component({
  selector: 'app-suivi-projets',
  templateUrl: './suivi-projets.component.html',
  styleUrls: ['./suivi-projets.component.css']
})
export class SuiviProjetsComponent implements OnInit {
  activeTab: string = 'validation';
  showDetail: boolean = false;
  selectedProjet!: Projet;

  projets: Projet[] = [];
  filteredProjets: Projet[] = [];
  groupedProjets: { [key: string]: Projet[] } = {};
  selectedStatus: string = 'tous';
  searchTerm: string = '';
  filiereFilter: string = 'tous';
  private searchTimeout: any;
  role: string = 'Chef de département';

  constructor(private projetService: ProjetService) {}

  ngOnInit(): void {

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.role = user?.role || 'Invité';
    this.loadProjets();
  }
  loadProjets(): void {
    this.projetService.getAllProjets().subscribe(data => {
      this.projets = data;
      this.filteredProjets = [...data];   
      this.groupedProjets = this.groupByEncadrant(this.projets);
    
    });
  } 
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