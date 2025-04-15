import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChefDepartementComponent } from './chef-departement.component';

const routes: Routes = [{ path: '', component: ChefDepartementComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChefDepartementRoutingModule { }
