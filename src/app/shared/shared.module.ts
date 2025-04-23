import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';

import { RouterModule } from '@angular/router';
import { LucideAngularModule, CalendarDays, Briefcase, BarChart4, FileText, GraduationCap, LogOut } from 'lucide-angular';
import { SidebarEnseignantComponent } from './sidebar-enseignant/sidebar-enseignant.component';


@NgModule({
  declarations: [
    SidebarComponent,
    SidebarEnseignantComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    LucideAngularModule.pick({
      CalendarDays,
      Briefcase, 
      BarChart4,
      FileText,
      GraduationCap,
      LogOut,
      
    })
  ],
  exports: [
    SidebarComponent,
    SidebarEnseignantComponent
  ]
})
export class SharedModule { }
