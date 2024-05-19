import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

// Authentication service
export class AuthService {
  // Base URL set
  private baseUrl = environment.env_url + '/user';

  // Constructor
  constructor(private http: HttpClient) { }

  // Method to register user
  register(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, user);
  }

  // Method to login user
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials);
  }

  // Method to set token
  setToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  // Method to get token
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Method to remove token
  logout(): void {
    localStorage.removeItem('authToken');
  }

  // Method to check if user is logged in
  isLoggedIn(): boolean {
    // Check if the token exists in local storage
    return this.getToken() !== null;
  }

  // Method to get user ID from token
  getUserIdFromToken(): number | null {
    const token = this.getToken();
    // If token exists decode and get id
    if (token) {
      const decoded: any = jwtDecode(token);
      return decoded.id;
    }
    return null;
  }

  // Method to check if user is an expert
  isUserExpert(): boolean {
    /* Get the token from local storage */
    const token = this.getToken();

    /* If token doesn't exist or is invalid, return false */
    if (!token) {
      return false;
    }

    /* Decode the token to access its payload */
    const decodedToken: any = jwtDecode(token);

    /* Check if the decoded token contains the is_expert property */
    return decodedToken && decodedToken.is_expert;
  }
}
