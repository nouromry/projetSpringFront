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
  private TEST_MODE = true; // Set to false in production
  private TEST_USER_ID = 6; // ID of the test user to use

  constructor(
    private espaceEchangeService: EchangeEtudiantService,
    private authService: AuthService
  ) {
    // Get current user from auth service or use test user if TEST_MODE is enabled
    this.currentUser = this.authService.currentUserValue;
    
    // If TEST_MODE is enabled, use the test user ID instead of the actual user ID
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
          // Mark unread comments
          this.markUnreadComments();
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors du chargement des commentaires.';
          console.error('Error loading comments:', err);
        }
      });
  }

  markUnreadComments(): void {
    // Mark any unread comments when they're loaded
    this.espaceEchangeService.getUnreadCommentsForEtudiant(this.etudiantId)
      .subscribe({
        next: (unreadComments) => {
          // Optional: Mark these comments somehow in the UI
          unreadComments.forEach(unread => {
            const comment = this.comments.find(c => c.id === unread.id);
            if (comment) {
              comment.lu = false;
            }
          });
        }
      });
  }

  markAsRead(commentId: number): void {
    this.espaceEchangeService.markCommentAsRead(commentId)
      .subscribe({
        next: () => {
          // Find the comment and mark it as read locally
          const comment = this.comments.find(c => c.id === commentId);
          if (comment) {
            comment.lu = true;
          }
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors du marquage du commentaire comme lu.';
          console.error('Error marking comment as read:', err);
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
          // Success - reload comments and clear form
          this.loadComments();
          this.newComment = '';
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors de l\'envoi du commentaire.';
          console.error('Error posting comment:', err);
        }
      });
  }

  getEnseignantName(): string {
    if (!this.projet) return 'Non assigné';
    return `${this.projet.encadrantPrenom} ${this.projet.encadrantNom}`;
  }

  getBinomeNames(): string {
    if (!this.projet || !this.projet.binome) return 'Pas de binôme';
    
    return `${this.projet.binome.etudiant1Prenom} ${this.projet.binome.etudiant1Nom} et 
            ${this.projet.binome.etudiant2Prenom} ${this.projet.binome.etudiant2Nom}`;
  }

  getProjectState(): string {
    if (!this.projet) return 'Non assigné';
    return this.projet.etat || 'En cours';
  }

  private sortCommentsByDate(comments: CommentaireDTO[]): CommentaireDTO[] {
    return [...comments].sort((a, b) => {
      return new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime();
    });
  }

  get displayedComments(): CommentaireDTO[] {
    return this.comments;
  }
}