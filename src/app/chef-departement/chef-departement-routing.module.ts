import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChefDepartementComponent } from './chef-departement.component';
import { GestionSoutenancesComponent } from './gestion-soutenances/gestion-soutenances.component';
const routes: Routes = [
  {
    path: '',
    component: ChefDepartementComponent,
    children: [
      // ... other child routes ...
      { path: 'soutenances', component: GestionSoutenancesComponent },
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChefDepartementRoutingModule { }
