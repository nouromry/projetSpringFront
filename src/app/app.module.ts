import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

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
    ChefDepartementModule, // 👈 Now Angular knows your sidebar
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
