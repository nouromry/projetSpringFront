import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { AuthService, User } from 'src/app/services/auth.service';
import { EchangeEtudiantService, CommentaireDTO, ProjetWithBinomeDTO } from 'src/app/services/echange-etudiant.service';

@Component({
  selector: 'app-espace-echange',
  templateUrl: './espace-echange.component.html',
  styleUrls: ['./espace-echange.component.css']
})
export class EspaceEchangeComponent implements OnInit {
  etudiantId: number;
  projet: ProjetWithBinomeDTO | null = null;
  comments: CommentaireDTO[] = [];
  newComment: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;
  currentUser: User | null;

  // Test user configuration
  private TEST_MODE = false; 
  private TEST_USER_ID = 3; 

  constructor(
    private espaceEchangeService: EchangeEtudiantService,
    private authService: AuthService
  ) {
    this.currentUser = this.authService.currentUserValue;
    
    if (this.TEST_MODE) {
      console.log('🧪 TEST MODE ACTIVE - Using test user ID:', this.TEST_USER_ID);
      this.etudiantId = this.TEST_USER_ID;
    } else {
      this.etudiantId = this.currentUser?.id || 0;
    }
  }

  ngOnInit(): void {
    if (this.etudiantId) {
      this.loadProjet();
      this.loadComments();
    } else {
      this.errorMessage = 'Utilisateur non authentifié';
    }
  }

  loadProjet(): void {
    this.isLoading = true;
    this.espaceEchangeService.getProjetForEtudiant(this.etudiantId)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (data) => {
          this.projet = data;
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors du chargement du projet.';
          console.error('Error loading project:', err);
        }
      });
  }

  loadComments(): void {
    this.isLoading = true;
    this.espaceEchangeService.getAllCommentsForEtudiantProjects(this.etudiantId)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (data) => {
          this.comments = this.sortCommentsByDate(data);
          console.log('✅ Sorted Comments:', this.comments.map(c => c.dateCreation));
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors du chargement des commentaires.';
          console.error('Error loading comments:', err);
        }
      });
  }

  postComment(): void {
    if (!this.newComment.trim()) return;
    
    this.isLoading = true;
    this.espaceEchangeService.addComment(this.etudiantId, this.newComment)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: () => {
          this.newComment = '';
          this.loadComments(); 
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors de l\'envoi du commentaire.';
          console.error('Error posting comment:', err);
        }
      });
  }

  getProjectState(): string {
    if (!this.projet) return 'Non assigné';
    return this.projet.etat || 'En cours';
  }

  private sortCommentsByDate(comments: CommentaireDTO[]): CommentaireDTO[] {
    return [...comments].sort((a, b) => {
      return new Date(a.dateCreation).getTime() - new Date(b.dateCreation).getTime(); // ascending
    });
  }
}
