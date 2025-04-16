// src/app/chef-departement/chef-departement.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ChefDepartementRoutingModule } from './chef-departement-routing.module';
import { ChefDepartementComponent } from './chef-departement.component';
import { SuiviProjetsComponent } from './suivi-projets/suivi-projets.component';
import { GestionSoutenancesComponent } from './gestion-soutenances/gestion-soutenances.component';
import { RapportsPfaComponent } from './rapports-pfa/rapports-pfa.component';

@NgModule({
  declarations: [
    ChefDepartementComponent,
    SuiviProjetsComponent,
    GestionSoutenancesComponent,
    RapportsPfaComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ChefDepartementRoutingModule
  ]
})
export class ChefDepartementModule { }