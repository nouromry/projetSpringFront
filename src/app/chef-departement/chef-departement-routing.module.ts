import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChefDepartementComponent } from './chef-departement.component';
import { GestionEtudiantsComponent } from './gestion-etudiants/gestion-etudiants.component';
import { GestionSoutenancesComponent } from './gestion-soutenances/gestion-soutenances.component';
import { SuiviProjetsComponent } from './suivi-projets/suivi-projets.component';

const routes: Routes = [
  {
    path: '',
    component: ChefDepartementComponent,
    children: [
      {
        path: 'gestion-etudiant',
        component: GestionEtudiantsComponent,
      },
      {
        path: '',
        redirectTo: 'gestion-etudiant',
        pathMatch: 'full',
      },
      {
        path: 'gestion-soutenances',
        component: GestionSoutenancesComponent,
      },
      {
        path: 'suivi-projets',
        component:  SuiviProjetsComponent,
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChefDepartementRoutingModule {}
