// src/app/models/document-details.dto.ts

export interface DocumentDetailsDTO {
    id: number;
    titre: string;
    type: 'rapport_final' | 'normal';
    dateDepot: Date;
    cheminFichier: string;
    
    // Binome details
    binomeId: number;
    etudiant1Nom: string;
    etudiant1Prenom: string;
    etudiant1Filiere: string;
    etudiant2Nom: string;
    etudiant2Prenom: string;
    etudiant2Filiere: string;
    
    // Project details
    projetId: number;
    projetTitre: string;
    
    // Enseignant details
    enseignantId: number;
    enseignantNom: string;
    enseignantPrenom: string;
  }