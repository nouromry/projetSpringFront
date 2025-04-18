import { user } from './user.model';

export interface ChefDep extends user {
  departement: string;
}