import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EnseignantRoutingModule } from './enseignant-routing.module';
import { EnseignantComponent } from './enseignant.component';
import { PlanningSoutenancesComponent } from './planning-soutenances/planning-soutenances.component';
import { ListeBinomesComponent } from './liste-binomes/liste-binomes.component';
import { GestionProjetsComponent } from './gestion-projets/gestion-projets.component';
import { DocumentsAssociesComponent } from './documents-associes/documents-associes.component';
import { SharedModule } from '../shared/shared.module'; 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EspaceEchangeComponent } from './espace-echange/espace-echange.component';  // Add this import
import { HttpClientModule } from '@angular/common/http';
import { EchangeComponent } from './echange/echange.component';

@NgModule({
  declarations: [
    EnseignantComponent,
    PlanningSoutenancesComponent,
    ListeBinomesComponent,
    GestionProjetsComponent,
    DocumentsAssociesComponent,
    EspaceEchangeComponent,
    EchangeComponent
  ],
  imports: [
    CommonModule,
    EnseignantRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ]
})
export class EnseignantModule { }
