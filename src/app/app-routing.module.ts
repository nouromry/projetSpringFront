import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GestionSoutenancesComponent } from './chef-departement/gestion-soutenances/gestion-soutenances.component'; // Update with the correct path to the component


const routes: Routes = [{ path: 'login', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) }, 
  { path: 'chef-departement', loadChildren: () => import('./chef-departement/chef-departement.module').then(m => m.ChefDepartementModule) }, 
  { path: 'etudiant', loadChildren: () => import('./etudiant/etudiant.module').then(m => m.EtudiantModule) },
   { path: 'enseignant', loadChildren: () => import('./enseignant/enseignant.module').then(m => m.EnseignantModule) },
   { path: '', redirectTo: 'login', pathMatch: 'full' }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
