// src/app/chef-departement/chef-departement-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChefDepartementComponent } from './chef-departement.component';
import { SuiviProjetsComponent } from './suivi-projets/suivi-projets.component';
import { GestionSoutenancesComponent } from './gestion-soutenances/gestion-soutenances.component';
import { RapportsPfaComponent } from './rapports-pfa/rapports-pfa.component';

const routes: Routes = [
  {
    path: 'chef-departement',
    component: ChefDepartementComponent,
    children: [
      { path: '', redirectTo: 'suivi-projets', pathMatch: 'full' },
      { path: 'suivi-projets', component: SuiviProjetsComponent },
      { path: 'gestion-soutenances', component: GestionSoutenancesComponent },
      { path: 'rapports-pfa', component: RapportsPfaComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChefDepartementRoutingModule { }