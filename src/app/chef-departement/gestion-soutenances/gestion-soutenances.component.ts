import { Component,OnInit } from '@angular/core';
import { SoutenanceService } from '../../services/soutenance.service';
import { EnseignantService } from '../../services/enseignant.service';
import { BinomeService } from '../../services/binome.service';
import { Soutenance  } from '../../models/soutenance.model'; // Import the interface
import { SoutenanceView } from '../../models/soutenance-view.model';
import { Binome } from '../../models/binome.model';
import { Enseignant } from '../../models/enseignant.model';
import { Etudiant } from 'src/app/models/etudiant.model'; // adapte le chemin

@Component({
  selector: 'app-gestion-soutenances',
  templateUrl: './gestion-soutenances.component.html',
  styleUrls: ['./gestion-soutenances.component.css']
})

export class GestionSoutenancesComponent implements OnInit {
  soutenances: SoutenanceView[] = [];
  activeTab: 'repartition' | 'planification' = 'repartition';
  filterDate: Date | null = null;
  searchTerm: string = '';
  loading = false;
  selectedSoutenance: any = null;
  // Calendar and planning properties
dayHeaders = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
timeSlots = ['09:00', '10:30', '13:00', '14:30', '16:00'];
currentMonth: Date = new Date();
selectedDate: Date | null = null;
calendarDays: any[] = [];

// Form data
newDefense: any = {
  salle: '',
  encadrant: null,
  examinateur: null,
  binome: null,
  heure: ''
};

// Data lists
availableSalles: string[] = [];
enseignants: any[] = [];
availableBinomes: Binome[] = [];

  constructor(
    private soutenanceService: SoutenanceService,
    private enseignantService: EnseignantService,
    private binomeService: BinomeService
  ) { }
  ngOnInit(): void {
    this.loadSoutenances();
    this.loadPlanningData();
    this.generateCalendar();
  }

  loadSoutenances(): void {
    this.loading = true;
    this.soutenanceService.getAllSoutenances().subscribe({
      next: (data) => {
        this.soutenances = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des soutenances', err);
        this.loading = false;
      }
    });
  }

  loadPlanningData(): void {
    // Load available rooms (you might need to create a RoomService for this)
    // For now, I'll keep the static list
    this.availableSalles = ['Salle 101', 'Salle 202', 'Salle 303', 'Amphi A', 'Amphi B'];
  
    // Load teachers
    this.enseignantService.getAllEnseignants().subscribe({
      next: (enseignants) => {
        this.enseignants = enseignants;
      },
      error: (err) => {
        console.error('Error loading teachers', err);
      }
    });
  
    // Load available binomes
    this.binomeService.getAllBinomes().subscribe({
      next: (binomes) => {
        this.availableBinomes = binomes;
      },
      error: (err) => {
        console.error('Error loading student pairs', err);
      }
    });
  }
  
    generateCalendar(): void {
      this.calendarDays = [];
      const year = this.currentMonth.getFullYear();
      const month = this.currentMonth.getMonth();
      
      // Get first and last day of month
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      
      // Days from previous month
      const prevMonthDays = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
      for (let i = prevMonthDays; i > 0; i--) {
        const date = new Date(year, month, -i + 1);
        this.calendarDays.push({ date, isCurrentMonth: false });
      }
      
      // Current month days
      for (let i = 1; i <= lastDay.getDate(); i++) {
        const date = new Date(year, month, i);
        this.calendarDays.push({ date, isCurrentMonth: true });
      }
      
      // Days from next month
      const nextMonthDays = 42 - this.calendarDays.length; // 6 weeks
      for (let i = 1; i <= nextMonthDays; i++) {
        const date = new Date(year, month + 1, i);
        this.calendarDays.push({ date, isCurrentMonth: false });
      }
    }
  
  

previousMonth(): void {
  this.currentMonth = new Date(
    this.currentMonth.getFullYear(),
    this.currentMonth.getMonth() - 1,
    1
  );
  this.generateCalendar();
}

nextMonth(): void {
  this.currentMonth = new Date(
    this.currentMonth.getFullYear(),
    this.currentMonth.getMonth() + 1,
    1
  );
  this.generateCalendar();
}
getTeacherName(teacherId: number): string {
  const teacher = this.enseignants.find(e => e.id === teacherId);
  return teacher ? `${teacher.prenom} ${teacher.nom}` : '';
}
selectDate(date: Date): void {
  if (date.getMonth() === this.currentMonth.getMonth()) {
    this.selectedDate = date;
    this.newDefense = {
      salle: '',
      encadrant: null,
      examinateur: null,
      binome: null,
      heure: ''
    };
  }
}
hasDefense(date: Date): boolean {
  if (!this.soutenances) return false;
  return this.soutenances.some(s => 
    new Date(s.dateSoutenance).toDateString() === date.toDateString()
  );
}

saveDefense(): void {
  if (!this.selectedDate || !this.newDefense.salle || !this.newDefense.encadrant || 
      !this.newDefense.examinateur || !this.newDefense.binome || !this.newDefense.heure) {
    alert('Veuillez remplir tous les champs');
    return;
  }

  const selectedBinome = this.availableBinomes.find(b => b.id === this.newDefense.binome);
  if (!selectedBinome) {
    alert('Binôme invalide');
    return;
  }

  // Format date as yyyy-MM-dd
  const formattedDate = this.selectedDate.toISOString().split('T')[0];
  
  // Calculate end time (assuming 1-hour duration by default)
  const startHour = parseInt(this.newDefense.heure.split(':')[0]);
  const startMinute = parseInt(this.newDefense.heure.split(':')[1]);
  const endHour = startHour + 1;
  const endMinute = startMinute;
  
  const heureD = `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}:00`;
  const heureF = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}:00`;

  // Create a new Soutenance object according to your model
  const newSoutenance: Soutenance = {
    id: 0, // This will be assigned by the backend
    date: formattedDate,
    duree: 60, // 60 minutes by default
    heureD: heureD,
    heureF: heureF,
    binome: selectedBinome
  };

  // Save to database
  this.soutenanceService.createSoutenance(newSoutenance).subscribe({
    next: (response) => {
      // Refresh the list of soutenances
      this.loadSoutenances();
      
      // Reset form
      this.selectedDate = null;
      this.newDefense = {
        salle: '',
        encadrant: null,
        examinateur: null,
        binome: null,
        heure: ''
      };
      
      this.activeTab = 'repartition';
    },
    error: (err) => {
      console.error('Error creating soutenance', err);
      alert('Une erreur est survenue lors de la création de la soutenance');
    }
  });
}

  setActiveTab(tab: 'repartition' | 'planification'): void {
    this.activeTab = tab;
  }

  filterByDate(): void {
    if (this.filterDate) {
      this.loading = true;
      this.soutenanceService.getSoutenancesByDate(this.filterDate).subscribe({
        next: (data) => {
          this.soutenances = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Erreur lors du filtrage des soutenances', err);
          this.loading = false;
        }
      });
    } else {
      this.loadSoutenances();
    }
  }
  
  
  // Helper method to safely get enseignant lines as an array
  getEnseignantLines(enseignants: string): string[] {
    return enseignants ? enseignants.split('\n') : [];
  }

  getStudentName(etudiant: any): string {
    // Try both possible property paths
    return etudiant.nom || etudiant.utilisateur?.nom || 'Unknown';
  }

  // Update the viewSoutenanceDetails method
  viewSoutenanceDetails(soutenance: SoutenanceView): void {
    this.soutenanceService.getSoutenanceById(soutenance.id).subscribe({
      next: (details) => {
        this.selectedSoutenance = details;
      },
      error: (err) => {
        console.error('Error loading soutenance details', err);
      }
    });
  }

// Add this new method
closeModal(): void {
  this.selectedSoutenance = null;
}

// Add this helper method
getBinomeMembers(soutenance: any): string[] {
  if (!soutenance || !soutenance.binome) return [];
  
  if (soutenance.binome.etud1 && soutenance.binome.etud2) {
    return [
      this.getStudentName(soutenance.binome.etud1),
      this.getStudentName(soutenance.binome.etud2)
    ];
  }
  
  return [];
}
}