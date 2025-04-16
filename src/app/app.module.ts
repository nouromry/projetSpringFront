import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SuiviProjetsComponent } from './chef-departement/suivi-projets/suivi-projets.component';
import { ChefDepartementModule } from './chef-departement/chef-departement.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ChefDepartementModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
