export class BinomeDTO {
    etud1: {
      utilisateur: { prenom: string; nom: string };
      filiere: string;
      groupe: string;
      moyenneGeneral: number;
    };
    etud2: {
      utilisateur: { prenom: string; nom: string };
      filiere: string;
      groupe: string;
      moyenneGeneral: number;
    };
    moyenneBinome: number;
    choixProjets: string[];  // Liste des titres de projets
  
    constructor() {
      this.etud1 = { utilisateur: { prenom: '', nom: '' }, filiere: '', groupe: '', moyenneGeneral: 0 };
      this.etud2 = { utilisateur: { prenom: '', nom: '' }, filiere: '', groupe: '', moyenneGeneral: 0 };
      this.moyenneBinome = 0;
      this.choixProjets = [];
    }
  }
  