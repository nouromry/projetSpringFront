import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { forkJoin, Observable, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';

import { Soutenance } from '../models/soutenance.model';
import { SoutenanceView, JuryMemberDTO } from '../models/soutenance-view.model';
import { Enseignant } from '../models/enseignant.model';
import { JuryRole, JurySoutenance } from '../models/jury-soutenance.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SoutenanceService {
  // Base URL for API calls
  private apiUrl = environment.apiUrl ? `${environment.apiUrl}/soutenances` : 'http://localhost:8081/api/soutenances';
  private enseignantUrl = environment.apiUrl ? `${environment.apiUrl}/enseignants` : 'http://localhost:8081/api/enseignants';

  constructor(private http: HttpClient) {}
  
  private getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }),
      withCredentials: true // For CORS with credentials
    };
  }
  
  getAllSoutenances(): Observable<SoutenanceView[]> {
    console.log('Fetching soutenances from:', this.apiUrl);
    
    return this.http.get<any[]>(`${this.apiUrl}/views`, this.getHttpOptions()).pipe(
      tap(data => console.log('Raw soutenances received:', data)),
      map(soutenances => this.processRawSoutenances(soutenances)),
      tap(mapped => console.log('Mapped soutenances:', mapped)),
      catchError(this.handleError)
    );
  }

  // Process raw soutenances from backend
  private processRawSoutenances(soutenances: any[]): SoutenanceView[] {
    // First pass - count binomes per room+date
    const roomCounts = new Map<string, number>();
    
    soutenances.forEach(s => {
      if (s.salle && s.dateSoutenance) {
        const dateStr = typeof s.dateSoutenance === 'string' ? 
          s.dateSoutenance.split('T')[0] : 
          new Date(s.dateSoutenance).toISOString().split('T')[0];
        const key = `${s.salle}-${dateStr}`;
        roomCounts.set(key, (roomCounts.get(key) || 0) + 1);
      }
    });
    
    // Second pass - map to view models with counts
    return soutenances.map(s => {
      // Handle dateSoutenance format
      const dateStr = s.dateSoutenance ? 
        (typeof s.dateSoutenance === 'string' ? 
          s.dateSoutenance.split('T')[0] : 
          new Date(s.dateSoutenance).toISOString().split('T')[0]) 
        : 'Date non définie';
      
      let nombreBinomes = 1;
      if (s.salle && s.dateSoutenance) {
        const key = `${s.salle}-${dateStr}`;
        nombreBinomes = roomCounts.get(key) || 1;
      }
      
      // Create base view model
      const view: SoutenanceView = {
        id: s.id,
        salle: s.salle || 'Salle non affectée',
        encadrant: 'Non assigné',
        examinateur: 'Non assigné',
        dateSoutenance: dateStr,
        disponible: s.disponible !== null ? s.disponible : true,
        nombreBinomes,
        heureD: this.formatTimeValue(s.heureDebut) || 'Heure non définie',
        heureDebut: this.formatTimeValue(s.heureDebut) || 'Heure non définie',
        titre: s.projetTitre || 'Titre non défini',
        jury: []
      };
      
      // Process binome info
      if (s.binomeId) {
        view.binomeId = s.binomeId;
        
        if (s.binomeEtudiant1) {
          view.binomeEtudiant1 = s.binomeEtudiant1;
        }
        
        if (s.binomeEtudiant2) {
          view.binomeEtudiant2 = s.binomeEtudiant2;
        }
        
        // Project info
        if (s.projetId) {
          view.projetId = s.projetId;
          view.projetTitre = s.projetTitre;
          view.projetDescription = s.projetDescription;
          view.projetTechnologies = s.projetTechnologies;
        }
      }
      
      // Process jury members
      if (s.juryMembers && Array.isArray(s.juryMembers) && s.juryMembers.length > 0) {
        // Extract teachers from enseignants field if available
        const enseignantsStr = s.enseignants || '';
        const enseignantMatches = enseignantsStr.match(/([^\(]+)\(([^\)]+)\)/g);
        
        if (enseignantMatches) {
          enseignantMatches.forEach((match: string) => {
            const parts = match.match(/([^\(]+)\(([^\)]+)\)/);
            if (parts && parts.length >= 3) {
              const fullName = parts[1].trim();
              const role = parts[2].trim().toLowerCase();
              
              if (role === 'encadrant') {
                view.encadrant = fullName;
              } else if (role === 'examinateur') {
                view.examinateur = fullName;
              }
            }
          });
        }
        
        // Convert juryMembers to jury
        view.juryMembers = s.juryMembers;
      }
      
      return view;
    });
  }

  // Map a single soutenance to view model
  mapToSoutenanceView(s: Soutenance, nombreBinomes: number = 1): SoutenanceView {
    // Initialize with default values
    const view: SoutenanceView = {
      id: s.id,
      salle: s.salle || 'Salle non affectée',
      encadrant: 'Non assigné',
      examinateur: 'Non assigné',
      dateSoutenance: s.date ? 
        (typeof s.date === 'string' ? s.date.split('T')[0] : new Date(s.date).toISOString().split('T')[0]) 
        : 'Date non définie',
      disponible: true,
      nombreBinomes,
      heureD: this.formatTimeValue(s.heureD) || 'Heure non définie',
      titre: s.titre || (s.binome?.projetAffecte?.titre || 'Titre non défini'),
      jury: []
    };
    
    // Process binome info
    if (s.binome) {
      view.binomeId = s.binome.id;
      view.binome = s.binome;
      
      if (s.binome.etud1) {
        view.binomeEtudiant1 = `${s.binome.etud1.nom || ''} ${s.binome.etud1.prenom || ''}`.trim();
      }
      
      if (s.binome.etud2) {
        view.binomeEtudiant2 = `${s.binome.etud2.nom || ''} ${s.binome.etud2.prenom || ''}`.trim();
      }
      
      // Project info from binome
      if (s.binome.projetAffecte) {
        const projet = s.binome.projetAffecte;
        view.projetId = projet.id;
        view.projetTitre = projet.titre;
        view.projetDescription = projet.description;
        view.projetTechnologies = projet.technologies;
      }
    }
    
    // Process jury members
    if (s.jury && Array.isArray(s.jury) && s.jury.length > 0) {
      view.jury = s.jury.map(j => {
        if (!j?.enseignant) return null;
        
        const enseignant = j.enseignant;
        const fullName = `${enseignant.prenom || ''} ${enseignant.nom || ''}`.trim();
        
        // Assign to role-specific fields - only handle ENCADRANT and EXAMINATEUR roles
        if (j.role === JuryRole.ENCADRANT) {
          view.encadrant = fullName;
        } else if (j.role === JuryRole.EXAMINATEUR) {
          view.examinateur = fullName;
        }
        
        // Return the jury member
        return {
          id: {
            enseignantId: enseignant.id,
            soutenanceId: s.id
          },
          enseignant: enseignant,
          role: j.role,
          fullName
        };
      }).filter(j => j !== null) as JurySoutenance[];
      
      // Convert jury to juryMembers for API compatibility
      view.juryMembers = view.jury.map(j => ({
        enseignantId: j.enseignant.id,
        role: j.role
      }));
    }
    
    // Convert date to heureDebut format for API consistency
    view.heureDebut = view.heureD;
    
    return view;
  }

  getAllSoutenancesWithEnseignants(): Observable<SoutenanceView[]> {
    return forkJoin([
      this.http.get<any[]>(this.apiUrl, this.getHttpOptions()),
      this.http.get<Enseignant[]>(this.enseignantUrl, this.getHttpOptions())
    ]).pipe(
      map(([soutenances, enseignants]) => {
        // Filter out students and keep only enseignants
        const validEnseignants = enseignants.filter(e => e.role === 'enseignant');
        
        // Process raw data - adapt if necessary based on actual API response format
        return this.processRawSoutenances(soutenances);
      }),
      catchError(this.handleError)
    );
  }

  // Helper method to check if two dates are the same day
  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }
  
  // Helper method to safely format time values
  private formatTimeValue(timeValue: any): string {
    if (!timeValue) return 'N/A';
    
    if (typeof timeValue === 'string') {
      // If in format 'HH:MM:SS', strip seconds
      if (timeValue.includes(':')) {
        const parts = timeValue.split(':');
        if (parts.length >= 2) {
          return `${parts[0]}:${parts[1]}`;
        }
      }
      return timeValue;
    }
    
    // Handle Time object or Date object
    if (timeValue instanceof Date) {
      return `${String(timeValue.getHours()).padStart(2, '0')}:${String(timeValue.getMinutes()).padStart(2, '0')}`;
    }
    
    // Handle cases where it might be another object with toString method
    try {
      const timeStr = String(timeValue);
      if (timeStr.includes(':')) {
        const parts = timeStr.split(':');
        if (parts.length >= 2) {
          return `${parts[0]}:${parts[1]}`;
        }
      }
      return timeStr;
    } catch (e) {
      return 'N/A';
    }
  }

  getSoutenancesByDate(date: string | Date): Observable<SoutenanceView[]> {
    // Format date if it's a Date object
    const formattedDate = date instanceof Date ? 
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` : 
      date;
    
    let params = new HttpParams().set('date', formattedDate);
    return this.http.get<any[]>(`${this.apiUrl}/by-date`, { 
      params, 
      ...this.getHttpOptions() 
    }).pipe(
      map(soutenances => this.processRawSoutenances(soutenances)),
      catchError(this.handleError)
    );
  }

  private handleError = (error: HttpErrorResponse) => {
    let errorMessage = 'Une erreur s\'est produite!';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Erreur: ${error.error.message}`;
    } else {
      // Server-side error
      if (error.status === 0) {
        errorMessage = 'Impossible de se connecter au serveur. Veuillez vérifier votre connexion réseau.';
      } else if (error.status === 400) {
        errorMessage = 'Requête incorrecte. Veuillez vérifier vos données.';
        if (error.error?.message) {
          errorMessage += ` Détails: ${error.error.message}`;
        }
      } else if (error.status === 404) {
        errorMessage = 'La ressource demandée n\'a pas été trouvée.';
      } else if (error.status === 500) {
        errorMessage = 'Erreur interne du serveur. Veuillez réessayer plus tard.';
      }
      
      // Add server error details if available
      if (error.error && typeof error.error === 'object') {
        const serverErrors = [];
        for (const key in error.error) {
          if (error.error.hasOwnProperty(key)) {
            serverErrors.push(`${key}: ${error.error[key]}`);
          }
        }
        if (serverErrors.length > 0) {
          errorMessage += ` Erreurs serveur: ${serverErrors.join(', ')}`;
        }
      }
    }
    
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
  
  private isValidTimeFormat(time: string): boolean {
    return /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);
  }
  
  // Format a DTO object for creating/updating soutenances
  private prepareSoutenancePayload(data: SoutenanceView): SoutenanceView {
    const payload = { ...data };
    
    // Format time if needed
    if (payload.heureDebut && !payload.heureDebut.includes(':')) {
      payload.heureDebut += ':00';
    }
    
    return payload;
  }
  
  createSoutenance(data: SoutenanceView): Observable<SoutenanceView> {
    const payload = this.prepareSoutenancePayload(data);
    console.log('Creating soutenance with payload:', payload);
    
    return this.http.post<SoutenanceView>(this.apiUrl, payload, this.getHttpOptions()).pipe(
      tap(response => console.log('Created soutenance:', response)),
      catchError(this.handleError)
    );
  }
  
  updateSoutenance(id: number, data: SoutenanceView): Observable<SoutenanceView> {
    const payload = this.prepareSoutenancePayload(data);
    console.log(`Updating soutenance ${id} with payload:`, payload);
    
    return this.http.put<SoutenanceView>(`${this.apiUrl}/${id}`, payload, this.getHttpOptions()).pipe(
      tap(response => console.log('Updated soutenance:', response)),
      catchError(this.handleError)
    );
  }

  deleteSoutenance(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.getHttpOptions()).pipe(
      tap(() => console.log(`Deleted soutenance ${id}`)),
      catchError(this.handleError)
    );
  }

  addJuryMembers(juryMembers: JuryMemberDTO[]): Observable<any> {
    console.log('Adding jury members:', juryMembers);
    return this.http.post<any>(`${this.apiUrl}/jury/batch`, juryMembers, this.getHttpOptions()).pipe(
      tap(response => console.log('Added jury members successfully:', response)),
      catchError(this.handleError)
    );
  }
  
  getEnseignants(): Observable<Enseignant[]> {
    return this.http.get<Enseignant[]>(this.enseignantUrl, this.getHttpOptions()).pipe(
      catchError(this.handleError)
    );
  }
  
  // Get a single soutenance by ID
  getSoutenanceById(id: number): Observable<SoutenanceView> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, this.getHttpOptions()).pipe(
      map(soutenance => {
        // Check if we're dealing with a raw API response or a Soutenance model
        if (soutenance.dateSoutenance !== undefined) {
          // This is likely a raw API response, process it directly
          return this.processRawSoutenances([soutenance])[0];
        } else {
          // This is likely a Soutenance model, use the existing mapper
          return this.mapToSoutenanceView(soutenance);
        }
      }),
      catchError(this.handleError)
    );
  }
}