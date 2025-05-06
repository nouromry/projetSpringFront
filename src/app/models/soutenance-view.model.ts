import { JurySoutenance } from "./jury-soutenance.model";

export interface SoutenanceView {
  id?: number;
  salle?: string;
  dateSoutenance?: string;
  heureD?: string;          
  heureDebut?: string;      
  disponible?: boolean;
  nombreBinomes?: number;   
  

  encadrant?: string;
  examinateur?: string;
  

  binomeId?: number;
  binomeEtudiant1?: string;
  binomeEtudiant2?: string;
  binome?: any;
  
  projetId?: number;
  projetTitre?: string;
  projetDescription?: string;
  projetTechnologies?: string;
  titre?: string;

  jury?: JurySoutenance[];
  juryMembers?: JuryMemberDTO[];
  enseignants?: string;
}
export interface JuryMemberDTO {
  enseignantId: number;
  role: string;
  fullName?: string;
  nomComplet?: string;
}
export enum JuryRole {
  ENCADRANT = 'encadrant',
  EXAMINATEUR = 'examinateur',
}