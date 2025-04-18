import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http'
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { ChefDepartementRoutingModule } from './chef-departement-routing.module';
import { ChefDepartementComponent } from './chef-departement.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GestionEtudiantsComponent } from './gestion-etudiants/gestion-etudiants.component';
import { SuiviProjetsComponent } from './suivi-projets/suivi-projets.component';
import { RapportsPfaComponent } from './rapports-pfa/rapports-pfa.component';
import { GestionSoutenancesComponent } from './gestion-soutenances/gestion-soutenances.component';


@NgModule({
  declarations: [
    ChefDepartementComponent,
    DashboardComponent,
    GestionEtudiantsComponent,
    SuiviProjetsComponent,
    RapportsPfaComponent,
    GestionSoutenancesComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ChefDepartementRoutingModule,
    SharedModule 
  ]

})
export class ChefDepartementModule { }
