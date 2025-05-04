import { JurySoutenance } from "./jury-soutenance.model";

export interface SoutenanceView {
  id?: number;
  salle?: string;
  dateSoutenance?: string;
  heureD?: string;          // Used in Angular service for display
  heureDebut?: string;      // Used in API requests
  disponible?: boolean;
  nombreBinomes?: number;   
  
  // Jury roles as separate fields for display
  encadrant?: string;
  examinateur?: string;
  
  // Binome information
  binomeId?: number;
  binomeEtudiant1?: string;
  binomeEtudiant2?: string;
  binome?: any;
  
  // Project information
  projetId?: number;
  projetTitre?: string;
  projetDescription?: string;
  projetTechnologies?: string;
  titre?: string;
  
  // Jury members
  jury?: JurySoutenance[];
  juryMembers?: JuryMemberDTO[];
  enseignants?: string;
}
export interface JuryMemberDTO {
  enseignantId: number;
  role: JuryRole;
}
export enum JuryRole {
  ENCADRANT = 'encadrant',
  EXAMINATEUR = 'examinateur',
}
