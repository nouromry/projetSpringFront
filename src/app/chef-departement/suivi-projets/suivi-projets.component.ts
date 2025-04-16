import { Component, OnInit } from '@angular/core';

interface Projet {
  id: number;
  enseignant: string;
  sujet: string | null;
  dateDepot: string;
  statut: 'validé' | 'en attente' | 'annulée';
}

interface Sujet {
  name: string;
  email: string;
  sujet: string;
  filiere: 'MECA' | 'GSI';
}

@Component({
  selector: 'app-suivi-projets',
  templateUrl: './suivi-projets.component.html',
  styleUrls: ['./suivi-projets.component.css']
})
export class SuiviProjetsComponent implements OnInit {
  // Onglet actif
  activeTab: string = 'validation';

  // Données pour l'onglet Validation
  projets: Projet[] = [
    { id: 1, enseignant: 'Chaima Dabbou', sujet: 'sujet 1', dateDepot: '07/01/2025', statut: 'validé' },
    { id: 2, enseignant: 'Arij Chabbouh', sujet: 'sujet 2', dateDepot: '30/12/2024', statut: 'en attente' },
    { id: 3, enseignant: 'Maram Amor', sujet: null, dateDepot: '06/01/2025', statut: 'en attente' },
    { id: 4, enseignant: 'Sandra dissem', sujet: null, dateDepot: '14/12/2024', statut: 'en attente' },
    { id: 5, enseignant: 'Chahd Baatout', sujet: null, dateDepot: '03/01/2025', statut: 'validé' },
    { id: 6, enseignant: 'Arij Meddeb', sujet: 'sujet', dateDepot: '05/01/2025', statut: 'en attente' },
    { id: 7, enseignant: 'Chahd ben ali', sujet: 'sujet', dateDepot: '07/01/2025', statut: 'validé' },
    { id: 8, enseignant: 'Aziz Ben Saad', sujet: 'sujet', dateDepot: '11/12/2024', statut: 'validé' },
    { id: 9, enseignant: 'Asma Daoued', sujet: 'sujet', dateDepot: '17/12/2024', statut: 'validé' },
    { id: 10, enseignant: 'Hanen Baatout', sujet: 'sujet', dateDepot: '13/12/2024', statut: 'annulée' }
  ];

  filteredProjets: Projet[] = [];
  selectedStatus: string = 'tous';

  // Données pour l'onglet Liste des sujets
  sujets: Sujet[] = [
    { name: 'Chaimo Dabbou', email: 'Chaimo.Dabbou@gmail.com', sujet: 'sujet 1', filiere: 'MECA' },
    { name: 'Arj Chatbouh', email: 'Arj.Chatbouh@gmail.com', sujet: 'sujet 2', filiere: 'MECA' },
    { name: 'Mouam Amor', email: 'Mouam.Amor@gmail.com', sujet: 'sujet 3', filiere: 'MECA' },
    { name: 'Sondra diesem', email: 'Sondra.dissem@gmail.com', sujet: 'sujet 4', filiere: 'GSI' },
    { name: 'Charles Bostout', email: 'Chahd.Bostout@gmail.com', sujet: 'sujet 5', filiere: 'GSI' },
    { name: 'Arj Medeleb', email: 'Arj.Medeleb@gmail.com', sujet: 'sujet 6', filiere: 'MECA' },
    { name: 'Charlat Ben ali', email: 'CharlatBenAli@gmail.com', sujet: 'sujet 7', filiere: 'MECA' },
    { name: 'Astr Ben Scad', email: 'AstrBenscad@gmail.com', sujet: 'sujet 8', filiere: 'GSI' },
    { name: 'Asma Douaud', email: 'AsmaDouaud@gmail.com', sujet: 'sujet 9', filiere: 'GSI' },
    { name: 'Hosen Bastout', email: 'HosenBastout@gmail.com', sujet: 'sujet 10', filiere: 'MECA' }
  ];

  filteredSujets: Sujet[] = [];
  filiereFilter: string = 'tous';
  searchTerm: string = '';

  ngOnInit(): void {
    this.filteredProjets = [...this.projets];
    this.filteredSujets = [...this.sujets];
  }

  // Changement d'onglet
  switchTab(tab: string): void {
    this.activeTab = tab;
  }

  // Filtrage pour l'onglet Validation
  filterByStatus(status: string): void {
    this.selectedStatus = status;
    if (status === 'tous') {
      this.filteredProjets = [...this.projets];
    } else {
      this.filteredProjets = this.projets.filter(projet => projet.statut === status);
    }
  }

  // Filtrage pour l'onglet Liste des sujets
  filterSujets(): void {
    this.filteredSujets = this.sujets.filter(sujet => {
      const matchesFiliere = this.filiereFilter === 'tous' || sujet.filiere === this.filiereFilter;
      const matchesSearch = this.searchTerm === '' || 
        sujet.name.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
        sujet.sujet.toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchesFiliere && matchesSearch;
    });
  }

  // Classes CSS pour les statuts
  getStatusClass(status: string): string {
    switch (status) {
      case 'validé': return 'status-valide';
      case 'en attente': return 'status-attente';
      case 'annulée': return 'status-annulee';
      default: return '';
    }
  }

  // Classes CSS pour les filières
  getFiliereClass(filiere: string): string {
    return filiere === 'MECA' ? 'meca-badge' : 'gsi-badge';
  }
}