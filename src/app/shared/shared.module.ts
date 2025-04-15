import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { LucideAngularModule, CalendarDays, Briefcase, BarChart4, FileText, GraduationCap, LogOut } from 'lucide-angular';


@NgModule({
  declarations: [
    SidebarComponent
  ],
  imports: [
    CommonModule,
    LucideAngularModule.pick({
      CalendarDays,
      Briefcase, 
      BarChart4,
      FileText,
      GraduationCap,
      LogOut
    })
  ],
  exports: [
    SidebarComponent
  ]
})
export class SharedModule { }
