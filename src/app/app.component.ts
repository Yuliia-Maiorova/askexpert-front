import { Component, OnInit, isDevMode } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  // App title
  title = 'askexpert';

  // Setup init
  ngOnInit() {
    if (isDevMode()) {
      console.log(environment)
      console.log('Development!');
    } else {
      console.log('Production!');
    }
  }

  constructor(private router: Router, private authService: AuthService) {}

  // Display navbar
  showNavbar(): boolean {
    // Get the current route
    const currentRoute = this.router.url;

    // Determine whether to show the navbar based on the current route
    return !['/login', '/register'].includes(currentRoute);
  }

  // Logout
  logout(): void {
    // Logout call
    this.authService.logout();
    // Redirect to login page
    this.router.navigate(['/login']);
  }
}
