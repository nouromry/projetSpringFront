import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Rapport {
  id: string;
  numero: number;
  titre: string;
  dateDepot: string;
  filePath?: string;
}

@Component({
  selector: 'app-gestion-soutenances',
  templateUrl: './gestion-soutenances.component.html',
  styleUrls: ['./gestion-soutenances.component.css']
})
export class GestionSoutenancesComponent implements OnInit {
  // Filter options
  filterOptions: string[] = ['semaine dernière', 'mois dernier', 'tous les rapports'];
  selectedFilter: string = 'semaine dernière';
  isDropdownOpen: boolean = false;

  // Rapports data
  rapports: Rapport[] = [];

  // Modal state
  isModalOpen: boolean = false;
  editMode: boolean = false;
  currentRapportId: string | null = null;
  rapportForm: FormGroup;
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder) {
    this.rapportForm = this.initForm();
  }

  ngOnInit(): void {
    this.loadRapports();
  }

  initForm(): FormGroup {
    return this.fb.group({
      titre: ['rapport final de PFA', Validators.required],
      numero: [23, [Validators.required, Validators.min(1)]]
    });
  }

  loadRapports(): void {
    // This would typically be a service call to your backend
    // For demonstration, we'll populate with sample data from the image
    this.rapports = [
      {
        id: '220245',
        numero: 23,
        titre: 'rapport final de PFA',
        dateDepot: '12\\05\\2024'
      },
      {
        id: '220245',
        numero: 23,
        titre: 'rapport final de PFA',
        dateDepot: '12\\05\\2024'
      },
      {
        id: '220245',
        numero: 23,
        titre: 'rapport final de PFA',
        dateDepot: '12\\05\\2024'
      },
      {
        id: '220245',
        numero: 23,
        titre: 'rapport final de PFA',
        dateDepot: '12\\05\\2024'
      },
      {
        id: '220245',
        numero: 23,
        titre: 'rapport final de PFA',
        dateDepot: '12\\05\\2024'
      },
      {
        id: '220245',
        numero: 23,
        titre: 'rapport final de PFA',
        dateDepot: '12\\05\\2024'
      },
      {
        id: '220245',
        numero: 23,
        titre: 'rapport final de PFA',
        dateDepot: '12\\05\\2024'
      },
      {
        id: '220245',
        numero: 23,
        titre: 'rapport final de PFA',
        dateDepot: '12\\05\\2024'
      },
      {
        id: '220245',
        numero: 23,
        titre: 'rapport final de PFA',
        dateDepot: '12\\05\\2024'
      }
    ];
  }

  // Filter dropdown methods
  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectFilter(filter: string): void {
    this.selectedFilter = filter;
    this.isDropdownOpen = false;
    // Here you would typically filter the reports based on the selected option
    this.filterRapports();
  }

  filterRapports(): void {
    // This would filter the reports based on the selected filter option
    // For demonstration, we'll just keep all reports
    // In a real application, you would implement filtering logic here
    console.log(`Filtering rapports by: ${this.selectedFilter}`);
  }

  // Report actions
  deleteRapport(rapport: Rapport): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le rapport n° ${rapport.numero} ?`)) {
      this.rapports = this.rapports.filter(r => r.id !== rapport.id);
    }
  }

  shareRapport(rapport: Rapport): void {
    // Implement sharing functionality
    // This could open a modal with options to share via email, link, etc.
    console.log(`Sharing rapport: ${rapport.titre}`);
    alert(`Fonctionnalité de partage pour le rapport n° ${rapport.numero} en cours de développement.`);
  }

  // Modal methods
  openAddRapportModal(): void {
    this.editMode = false;
    this.currentRapportId = null;
    this.rapportForm = this.initForm();
    this.selectedFile = null;
    this.isModalOpen = true;
  }

  openEditRapportModal(rapport: Rapport): void {
    this.editMode = true;
    this.currentRapportId = rapport.id;
    this.rapportForm.patchValue({
      titre: rapport.titre,
      numero: rapport.numero
    });
    this.selectedFile = null;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      this.selectedFile = fileInput.files[0];
      // Trigger click on the file input when the upload area is clicked
      const uploadArea = document.querySelector('.upload-area');
      if (uploadArea) {
        uploadArea.addEventListener('click', () => {
          fileInput.click();
        });
      }
    }
  }

  removeSelectedFile(): void {
    this.selectedFile = null;
  }

  saveRapport(): void {
    if (this.rapportForm.invalid || !this.selectedFile) {
      // Mark all fields as touched to trigger validation messages
      this.rapportForm.markAllAsTouched();
      return;
    }

    const formValues = this.rapportForm.value;
    const today = new Date();
    const dateDepot = `${today.getDate()}\\${today.getMonth() + 1}\\${today.getFullYear()}`;
    
    // Create a unique ID (in a real app, this would come from the backend)
    const id = Math.floor(100000 + Math.random() * 900000).toString();

    const newRapport: Rapport = {
      id: this.editMode && this.currentRapportId ? this.currentRapportId : id,
      numero: formValues.numero,
      titre: formValues.titre,
      dateDepot: dateDepot,
      filePath: this.selectedFile ? this.selectedFile.name : undefined
    };

    if (this.editMode && this.currentRapportId) {
      // Update existing rapport
      const index = this.rapports.findIndex(r => r.id === this.currentRapportId);
      if (index !== -1) {
        this.rapports[index] = newRapport;
      }
    } else {
      // Add new rapport
      this.rapports.unshift(newRapport);
    }

    // Close the modal
    this.closeModal();

    // In a real application, you would upload the file to the server here
    console.log('Saving rapport:', newRapport);
    console.log('With file:', this.selectedFile);
  }
}