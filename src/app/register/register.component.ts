import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

// Register Component
export class RegisterComponent {
  // Register Form
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';
  isExpert: boolean = false;

  // Constructor
  constructor(private authService: AuthService, private router: Router) { }

  // Register Form Submission
  onSubmit() {
    // User Object
    const user = {
      first_name: this.firstName,
      last_name: this.lastName,
      email: this.email,
      password: this.password,
      isExpert: this.isExpert
    };

    // Register
    this.authService.register(user).subscribe(response => {
      this.authService.setToken(response.token);
      this.router.navigate(['/login']);
    }, error => {
      console.error('Registration error:', error);
    });
  }
}
