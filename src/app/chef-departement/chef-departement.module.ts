import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';  // Add this import

import { ChefDepartementRoutingModule } from './chef-departement-routing.module';
import { ChefDepartementComponent } from './chef-departement.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GestionEtudiantsComponent } from './gestion-etudiants/gestion-etudiants.component';
import { SuiviProjetsComponent } from './suivi-projets/suivi-projets.component';
import { RapportsPfaComponent } from './rapports-pfa/rapports-pfa.component';
import { GestionSoutenancesComponent } from './gestion-soutenances/gestion-soutenances.component';
import { SharedModule } from '../shared/shared.module'; // 👈 Import shared module
import { AuthModule } from '../auth/auth.module';
import { HttpClientModule } from '@angular/common/http';
import { StatistiqueComponent } from './statistique/statistique.component';


@NgModule({
  declarations: [
    ChefDepartementComponent,
    DashboardComponent,
    GestionEtudiantsComponent,
    SuiviProjetsComponent,
    RapportsPfaComponent,
    GestionSoutenancesComponent,
    StatistiqueComponent
  ],
  imports: [
    CommonModule,
    ChefDepartementRoutingModule,
    FormsModule,       // Add this
    ReactiveFormsModule,
    SharedModule,
    HttpClientModule,
    AuthModule
  ]
})
export class ChefDepartementModule { }
