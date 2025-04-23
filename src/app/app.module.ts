import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SoutenanceService } from './services/soutenance.service';
import { JurySoutenanceService } from './services/JurySoutenance.service';
// 👇 import your SharedModule here
import { SharedModule } from './shared/shared.module';
import { ChefDepartementModule } from './chef-departement/chef-departement.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    HttpClientModule
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
