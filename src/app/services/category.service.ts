import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private baseUrl = 'http://localhost:3000/category';

  constructor(private http: HttpClient) { }

  // Function to fetch categories from the backend
  getCategories(): Observable<any> {
    return this.http.get<any>(this.baseUrl);
  }
}
