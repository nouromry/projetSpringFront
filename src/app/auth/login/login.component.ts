// login.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';
  loading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.formBuilder.group({
      identifiant: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    const email = this.loginForm.controls['identifiant'].value;
    const password = this.loginForm.controls['password'].value;

    this.authService.login(email, password).subscribe({
      next: () => {
        
        const role = this.authService.getRole();
        if (role === 'chefDep') {
          this.router.navigate(['/chef-departement']);
        } else if (role === 'enseignant') {
          this.router.navigate(['/enseignant']);
        } else {
          this.router.navigate(['/etudiant']);
        }
      },
      error: (error) => {
        this.errorMessage = 'Identifiant ou mot de passe incorrect';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  forgotPassword(): void {
    this.router.navigate(['/forgot-password']);
  }
}