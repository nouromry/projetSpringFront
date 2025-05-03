import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EtudiantComponent } from './etudiant.component';
import { ListeDesProjetComponent } from './liste-des-projet/liste-des-projet.component';
import { ListeDesChoixComponent } from './liste-des-choix/liste-des-choix.component';
import { EspaceAffichageComponent } from './espace-affichage/espace-affichage.component';
import { EspaceEchangeComponent } from './espace-echange/espace-echange.component';
import { DocumentsComponent } from './documents/documents.component';


const routes: Routes = [{ path: '', component: EtudiantComponent,children: [
      {
        path: 'listeProjets',
        component: ListeDesProjetComponent,
      },
      {
        path: '',
        redirectTo: 'listeProjets',
        pathMatch: 'full',
      },
      {
        path: 'choix',
        component: ListeDesChoixComponent,
      },
      {
        path: 'affichage',
        component:  EspaceAffichageComponent,
      },
      {
        path: 'documents',
        component:  DocumentsComponent,
      },
      {
        path: 'espace',
        component:  EspaceEchangeComponent,
      }
    ], }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EtudiantRoutingModule { }
