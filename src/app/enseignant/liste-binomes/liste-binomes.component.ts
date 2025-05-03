// liste-binomes.component.ts
import { Component, OnInit } from '@angular/core';

interface Student {
  id: number;
  name: string;
  group: string;
}

interface Project {
  id: number;
  students: Student[];
}

interface ChatMessage {
  sender: string;
  role: string;
  content: string;
  timestamp: Date;
}

@Component({
  selector: 'app-liste-binomes',
  templateUrl: './liste-binomes.component.html',
  styleUrls: ['./liste-binomes.component.css']
})
export class ListeBinomesComponent implements OnInit {
  projects: Project[] = [];
  searchTerm: string = '';
  filterType: string = 'par filière';
  
  // Chat related properties
  showChatModal: boolean = false;
  selectedStudent: Student | null = null;
  projectTitle: string = '';
  newMessage: string = '';
  chatMessages: ChatMessage[] = [];

  ngOnInit(): void {
    // Populate with sample data that matches your screenshot
    this.projects = [
      {
        id: 3,
        students: [
          { id: 1, name: 'Arij Chabbouh', group: 'A' }
        ]
      },
      {
        id: 3,
        students: [
          { id: 2, name: 'Maram Amor', group: 'B' }
        ]
      },
      {
        id: 5,
        students: [
          { id: 3, name: 'Sandra dissem', group: 'B' }
        ]
      },
      {
        id: 5,
        students: [
          { id: 4, name: 'Chahd Baatout', group: 'C' }
        ]
      },
      {
        id: 4,
        students: [
          { id: 5, name: 'Arij Meddeb', group: 'D' }
        ]
      },
      {
        id: 4,
        students: [
          { id: 6, name: 'Chahd ben ali', group: 'C' }
        ]
      },
      {
        id: 9,
        students: [
          { id: 7, name: 'Aziz Ben Saad', group: 'A' }
        ]
      },
      {
        id: 9,
        students: [
          { id: 8, name: 'Asma Daoued', group: 'A' }
        ]
      }
    ];

    // Sample chat messages
    this.chatMessages = [
      {
        sender: 'étudiante',
        role: 'student',
        content: 'Quels sont les capteurs les plus adaptés pour détecter la ligne et comment choisir entre des capteurs infrarouges et une caméra avec traitement d\'image ?',
        timestamp: new Date()
      },
      {
        sender: 'Professeur',
        role: 'teacher',
        content: 'Si votre objectif est de réaliser un robot simple et efficace, les capteurs IR suffisent. En revanche, si vous souhaitez un robot plus intelligent et adaptable, l\'utilisation d\'une caméra avec traitement d\'image peut être un bon choix, mais nécessite une expertise en vision artificielle.',
        timestamp: new Date()
      },
      {
        sender: 'étudiante',
        role: 'student',
        content: 'Merci pour votre réponse',
        timestamp: new Date()
      },
      {
        sender: 'Professeur',
        role: 'teacher',
        content: 'Pensez également à tester votre robot dans différentes conditions d\'éclairage',
        timestamp: new Date()
      }
    ];
  }

  getUniqueProjectIds(): number[] {
    const uniqueIds = new Set<number>();
    this.projects.forEach(project => uniqueIds.add(project.id));
    return Array.from(uniqueIds).sort((a, b) => a - b);
  }

  getStudentsByProjectId(projectId: number): Student[] {
    const projectStudents: Student[] = [];
    this.projects.forEach(project => {
      if (project.id === projectId) {
        projectStudents.push(...project.students);
      }
    });
    return projectStudents;
  }

  searchStudent(): void {
    // Implementation for student search
    console.log('Searching for:', this.searchTerm);
  }

  openChatSpace(student: Student, projectId: number): void {
    this.selectedStudent = student;
    this.projectTitle = `Conception et Réalisation d'un Robot Suiveur de Ligne Intelligent`;
    this.showChatModal = true;
  }

  closeChatModal(): void {
    this.showChatModal = false;
    this.selectedStudent = null;
  }

  sendMessage(): void {
    if (!this.newMessage.trim()) return;
    
    const message: ChatMessage = {
      sender: 'Professeur',
      role: 'teacher',
      content: this.newMessage,
      timestamp: new Date()
    };
    
    this.chatMessages.push(message);
    this.newMessage = '';
  }
}