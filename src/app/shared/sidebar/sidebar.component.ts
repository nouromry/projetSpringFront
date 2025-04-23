// sidebar.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { 
  CalendarDays, 
  Briefcase, 
  BarChart4, 
  FileText, 
  GraduationCap, 
  LogOut 
} from 'lucide-angular';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  // Make icons available to template
  CalendarDays = CalendarDays;
  Briefcase = Briefcase;
  BarChart4 = BarChart4;
  FileText = FileText;
  GraduationCap = GraduationCap;
  LogOut = LogOut;

  constructor(private router: Router) {}

  logout() {
    // Your logout logic here
    console.log('Logging out...');
    this.router.navigate(['/login']);
  }
  activeItem: string = 'projects'; // Default active item

  setActive(item: string) {
    this.activeItem = item;
  }

  isActive(item: string): boolean {
    return this.activeItem === item;
  }
}