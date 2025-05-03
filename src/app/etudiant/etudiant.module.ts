import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EtudiantRoutingModule } from './etudiant-routing.module';
import { EtudiantComponent } from './etudiant.component';
import { ListeDesProjetComponent } from './liste-des-projet/liste-des-projet.component';
import { ListeDesChoixComponent } from './liste-des-choix/liste-des-choix.component';
import { EspaceAffichageComponent } from './espace-affichage/espace-affichage.component';
import { EspaceEchangeComponent } from './espace-echange/espace-echange.component';
import { DocumentsComponent } from './documents/documents.component';
import { SharedModule } from '../shared/shared.module'; 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    EtudiantComponent,
    ListeDesProjetComponent,
    ListeDesChoixComponent,
    EspaceAffichageComponent,
    EspaceEchangeComponent,
    DocumentsComponent
  ],
  imports: [
    CommonModule,
    EtudiantRoutingModule,
    SharedModule,
    FormsModule,
    HttpClientModule
  ]
})
export class EtudiantModule { }
