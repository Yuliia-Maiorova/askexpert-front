import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';
  isExpert: boolean = false;

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit() {
    const user = {
      first_name: this.firstName,
      last_name: this.lastName,
      email: this.email,
      password: this.password,
      isExpert: this.isExpert
    };

    this.authService.register(user).subscribe(response => {
      this.authService.setToken(response.token);
      this.router.navigate(['/login']);
    }, error => {
      console.error('Registration error:', error);
    });
  }
}
