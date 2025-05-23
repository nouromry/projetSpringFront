import { Binome } from './binome.model';
import { Projet } from './projet.model';

export class Document {
  id: number;
  titre: string;
  type: Document.Type;
  dateDepot: Date;
  cheminFichier: string;
  binome?: Binome;
  projet?: Projet;

  constructor() {
    this.id = 0;
    this.titre = '';
    this.type = Document.Type.normal;
    this.dateDepot = new Date();
    this.cheminFichier = '';
  
  }
}

export namespace Document {
  export enum Type {
    rapport_final = 'rapport_final',
    normal = 'normal'
  }
}