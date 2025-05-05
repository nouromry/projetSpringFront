import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EnseignantComponent } from './enseignant.component';
import { PlanningSoutenancesComponent } from './planning-soutenances/planning-soutenances.component';
import { ListeBinomesComponent } from './liste-binomes/liste-binomes.component';
import { GestionProjetsComponent } from './gestion-projets/gestion-projets.component';
import { DocumentsAssociesComponent } from './documents-associes/documents-associes.component';
import { EspaceEchangeComponent } from './espace-echange/espace-echange.component';

const routes: Routes = [{ path: '', component: EnseignantComponent, children: [
      {
        path: 'gestion-projets',
        component: GestionProjetsComponent,
      },
      {
        path: '',
        redirectTo: 'gestion-projets',
        pathMatch: 'full',
      },
      {
        path: 'documents',
        component: DocumentsAssociesComponent,
      },
      {
        path: 'suivi-binomes',
        component:  ListeBinomesComponent,
      },
      {
        path: 'soutenances',
        component:  PlanningSoutenancesComponent,
      },
      {
        path: 'echangeEspace',
        component:  EspaceEchangeComponent,
      },
    ],
   }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EnseignantRoutingModule { }
