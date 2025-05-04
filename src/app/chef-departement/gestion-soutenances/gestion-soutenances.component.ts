import { Component, OnInit } from '@angular/core';
import { SoutenanceService } from '../../services/soutenance.service';
import { EnseignantService } from '../../services/enseignant.service';
import { BinomeService } from '../../services/binome.service';
import { Soutenance } from '../../models/soutenance.model';
import { SoutenanceView, JuryMemberDTO } from '../../models/soutenance-view.model';
import { Binome } from '../../models/binome.model';
import { Enseignant } from '../../models/enseignant.model';
import { JurySoutenance, JuryRole } from 'src/app/models/jury-soutenance.model';

@Component({
  selector: 'app-gestion-soutenances',
  templateUrl: './gestion-soutenances.component.html',
  styleUrls: ['./gestion-soutenances.component.css']
})

export class GestionSoutenancesComponent implements OnInit {
  soutenances: SoutenanceView[] = [];
  filteredSoutenances: SoutenanceView[] = [];
  activeTab: 'repartition' | 'planification' = 'repartition';
  filterDate: string | null = null; 
  searchTerm: string = '';
  loading = false;
  selectedSoutenance: SoutenanceView | null = null;
  
  // Calendar and planning properties
  dayHeaders = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  timeSlots = ['09:00', '10:30', '13:00', '14:30', '16:00'];
  currentMonth: Date = new Date();
  selectedDate: Date | null = null;
  calendarDays: any[] = [];

  // Form data
  newDefense: {
    salle: string,
    encadrant: number | null,
    examinateur: number | null,
    binome: number | null,
    heure: string
  } = {
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
    this.loadBinomes();
  }

  loadBinomes(): void {
    this.binomeService.getAllBinomes().subscribe({
      next: (data) => {
        this.availableBinomes = data.filter(b => !b.projetAffecte);
      },
      error: (err) => console.error('Error loading binomes:', err)
    });
  }
  
  // Check if date is valid for DatePipe
  isValidDate(date: any): boolean {
    if (!date) return false;
    
    // If it's already a Date object
    if (date instanceof Date) {
      return !isNaN(date.getTime());
    }
    
    // If it's a string, try to parse it
    if (typeof date === 'string') {
      const d = new Date(date);
      return !isNaN(d.getTime());
    }
    
    return false;
  }

  loadSoutenances(): void {
    this.loading = true;
    console.log('Loading soutenances...');
    
    // Getting all soutenances regardless of filter (we'll filter locally)
    this.soutenanceService.getAllSoutenancesWithEnseignants().subscribe({
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

  applyFilters(): void {
    console.log("Filters applied:", this.filterDate, this.searchTerm);
  
    this.filteredSoutenances = [...this.soutenances];
  
    // Filtrage par date
    if (this.filterDate) {
      const filterDateObj = new Date(this.filterDate);
      filterDateObj.setHours(0, 0, 0, 0);
  
      this.filteredSoutenances = this.filteredSoutenances.filter(soutenance => {
        if (!soutenance.dateSoutenance) return false;
  
        const soutenanceDate = new Date(soutenance.dateSoutenance);
        soutenanceDate.setHours(0, 0, 0, 0);
  
        return soutenanceDate.getTime() === filterDateObj.getTime();
      });
    }
  
    // Filtrage par mot-clé (salle ou enseignants)
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      const term = this.searchTerm.trim().toLowerCase().replace(/\s+/g, '');
    
      this.filteredSoutenances = this.filteredSoutenances.filter(soutenance => {
        const salle = soutenance.salle?.replace(/\s+/g, '').toLowerCase() ?? '';
        
        // Check encadrant and examinateur directly
        const encadrantLower = soutenance.encadrant?.toLowerCase().replace(/\s+/g, '') ?? '';
        const examinateurLower = soutenance.examinateur?.toLowerCase().replace(/\s+/g, '') ?? '';
    
        // Vérification dans la liste du jury
        const juryText = soutenance.jury?.map(j => 
          j.enseignant?.nom?.replace(/\s+/g, '').toLowerCase() || ''
        ).join(' ') ?? '';
    
        return salle.includes(term) || 
               juryText.includes(term) || 
               encadrantLower.includes(term) || 
               examinateurLower.includes(term);
      });
    
      console.log("Filtered soutenances:", this.filteredSoutenances);
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
        // Get enseignant name directly from the SoutenanceView properties
        const enseignantName = soutenance.encadrant || 'Non défini';
      
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

  formatTimeForBackend(time: string): string {
    if (!time) return '';
    
    // Check if time is in valid format
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):?([0-5][0-9])?$/;
    const matches = time.match(timeRegex);
    
    if (!matches) {
      console.error('Invalid time format:', time);
      return '';
    }
    
    // Extract hours and minutes, ensuring 2 digits each
    const hours = matches[1].padStart(2, '0');
    const minutes = (matches[2] || '00').padStart(2, '0');
    
    return `${hours}:${minutes}`;
  }

  saveDefense(): void {
    // Validate form inputs
    if (!this.selectedDate || !this.newDefense.salle || !this.newDefense.binome || 
        !this.newDefense.heure || !this.newDefense.encadrant || !this.newDefense.examinateur) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    // Check if encadrant and examinateur are different
    if (this.newDefense.encadrant === this.newDefense.examinateur) {
      alert('L\'encadrant et l\'examinateur doivent être différents');
      return;
    }

    // Format the date for API (YYYY-MM-DD)
    const formattedDate = this.formatDateForApi(this.selectedDate);
    
    // Format the time to ensure HH:MM format
    const formattedTime = this.formatTimeForBackend(this.newDefense.heure);
    
    // Prepare jury members in the expected format
    const juryMembers: JuryMemberDTO[] = [
      {
        enseignantId: Number(this.newDefense.encadrant),
        role: JuryRole.ENCADRANT 
      },
      {
        enseignantId: Number(this.newDefense.examinateur),
        role: JuryRole.EXAMINATEUR
      }
    ];
    
    // Prepare the complete payload in the exact format backend expects
    const payload: SoutenanceView = {
      salle: this.newDefense.salle,
      dateSoutenance: formattedDate,  // Send date in YYYY-MM-DD format
      heureDebut: formattedTime,      // Send time in HH:MM format
      binomeId: Number(this.newDefense.binome),
      juryMembers: juryMembers
    };

    console.log('Sending payload:', payload);

    // Send the complete payload in one request
    this.soutenanceService.createSoutenance(payload).subscribe({
      next: (response) => {
        alert('Soutenance planifiée avec succès!');
        this.loadSoutenances(); // Refresh the list
        this.resetDefenseForm();
      },
      error: (err) => {
        console.error('Error creating defense:', err);
        let errorMessage = 'Erreur lors de la planification de la soutenance';
        if (err.error?.message) {
          errorMessage += ': ' + err.error.message;
        }
        alert(errorMessage);
      }
    });
  }

  resetDefenseForm(): void {
    this.selectedDate = null;
    this.newDefense = {
      salle: '',
      encadrant: null,
      examinateur: null,
      binome: null,
      heure: ''
    };
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
          console.log('Received soutenance details:', details);
          
          // Store the complete details for display
          this.selectedSoutenance = {
            ...details,
            // Ensure these properties exist for the template
            titre: details.titre || details.projetTitre || 'Non renseigné',
            dateSoutenance: details.dateSoutenance,
            heureDebut: details.heureDebut || details.heureD,
            binome: details.binome,
            jury: details.jury,
            // Use the values from the SoutenanceView or fallback
            encadrant: details.encadrant || 'Non défini',
            examinateur: details.examinateur || 'Non défini',
            // Add binome members information
            binomeEtudiant1: details.binomeEtudiant1,
            binomeEtudiant2: details.binomeEtudiant2
          };
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

  getBinomeMembers(soutenance: SoutenanceView): string[] {
    if (!soutenance) return [];
    
    const members = [];
    
    // First try to use the pre-formatted student names
    if (soutenance.binomeEtudiant1) {
      members.push(soutenance.binomeEtudiant1);
    }
    
    if (soutenance.binomeEtudiant2) {
      members.push(soutenance.binomeEtudiant2);
    }
    
    // If no pre-formatted names, try to extract from binome object
    if (members.length === 0 && soutenance.binome) {
      if (soutenance.binome.etud1) {
        members.push(this.getStudentName(soutenance.binome.etud1));
      }
      
      if (soutenance.binome.etud2) {
        members.push(this.getStudentName(soutenance.binome.etud2));
      }
    }
    
    return members;
  }
  
  getEncadrant(soutenance: SoutenanceView): string {
    if (!soutenance) return 'Non défini';
    
    // First check if encadrant is directly available from SoutenanceView
    if (soutenance.encadrant && soutenance.encadrant !== 'Non assigné') {
      return soutenance.encadrant;
    }
    
    // Handle case where jury might be an array
    if (soutenance.jury && Array.isArray(soutenance.jury)) {
      const encadrant = soutenance.jury.find((j: JurySoutenance) => 
        j.role === JuryRole.ENCADRANT
      );
      
      if (encadrant && encadrant.enseignant) {
        return this.getEnseignantName(encadrant.enseignant);
      }
    }
    
    return 'Non défini';
  }
  
  getExaminateur(soutenance: SoutenanceView): string {
    if (!soutenance) return 'Non défini';
    
    // First check if examinateur is directly available from SoutenanceView
    if (soutenance.examinateur && soutenance.examinateur !== 'Non assigné') {
      return soutenance.examinateur;
    }
    
    // Handle case where jury might be an array
    if (soutenance.jury && Array.isArray(soutenance.jury)) {
      const examinateur = soutenance.jury.find((j: JurySoutenance) => 
        j.role === JuryRole.EXAMINATEUR
      );
      
      if (examinateur && examinateur.enseignant) {
        return this.getEnseignantName(examinateur.enseignant);
      }
    }
    
    return 'Non défini';
  }
  
  // Helper method to get teacher name considering different data structures
  getEnseignantName(enseignant: any): string {
    if (!enseignant) return 'Non défini';
      
    // Handle case where enseignant is just a string
    if (typeof enseignant === 'string') {
      return enseignant !== 'N/A' ? enseignant : 'Non défini';
    }
    
    // Try to use fullName if available
    if (enseignant.fullName) {
      return enseignant.fullName;
    }
      
    // Handle different possible property structures
    const nom = enseignant.nom || 
                (enseignant.utilisateur && enseignant.utilisateur.nom);
                    
    const prenom = enseignant.prenom || 
                   (enseignant.utilisateur && enseignant.utilisateur.prenom);
      
    return nom && prenom ? `${prenom} ${nom}` : 'Non défini';
  }
}