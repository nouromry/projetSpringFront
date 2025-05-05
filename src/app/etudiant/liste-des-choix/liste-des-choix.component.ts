import { Component, OnInit } from '@angular/core';
import { Etudiant } from 'src/app/models/etudiant.model';
import { Binome } from 'src/app/models/binome.model';
import { ProjetChoixDTO } from 'src/app/models/ProjetChoixDTO.model';
import { EtudiantService } from 'src/app/services/etudiant.service';
import { ChoixProjetService } from 'src/app/services/choix-projet.service';
import { Projet } from 'src/app/models/projet.model';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { UserRole } from 'src/app/models/utilisateur.model';

@Component({
  selector: 'app-liste-des-choix',
  templateUrl: './liste-des-choix.component.html',
  styleUrls: ['./liste-des-choix.component.css']
})
export class ListeDesChoixComponent implements OnInit {
  // Variables pour la recherche
  searchText: string = '';
  
  // Variables pour filtrer les projets
  selectedFiliere: string = '';
  selectedStatus: string = '';
  
  // Variables pour notification
  notification: {message: string, type: 'success' | 'error' | 'warning'} | null = null;
  
  // Variables pour les étudiants
  etudiant1: Etudiant = {
    id: 0,
    matricule: '',
    nom: '',
    prenom: '',
    moyenneGeneral: 0,
    filiere: '',
    email: '',
    password: '',
    role: UserRole.ETUDIANT
  };
  
  etudiant2: Etudiant = {
    id: 0,
    matricule: '',
    nom: '',
    prenom: '',
    moyenneGeneral: 0,
    filiere: '',
    email: '',
    password: '',
    role: UserRole.ETUDIANT
  };
  
  // Variables pour les projets et choix
  projetsDisponibles: Projet[] = [];
  allProjets: Projet[] = [];
  projetSelectionnes: any[] = [];
  binome: Binome | null = null;
  isLoading = false;
  
  // Filtres disponibles
  filiereOptions: string[] = ['Informatique', 'Électronique', 'Mécanique']; // Ajoutez les filières appropriées
  statusOptions: string[] = ['Disponible', 'Assigné', 'Terminé']; // Ajoutez les statuts appropriés
  
  constructor(
    private choixProjetService: ChoixProjetService,
    private etudiantService: EtudiantService
  ) { }
  
  ngOnInit(): void {
    this.loadAllProjets();
  }
  
  /**
   * Affiche une notification
   */
  showNotification(message: string, type: 'success' | 'error' | 'warning'): void {
    this.notification = { message, type };
    setTimeout(() => {
      this.notification = null;
    }, 3000);
  }
  
  /**
   * Charge tous les projets
   */
  loadAllProjets(): void {
    this.isLoading = true;
    this.choixProjetService.getProjetsDisponibles()
      .pipe(
        catchError(err => {
          this.showNotification('Erreur lors du chargement des projets', 'error');
          return of([]);
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe(data => {
        this.allProjets = data;
        this.projetsDisponibles = [...data]; // Copie initiale
      });
  }
  
  /**
   * Filtre les projets par statut
   * Note: Cette méthode nécessite une adaptation selon l'API disponible
   */
  filterByStatus(status: string): void {
    this.selectedStatus = status;
    this.applyFilters();
  }
  
  /**
   * Filtre les projets par filière
   * Note: Cette méthode nécessite une adaptation selon l'API disponible
   */
  filterByFiliere(filiere: string): void {
    this.selectedFiliere = filiere;
    this.applyFilters();
  }
  
  /**
   * Applique tous les filtres sélectionnés
   * Note: Cette méthode utilise un filtrage côté client pour la démonstration
   */
  applyFilters(): void {
    this.isLoading = true;
    
   
    
    this.isLoading = false;
  }
  
  /**
   * Recherche un étudiant par son matricule
   */
  rechercherEtudiant(etudiantIndex: number): void {
    const matricule = etudiantIndex === 1 ? this.etudiant1.matricule : this.etudiant2.matricule;
    
    if (!matricule) {
      this.showNotification('Veuillez saisir un matricule', 'warning');
      return;
    }
    
    this.isLoading = true;
    this.etudiantService.getEtudiantByMatricule(matricule)
      .pipe(
        catchError(err => {
          this.showNotification('Étudiant non trouvé', 'error');
          return of(null);
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe(data => {
        if (data) {
          if (etudiantIndex === 1) {
            this.etudiant1 = data;
          } else {
            this.etudiant2 = data;
          }
          this.showNotification('Étudiant trouvé', 'success');
        }
      });
  }
  
  /**
   * Crée un binôme à partir des deux étudiants
   */
  creerBinome(): void {
    if (!this.etudiant1.matricule || !this.etudiant2.matricule) {
      this.showNotification('Veuillez saisir les matricules des deux étudiants', 'warning');
      return;
    }
    
    this.isLoading = true;
    this.choixProjetService.creerBinome(this.etudiant1.matricule, this.etudiant2.matricule)
      .pipe(
        catchError(err => {
          this.showNotification(err.error?.message || 'Erreur lors de la création du binôme', 'error');
          return of(null);
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe(data => {
        if (data) {
          this.binome = data;
          this.showNotification('Binôme créé avec succès', 'success');
          
          // Filtrer automatiquement par la filière du binôme
          if (this.etudiant1.filiere) {
            this.selectedFiliere = this.etudiant1.filiere;
            this.filterByFiliere(this.etudiant1.filiere);
          }
        }
      });
  }
  
  /**
   * Ajoute un projet à la liste des choix
   */
  ajouterProjet(projet: Projet): void {
    if (this.projetSelectionnes.length >= 10) {
      this.showNotification('Vous ne pouvez pas sélectionner plus de 10 projets', 'warning');
      return;
    }
    
    const projetExiste = this.projetSelectionnes.find(p => p.id === projet.id);
    if (projetExiste) {
      this.showNotification('Ce projet est déjà dans votre liste de choix', 'warning');
      return;
    }
    
    // Ajout avec priorité = position dans la liste + 1
    this.projetSelectionnes.push({
      ...projet,
      ordre: this.projetSelectionnes.length + 1  // Utilisez "ordre" au lieu de "priorite"
    });
    
    this.showNotification(`Projet "${projet.titre}" ajouté à la liste de choix`, 'success');
  }
  
  /**
   * Supprime un projet de la liste des choix
   */
  supprimerProjet(index: number): void {
    this.projetSelectionnes.splice(index, 1);
    
    // Réajuster les priorités
    this.projetSelectionnes.forEach((projet, i) => {
      projet.ordre = i + 1;  // Utilisez "ordre" au lieu de "priorite"
    });
    
    this.showNotification('Projet retiré de la liste de choix', 'success');
  }
  
  /**
   * Déplace un projet vers le haut dans la liste (augmente la priorité)
   */
  monterProjet(index: number): void {
    if (index === 0) return;
    
    const temp = this.projetSelectionnes[index];
    this.projetSelectionnes[index] = this.projetSelectionnes[index - 1];
    this.projetSelectionnes[index - 1] = temp;
    
    // Réajuster les priorités
    this.projetSelectionnes.forEach((projet, i) => {
      projet.ordre = i + 1;  // Utilisez "ordre" au lieu de "priorite"
    });
  }
  
  /**
   * Déplace un projet vers le bas dans la liste (diminue la priorité)
   */
  descendreProjet(index: number): void {
    if (index === this.projetSelectionnes.length - 1) return;
    
    const temp = this.projetSelectionnes[index];
    this.projetSelectionnes[index] = this.projetSelectionnes[index + 1];
    this.projetSelectionnes[index + 1] = temp;
    
    // Réajuster les priorités
    this.projetSelectionnes.forEach((projet, i) => {
      projet.ordre = i + 1;  // Utilisez "ordre" au lieu de "priorite"
    });
  }
  
  /**
   * Enregistre les choix de projets pour le binôme
   */
  validerChoix(): void {
    if (!this.binome) {
      this.showNotification('Veuillez créer un binôme avant de valider vos choix', 'warning');
      return;
    }
    
    if (this.projetSelectionnes.length === 0) {
      this.showNotification('Veuillez sélectionner au moins un projet', 'warning');
      return;
    }
    
    // Préparer les données pour l'API
    const choix: ProjetChoixDTO[] = this.projetSelectionnes.map(projet => ({
      idProjet: projet.id,
      priorite: projet.priorite
    }));
    
    
    this.isLoading = true;
    
    // S'assurer que binome.id existe avant l'appel
    if (this.binome && this.binome.id !== undefined) {
      this.choixProjetService.enregistrerChoixProjets(this.binome.id, choix)
        .pipe(
          catchError(err => {
            this.showNotification(err.error?.message || 'Erreur lors de l\'enregistrement des choix', 'error');
            return of(null);
          }),
          finalize(() => this.isLoading = false)
        )
        .subscribe(data => {
          if (data) {
            this.showNotification('Vos choix ont été enregistrés avec succès', 'success');
            // Réinitialiser le formulaire après validation
            this.resetForm();
          }
        });
    } else {
      this.isLoading = false;
      this.showNotification('ID du binôme invalide', 'error');
    }
  }
  
  /**
   * Réinitialise le formulaire après validation
   */
  resetForm(): void {
    this.etudiant1 = {
      id: 0,
      matricule: '',
      nom: '',
      prenom: '',
      moyenneGeneral: 0,
      filiere: '',
      email: '',
      password: '',
      role: UserRole.ETUDIANT
    };
    
    this.etudiant2 = {
      id: 0,
      matricule: '',
      nom: '',
      prenom: '',
      moyenneGeneral: 0,
      filiere: '',
      email: '',
      password: '',
      role: UserRole.ETUDIANT
    };
    
    this.binome = null;
    this.projetSelectionnes = [];
    this.selectedFiliere = '';
    this.loadAllProjets();
  }
  
  /**
   * Filtre les projets selon le texte de recherche
   */
  get projetsFiltres(): Projet[] {
    if (!this.searchText) {
      return this.projetsDisponibles;
    }
    
    const searchTerms = this.searchText.toLowerCase();
    return this.projetsDisponibles.filter(projet => 
      projet.titre.toLowerCase().includes(searchTerms) ||
      (projet.description && projet.description.toLowerCase().includes(searchTerms)) ||
      (projet.technologies && projet.technologies.toLowerCase().includes(searchTerms))
    );
  }
}