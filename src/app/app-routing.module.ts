import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SuiviProjetsComponent } from './chef-departement/suivi-projets/suivi-projets.component';
const routes: Routes = [
  { path: 'suivi-projets', component: SuiviProjetsComponent },
  { path: '', redirectTo: 'suivi-projets', pathMatch: 'full' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
