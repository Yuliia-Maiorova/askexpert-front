import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

/* Login component */
export class LoginComponent {
  /* Login form */
  email: string = '';
  password: string = '';
  loginError: string = '';

  /* Constructor */
  constructor(private authService: AuthService, private router: Router) { }

  /* Login form submission */
  onSubmit() {
    /* Get credentials */
    const credentials = {
      email: this.email,
      password: this.password
    };

    /* Login */
    this.authService.login(credentials).subscribe(
      response => {
        /* Redirect to home page */
        if (response && response.token) {
          this.authService.setToken(response.token);
          this.router.navigate(['/']);
        } else {
          /* Throw error */
          this.loginError = 'Invalid response from server';
        }
      },
      error => {
        /* Throw error */
        console.error('Login error:', error);
        this.loginError = 'Login failed. Please try again.';
      }
    );
  }
}
