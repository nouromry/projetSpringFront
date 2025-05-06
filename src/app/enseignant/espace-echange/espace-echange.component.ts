import { Component, OnInit } from '@angular/core';
import { EchangeEnseignantService } from 'src/app/services/echange-enseignant-service.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-espace-echange',
  templateUrl: './espace-echange.component.html',
  styleUrls: ['./espace-echange.component.css']
})
export class EspaceEchangeComponent implements OnInit {
  projets: any[] = [];
  selectedProjet: any = null;
  comments: any[] = [];
  newComment = '';
  isLoading = false;
  errorMessage = '';
  filteredProjets: any[] = [];
  currentUser: any;
  displayedComments: any[] = [];
  searchTerm = ''; 
  constructor(
    private echangeService: EchangeEnseignantService,
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }
    this.loadProjects();
  }

  getBinomeNames(projet: any): string {
    try {
      if (!projet?.binomeAffecte) {
        return 'Binôme non affecté';
      }
      
      const etud1 = projet.binomeAffecte?.etud1;
      const etud2 = projet.binomeAffecte?.etud2;
      
      if (!etud1 || !etud2) {
        return 'Binôme incomplet';
      }
      
      return `${etud1.prenom} ${etud1.nom} & ${etud2.prenom} ${etud2.nom}`;
    } catch (error) {
      console.error('Error formatting binome names:', error);
      return 'Erreur d\'affichage';
    }
  }

  loadProjects(): void {
    this.isLoading = true;
    this.echangeService.getProjectsForEnseignant(this.currentUser.id).subscribe({
      next: (projets) => {
        this.projets = projets;
        if (projets.length > 0) {
          this.selectProjet(projets[0]);
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement des projets';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  selectProjet(projet: any): void {
    this.selectedProjet = projet;
    this.loadComments(projet.id);
  }

  loadComments(projetId: number): void {
    this.isLoading = true;
    this.echangeService.getCommentsForProject(projetId).subscribe({
      next: (comments) => {
        this.comments = comments.map(c => ({
          ...c,
          dateCommentaire: new Date(c.dateCommentaire)
        }));
        this.displayedComments = [...this.comments];
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors du chargement des commentaires';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  postComment(): void {
    if (!this.selectedProjet || !this.newComment.trim()) return;
  
    this.isLoading = true;
    const projetId = this.selectedProjet.id;
    
    this.echangeService.addComment(
      this.currentUser.id,
      projetId,
      this.newComment
    ).subscribe({
      next: () => {
        this.loadComments(projetId);
        this.newComment = '';
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors de l\'envoi du commentaire';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  filterProjects(): void {
    if (!this.searchTerm) {
      this.filteredProjets = [...this.projets];
      return;
    }
    
    const term = this.searchTerm.toLowerCase();
    this.filteredProjets = this.projets.filter(projet => 
      projet.titre.toLowerCase().includes(term) ||
      this.getBinomeNames(projet).toLowerCase().includes(term) ||
      projet.filiere.toLowerCase().includes(term)
    );
  }
}