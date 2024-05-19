import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  static getToken() {
    throw new Error('Method not implemented.');
  }
  private baseUrl = environment.env_url + '/user';

  constructor(private http: HttpClient) { }

  register(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, user);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials);
  }

  setToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  logout(): void {
    localStorage.removeItem('authToken');
  }

  isLoggedIn(): boolean {
    // Check if the token exists in local storage
    return this.getToken() !== null;
  }

  getUserIdFromToken(): number | null {
    const token = this.getToken();
    if (token) {
      const decoded: any = jwtDecode(token);
      return decoded.id;
    }
    return null;
  }

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
