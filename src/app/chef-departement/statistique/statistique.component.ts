import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ProjetService } from 'src/app/services/projet.service';
import { EnseignantService } from 'src/app/services/enseignant.service';
import { SoutenanceService } from 'src/app/services/soutenance.service';
import { BinomeService } from 'src/app/services/binome.service';
import { DocumentService } from 'src/app/services/document.service';
import { Chart, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'app-statistique',
  templateUrl: './statistique.component.html',
  styleUrls: ['./statistique.component.css']
})
export class StatistiqueComponent implements OnInit, AfterViewInit {
  // Chart references
  @ViewChild('projetStatusChart') projetStatusChartRef!: ElementRef;
  @ViewChild('enseignantProjetChart') enseignantProjetChartRef!: ElementRef;
  @ViewChild('filiereDistributionChart') filiereDistributionChartRef!: ElementRef;
  @ViewChild('moyenneBinomeChart') moyenneBinomeChartRef!: ElementRef;
  @ViewChild('soutenanceTimelineChart') soutenanceTimelineChartRef!: ElementRef;

  // Data variables
  projetsParEtat: { [key: string]: number } = {};
  projetsParEnseignant: { enseignant: string, count: number }[] = [];
  projetsParFiliere: { [key: string]: number } = {};
  binomesParMoyenne: { binome: string, moyenne: number }[] = [];
  soutenancesParMois: number[] = Array(12).fill(0);

  // Summary statistics
  totalProjets: number = 0;
  totalEnseignants: number = 0;
  totalBinomes: number = 0;
  totalSoutenances: number = 0;
  totalDocuments: number = 0;
  moyenneGenerale: number = 0;
  tauxValidation: number = 0;

  // Loading states
  isLoading: boolean = true;
  chartsInitialized: boolean = false;

  constructor(
    private projetService: ProjetService,
    private enseignantService: EnseignantService,
    private soutenanceService: SoutenanceService,
    private binomeService: BinomeService,
    private documentService: DocumentService
  ) { }

  ngOnInit(): void {
    this.loadAllData();
  }

  ngAfterViewInit(): void {
    if (!this.isLoading && !this.chartsInitialized) {
      this.initializeCharts();
    }
  }

  loadAllData(): void {
    // Load projects data
    this.projetService.getAllProjets().subscribe({
      next: (projets) => {
        this.totalProjets = projets.length;
        
        // Calculate project status distribution
        projets.forEach(projet => {
          this.projetsParEtat[projet.etat] = (this.projetsParEtat[projet.etat] || 0) + 1;
          this.projetsParFiliere[projet.filiere] = (this.projetsParFiliere[projet.filiere] || 0) + 1;
        });

        // Calculate validation rate
        const validated = projets.filter(p => p.etat === 'VALIDE').length;
        this.tauxValidation = Math.round((validated / this.totalProjets) * 100);

        // Load teachers data
        this.enseignantService.getAllEnseignants().subscribe({
          next: (enseignants) => {
            this.totalEnseignants = enseignants.length;
            
            // Count projects per teacher
            enseignants.forEach(enseignant => {
              this.enseignantService.getEnseignantProjects(enseignant.id).subscribe({
                next: (projects) => {
                  this.projetsParEnseignant.push({
                    enseignant: `${enseignant.prenom} ${enseignant.nom}`,
                    count: projects.length
                  });

                  // When all teachers are processed
                  if (this.projetsParEnseignant.length === enseignants.length) {
                    this.projetsParEnseignant.sort((a, b) => b.count - a.count);
                    this.projetsParEnseignant = this.projetsParEnseignant.slice(0, 10);
                  }
                },
                error: (err) => console.error('Error loading teacher projects:', err)
              });
            });

            // Load binomes data
            this.binomeService.getBinomeDetails().subscribe({
              next: (binomes) => {
                this.totalBinomes = binomes.length;
                
                // Process binome averages
                binomes.forEach(binome => {
                  if (binome.moyenneBinome) {
                    this.binomesParMoyenne.push({
                      binome: `${binome.prenomEtud1} ${binome.nomEtud1} & ${binome.prenomEtud2} ${binome.nomEtud2}`,
                      moyenne: binome.moyenneBinome
                    });
                  }
                });

                // Sort by average and take top 10
                this.binomesParMoyenne.sort((a, b) => b.moyenne - a.moyenne);
                this.binomesParMoyenne = this.binomesParMoyenne.slice(0, 10);

                // Calculate general average
                if (this.binomesParMoyenne.length > 0) {
                  const total = this.binomesParMoyenne.reduce((sum, b) => sum + b.moyenne, 0);
                  this.moyenneGenerale = total / this.binomesParMoyenne.length;
                }

                // Load defenses data
                this.soutenanceService.getAllSoutenances().subscribe({
                  next: (soutenances) => {
                    this.totalSoutenances = soutenances.length;
                    
                    // Count defenses by month
                    soutenances.forEach(soutenance => {
                      const date = new Date(soutenance.dateSoutenance);
                      const month = date.getMonth();
                      this.soutenancesParMois[month]++;
                    });

                    // Load documents data
                    this.documentService.getAllDocuments().subscribe({
                      next: (documents) => {
                        this.totalDocuments = documents.length;
                        this.isLoading = false;
                        
                        // Initialize charts after data is loaded
                        setTimeout(() => {
                          this.initializeCharts();
                          this.chartsInitialized = true;
                        }, 100);
                      },
                      error: (err) => console.error('Error loading documents:', err)
                    });
                  },
                  error: (err) => console.error('Error loading defenses:', err)
                });
              },
              error: (err) => console.error('Error loading binomes:', err)
            });
          },
          error: (err) => console.error('Error loading teachers:', err)
        });
      },
      error: (err) => console.error('Error loading projects:', err)
    });
  }

  initializeCharts(): void {
    this.createProjetStatusChart();
    this.createEnseignantProjetChart();
    this.createFiliereDistributionChart();
    this.createMoyenneBinomeChart();
    this.createSoutenanceTimelineChart();
  }

  createProjetStatusChart(): void {
    const ctx = this.projetStatusChartRef.nativeElement.getContext('2d');
    const labels = Object.keys(this.projetsParEtat);
    const data = Object.values(this.projetsParEtat);
    
    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: this.generateColors(labels.length),
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'right',
          },
          title: {
            display: true,
            text: 'Projets par État'
          }
        }
      }
    });
  }

  createEnseignantProjetChart(): void {
    const ctx = this.enseignantProjetChartRef.nativeElement.getContext('2d');
    const labels = this.projetsParEnseignant.map(e => e.enseignant);
    const data = this.projetsParEnseignant.map(e => e.count);
    
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Nombre de projets',
          data: data,
          backgroundColor: 'rgba(54, 162, 235, 0.7)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Top 10 Enseignants par Projets'
          }
        },
        scales: {
          x: {
            beginAtZero: true
          }
        }
      }
    });
  }

  createFiliereDistributionChart(): void {
    const ctx = this.filiereDistributionChartRef.nativeElement.getContext('2d');
    const labels = Object.keys(this.projetsParFiliere);
    const data = Object.values(this.projetsParFiliere);
    
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: this.generateColors(labels.length),
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'right',
          },
          title: {
            display: true,
            text: 'Projets par Filière'
          }
        }
      }
    });
  }

  createMoyenneBinomeChart(): void {
    const ctx = this.moyenneBinomeChartRef.nativeElement.getContext('2d');
    const labels = this.binomesParMoyenne.map(b => b.binome);
    const data = this.binomesParMoyenne.map(b => b.moyenne);
    
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Moyenne',
          data: data,
          backgroundColor: 'rgba(75, 192, 192, 0.7)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Top 10 Binômes par Moyenne'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 20
          }
        }
      }
    });
  }

  createSoutenanceTimelineChart(): void {
    const ctx = this.soutenanceTimelineChartRef.nativeElement.getContext('2d');
    const monthLabels = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: monthLabels,
        datasets: [{
          label: 'Soutenances',
          data: this.soutenancesParMois,
          fill: true,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Soutenances par Mois'
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  private generateColors(count: number): string[] {
    const colors = [
      'rgba(255, 99, 132, 0.7)',
      'rgba(54, 162, 235, 0.7)',
      'rgba(255, 206, 86, 0.7)',
      'rgba(75, 192, 192, 0.7)',
      'rgba(153, 102, 255, 0.7)',
      'rgba(255, 159, 64, 0.7)',
      'rgba(199, 199, 199, 0.7)',
      'rgba(83, 102, 255, 0.7)',
      'rgba(40, 159, 64, 0.7)',
      'rgba(210, 199, 199, 0.7)'
    ];
    
    return colors.slice(0, count);
  }
}