import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from './services/auth.service';
import { DocumentService } from './services/document.service';
import { SoutenanceService } from './services/soutenance.service';
import { EnseignantService } from './services/enseignant.service';

// 👇 import your SharedModule here
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';
import { CoreModule } from './core/core.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    AuthModule,
    CoreModule,
    HttpClientModule,
    RouterModule, // 👈 Now Angular knows your sidebar
  ],
  providers: [
    AuthService,
    DocumentService,
    SoutenanceService,
    EnseignantService
    // Add other services
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
