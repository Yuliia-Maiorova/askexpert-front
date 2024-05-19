import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private baseUrl = 'http://localhost:3000';
  private token: string = '';

  constructor(private http: HttpClient, private authService: AuthService) {}

  getQuestions(): Observable<any> {
    return this.http.get(`${this.baseUrl}/question`);
  }

  postQuestion(newQuestion: any): Observable<any> {
    const token = this.authService.getToken(); // Get token from AuthService

    if (!token) {
      throw new Error('Token not set. Please log in to get the token.');
    }

    /* Include the token in the request headers */
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    /* Make the post request with the token included in the headers */
    return this.http.put<any>(`${this.baseUrl}/question`, newQuestion, { headers });
  }

  getAnswers(questionId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/answer/${questionId}`);
  }

  postAnswer(questionId: number, answer: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/answer/${questionId}`, answer);
  }

  upvoteAnswer(answerId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/answer/upvote/${answerId}`, {});
  }

  approveAnswer(answerId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/answer/approve/${answerId}`, {});
  }

  getCategories(): Observable<any> {
    return this.http.get(`${this.baseUrl}/category`);
  }

  createCategory(categoryData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/category`, categoryData);
  }
}
