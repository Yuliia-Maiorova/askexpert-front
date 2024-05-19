import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

// Category service
export class CategoryService {
  // Set base URL
  private baseUrl = environment.env_url + '/category';

  // Constructor
  constructor(private http: HttpClient) { }

  // Function to fetch categories from the backend
  getCategories(): Observable<any> {
    return this.http.get<any>(this.baseUrl);
  }
}
