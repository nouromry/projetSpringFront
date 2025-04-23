import { Component, OnInit } from '@angular/core';
import { SoutenanceService } from '../../services/soutenance.service';
import { EnseignantService } from '../../services/enseignant.service';
import { BinomeService } from '../../services/binome.service';
import { Soutenance } from '../../models/soutenance.model';
import { SoutenanceView } from '../../models/soutenance-view.model';
import { Binome } from '../../models/binome.model';
import { Enseignant } from '../../models/enseignant.model';
import { JurySoutenance } from 'src/app/models/jury-soutenance.model';
import { JuryRole } from 'src/app/models/jury-role.enum';

@Component({
  selector: 'app-gestion-soutenances',
  templateUrl: './gestion-soutenances.component.html',
  styleUrls: ['./gestion-soutenances.component.css']
})

export class GestionSoutenancesComponent implements OnInit {
  soutenances: SoutenanceView[] = [];
  filteredSoutenances: SoutenanceView[] = [];
  activeTab: 'repartition' | 'planification' = 'repartition';
  filterDate: string | null = null; // Changed to string for better date handling
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
  enseignants: Enseignant[] = [];
  availableBinomes: Binome[] = [];
  
  // Room allocation tracking
  salleAllocations: {[key: string]: {enseignant: string, date: Date, disponible: boolean, nombreBinomes: number}} = {};

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
    console.log('Loading soutenances...');
    
    // Getting all soutenances regardless of filter (we'll filter locally)
    this.soutenanceService.getAllSoutenances().subscribe({
      next: (data) => {
        console.log('Data received:', data);
        this.soutenances = data;
        this.filteredSoutenances = [...this.soutenances];
        
        // Apply filters if any exist
        this.applyFilters();
        
        this.updateSalleAllocations();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading soutenances:', err);
        this.loading = false;
        this.soutenances = [];
        this.filteredSoutenances = [];
      }
    });
  }

  // Apply both date and search filters
  applyFilters(): void {
    this.filteredSoutenances = [...this.soutenances];
    
    // Apply date filter if set
    if (this.filterDate) {
      const filterDateObj = new Date(this.filterDate);
      
      this.filteredSoutenances = this.filteredSoutenances.filter(soutenance => {
        if (!soutenance.dateSoutenance) return false;
        
        const soutenanceDate = new Date(soutenance.dateSoutenance);
        return soutenanceDate.toDateString() === filterDateObj.toDateString();
      });
    }
    
    // Apply search term if set
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      const term = this.searchTerm.toLowerCase().trim();
      
      this.filteredSoutenances = this.filteredSoutenances.filter(soutenance => {
        // Search in room
        if (soutenance.salle && soutenance.salle.toLowerCase().includes(term)) {
          return true;
        }
        
        // Search in teachers
        if (soutenance.enseignants && soutenance.enseignants.toLowerCase().includes(term)) {
          return true;
        }
        
        // Could add more search fields if needed
        
        return false;
      });
    }
  }

  updateSalleAllocations(): void {
    // Reset allocations
    this.salleAllocations = {};
    
    // Initialize with available rooms
    this.availableSalles.forEach(salle => {
      this.salleAllocations[salle] = {
        enseignant: '',
        date: new Date(),
        disponible: true,
        nombreBinomes: 0
      };
    });
    
    // Process the current filtered soutenances
    this.filteredSoutenances.forEach(soutenance => {
      if (soutenance.salle) {
        // Get teacher names
        const enseignantLines = this.getEnseignantLines(soutenance.enseignants);
        const enseignantName = enseignantLines.length > 0 ? enseignantLines[0] : 'Non défini';
        
        // Update or create room allocation
        if (this.salleAllocations[soutenance.salle]) {
          this.salleAllocations[soutenance.salle].nombreBinomes++;
          this.salleAllocations[soutenance.salle].disponible = false;
          if (soutenance.dateSoutenance) {
            this.salleAllocations[soutenance.salle].date = new Date(soutenance.dateSoutenance);
          }
          this.salleAllocations[soutenance.salle].enseignant = enseignantName;
        } else {
          this.salleAllocations[soutenance.salle] = {
            enseignant: enseignantName,
            date: soutenance.dateSoutenance ? new Date(soutenance.dateSoutenance) : new Date(),
            disponible: false,
            nombreBinomes: 1
          };
        }
      }
    });
  }

  loadPlanningData(): void {
    this.availableSalles = ['Salle 101', 'Salle 202', 'Salle 303', 'Amphi A', 'Amphi B', 'B203'];
  
    // Load teachers
    this.enseignantService.getAllEnseignants().subscribe({
      next: (enseignants: Enseignant[]) => {
        this.enseignants = enseignants;
      },
      error: (err: any) => {
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
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const prevMonthDays = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    for (let i = prevMonthDays; i > 0; i--) {
      const date = new Date(year, month, -i + 1);
      this.calendarDays.push({ date, isCurrentMonth: false });
    }
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      this.calendarDays.push({ date, isCurrentMonth: true });
    }
    
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

  selectDate(date: Date): void {
    // Only select dates in the current or future months
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (date.getTime() >= today.getTime()) {
      this.selectedDate = new Date(date);
      this.newDefense = {
        salle: '',
        encadrant: null,
        examinateur: null,
        binome: null,
        heure: ''
      };
    } else {
      alert('Impossible de planifier des soutenances pour une date passée.');
    }
  }

  hasDefense(date: Date): boolean {
    if (!this.soutenances || !date) return false;
    
    return this.soutenances.some(s => {
      if (!s.dateSoutenance) return false;
      const defenseDate = new Date(s.dateSoutenance);
      return defenseDate.toDateString() === date.toDateString();
    });
  }

  // Format a date to yyyy-MM-dd string format
  formatDateForApi(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  saveDefense(): void {
    if (!this.selectedDate || !this.newDefense.salle || !this.newDefense.encadrant ||
        !this.newDefense.examinateur || !this.newDefense.binome || !this.newDefense.heure) {
      alert('Veuillez remplir tous les champs');
      return;
    }
    
    // Check if encadrant and examinateur are different
    if (this.newDefense.encadrant === this.newDefense.examinateur) {
      alert('L\'encadrant et l\'examinateur doivent être différents');
      return;
    }
    
    // Find the selected binome
    const selectedBinome = this.availableBinomes.find(b => b.id === Number(this.newDefense.binome));
    
    if (!selectedBinome) {
      alert('Binôme invalide');
      return;
    }

    // Find selected teachers
    const encadrant = this.enseignants.find(e => e.id === Number(this.newDefense.encadrant));
    const examinateur = this.enseignants.find(e => e.id === Number(this.newDefense.examinateur));
    
    if (!encadrant || !examinateur) {
      alert('Enseignant invalide');
      return;
    }

    // Check room and time slot availability
    const dateString = this.selectedDate.toDateString();
    
    // Calculate time
    const [hours, minutes] = this.newDefense.heure.split(':');
    const startHour = parseInt(hours);
    const startMinute = parseInt(minutes);
    const endHour = startHour + 1;
    
    const heureD = `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`;
    const heureF = `${endHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`;

    // Format date for API to fix JSON serialization issues
    const formattedDate = this.formatDateForApi(this.selectedDate);

    // Create a simplified soutenance object to avoid serialization issues
    const newSoutenancePayload = {
      // Use primitive types for the backend
      date: formattedDate,
      duree: 60,
      heureD: heureD,
      heureF: heureF,
      salle: this.newDefense.salle,
      binomeId: selectedBinome.id
    };

    console.log('Sending soutenance data:', newSoutenancePayload);

    // Save to database with a simplified payload
    this.soutenanceService.createSoutenanceSimplified(newSoutenancePayload).subscribe({
      next: (createdSoutenance) => {
        console.log('Soutenance created successfully:', createdSoutenance);
        
        if (createdSoutenance && createdSoutenance.id) {
          // Create payload for jury members
          const juryPayload = {
            soutenanceId: createdSoutenance.id,
            members: [
              {
                enseignantId: encadrant.id,
                role: 'RAPPORTEUR'
              },
              {
                enseignantId: examinateur.id,
                role: 'EXAMINATEUR'
              }
            ]
          };
          
          // Add jury members in a single call to avoid race conditions
          this.soutenanceService.addJuryMembers(juryPayload).subscribe({
            next: () => {
              alert('Soutenance planifiée avec succès!');
              this.loadSoutenances();
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
            error: (err: any) => {
              console.error('Error adding jury members', err);
              alert('Erreur lors de l\'ajout des membres du jury');
            }
          });
        }
      },
      error: (err) => {
        console.error('Error creating soutenance', err);
        let errorMessage = 'Une erreur est survenue lors de la création de la soutenance';
        if (err.error && err.error.message) {
          errorMessage += ': ' + err.error.message;
        }
        alert(errorMessage);
      }
    });
  }

  setActiveTab(tab: 'repartition' | 'planification'): void {
    this.activeTab = tab;
    
    // Refresh data when changing tabs
    if (tab === 'repartition') {
      this.loadSoutenances();
    } else if (tab === 'planification') {
      this.loadPlanningData();
      this.generateCalendar();
    }
  }

  filterByDate(): void {
    this.applyFilters();
    this.updateSalleAllocations();
  }
  
  getEnseignantLines(enseignants: string): string[] {
    return enseignants ? enseignants.split('\n') : [];
  }

  getStudentName(etudiant: any): string {
    if (!etudiant) return 'Unknown';
    
    if (etudiant.nom) {
      const prenom = etudiant.prenom || '';
      return `${prenom} ${etudiant.nom}`.trim();
    } else if (etudiant.utilisateur && etudiant.utilisateur.nom) {
      const prenom = etudiant.utilisateur.prenom || '';
      return `${prenom} ${etudiant.utilisateur.nom}`.trim();
    }
    
    return 'Unknown';
  }

  viewSoutenanceDetails(soutenance: SoutenanceView): void {
    if (soutenance && soutenance.id) {
      this.soutenanceService.getSoutenanceById(soutenance.id).subscribe({
        next: (details) => {
          this.selectedSoutenance = details;
        },
        error: (err) => {
          console.error('Error loading soutenance details', err);
          alert('Erreur lors du chargement des détails de la soutenance');
        }
      });
    }
  }
  
  closeModal(): void {
    this.selectedSoutenance = null;
  }

  getBinomeMembers(soutenance: any): string[] {
    if (!soutenance || !soutenance.binome) return [];
    
    const members = [];
    
    if (soutenance.binome.etud1) {
      members.push(this.getStudentName(soutenance.binome.etud1));
    }
    
    if (soutenance.binome.etud2) {
      members.push(this.getStudentName(soutenance.binome.etud2));
    }
    
    return members;
  }

  getEncadrant(soutenance: any): string {
    if (!soutenance || !soutenance.jury) return 'Non défini';
    
    const encadrant = soutenance.jury.find((j: any) => 
      j.role === JuryRole.RAPPORTEUR || j.role === 'RAPPORTEUR' || j.role === 'rapporteur'
    );
    
    if (!encadrant || !encadrant.enseignant) return 'Non défini';
    
    const nom = encadrant.enseignant.nom || 
               (encadrant.enseignant.utilisateur && encadrant.enseignant.utilisateur.nom);
               
    const prenom = encadrant.enseignant.prenom || 
                  (encadrant.enseignant.utilisateur && encadrant.enseignant.utilisateur.prenom);
    
    return nom && prenom ? `${prenom} ${nom}` : 'Non défini';
  }

  getExaminateur(soutenance: any): string {
    if (!soutenance || !soutenance.jury) return 'Non défini';
    
    const examinateur = soutenance.jury.find((j: any) => 
      j.role === JuryRole.EXAMINATEUR || j.role === 'EXAMINATEUR' || j.role === 'examinateur'
    );
    
    if (!examinateur || !examinateur.enseignant) return 'Non défini';
    
    const nom = examinateur.enseignant.nom || 
               (examinateur.enseignant.utilisateur && examinateur.enseignant.utilisateur.nom);
               
    const prenom = examinateur.enseignant.prenom || 
                  (examinateur.enseignant.utilisateur && examinateur.enseignant.utilisateur.prenom);
    
    return nom && prenom ? `${prenom} ${nom}` : 'Non défini';
  }
  
  // Fixed method to get the rapporteur (which is the same as encadrant in this context)
  getRapporteur(soutenance: any): string {
    return this.getEncadrant(soutenance);
  }
  
  // Get all rooms with their information for the table
  getSallesInfo(): any[] {
    return Object.keys(this.salleAllocations).map(salle => ({
      numeroSalle: salle,
      enseignant: this.salleAllocations[salle].enseignant,
      dateSoutenance: this.salleAllocations[salle].date,
      disponible: this.salleAllocations[salle].disponible ? 'Oui' : 'Non',
      nombreBinomes: this.salleAllocations[salle].nombreBinomes
    }));
  }
  
  // Format date for display
  formatDate(date: Date): string {
    if (!date) return '';
    return date instanceof Date ? 
      date.toLocaleDateString() : 
      new Date(date).toLocaleDateString();
  }
}