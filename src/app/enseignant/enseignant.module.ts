import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EnseignantRoutingModule } from './enseignant-routing.module';
import { EnseignantComponent } from './enseignant.component';
import { PlanningSoutenancesComponent } from './planning-soutenances/planning-soutenances.component';
import { ListeBinomesComponent } from './liste-binomes/liste-binomes.component';
import { GestionProjetsComponent } from './gestion-projets/gestion-projets.component';
import { DocumentsAssociesComponent } from './documents-associes/documents-associes.component';
import { SharedModule } from '../shared/shared.module'; 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';  // Add this import

@NgModule({
  declarations: [
    EnseignantComponent,
    PlanningSoutenancesComponent,
    ListeBinomesComponent,
    GestionProjetsComponent,
    DocumentsAssociesComponent
  ],
  imports: [
    CommonModule,
    EnseignantRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class EnseignantModule { }
