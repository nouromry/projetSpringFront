import { Binome } from './binome.model';
import { JurySoutenance } from './jury-soutenance.model';

export interface Soutenance {
  id?: number;
  salle?: string;
  date?: string | Date;
  heureD?: string | Date;
  titre?: string;
  binome?: Binome;
  jury?: JurySoutenance[];
}
