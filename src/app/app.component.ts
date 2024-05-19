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
  title = 'askexpert';

  ngOnInit() {
    if (isDevMode()) {
      console.log(environment)
      console.log('Development!');
    } else {
      console.log('Production!');
    }
  }

  constructor(private router: Router, private authService: AuthService) {}

  showNavbar(): boolean {
    // Get the current route
    const currentRoute = this.router.url;

    // Determine whether to show the navbar based on the current route
    return !['/login', '/register'].includes(currentRoute);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
