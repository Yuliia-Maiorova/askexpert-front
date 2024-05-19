import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class QuestionService {
  private baseUrl = environment.env_url;

  constructor(private http: HttpClient, private authService: AuthService) {}

  getQuestions(): Observable<any> {
    /* Get the token from local storage */
    const token = this.authService.getToken();

    /* If token doesn't exist throw an error */
    if (!token) {
      throw new Error('Token not set. Please log in to get the token.');
    }

    /* Include the token in the request headers */
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.baseUrl}/question`, { headers });
  }

  postQuestion(newQuestion: any): Observable<any> {
    /* Get the token from local storage */
    const token = this.authService.getToken();
    /* Set the token in the header */
    const userId = this.authService.getUserIdFromToken();
  
    /* If token doesn't exist throw an error */
    if (!token) {
      throw new Error('Token not set. Please log in to get the token.');
    }

    if (userId !== null) {
      newQuestion.id = userId;
    }

    if (newQuestion.category_id && typeof newQuestion.category_id === 'object') {
      newQuestion.category_id = newQuestion.category_id.id;
    }

    /* Include the token in the request headers */
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    /* Make the post request with the token included in the headers */
    return this.http.put<any>(`${this.baseUrl}/question/`, newQuestion, { headers });
  }

  getAnswersForQuestion(questionId: number): Observable<any> {
    /* Get the token from local storage */
    const token = this.authService.getToken();
  
    /* If token doesn't exist, throw an error */
    if (!token) {
      throw new Error('Token not set. Please log in to get the token.');
    }
  
    /* Include the token in the request headers */
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  
    /* Make the request to fetch answers for the question */
    return this.http.get<any>(`${this.baseUrl}/answer/${questionId}`, { headers }).pipe(
      catchError(error => {
        console.error('Error fetching answers:', error);
        return throwError('Something went wrong while fetching answers.');
      })
    );
  }  

  postAnswer(postId: number, answerData: any): Observable<any> {
    /* Get the token from local storage */
    const token = this.authService.getToken();

    /* If token doesn't exist, throw an error */
    if (!token) {
      throw new Error('Token not set. Please log in to get the token.');
    }

    /* Include the token in the request headers */
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    /* Make the PUT request to post the answer */
    return this.http.put<any>(`${this.baseUrl}/answer/${postId}`, answerData, { headers });
  }

  upvoteAnswer(answerId: number): Observable<any> {
    /* Get the token from local storage */
    const token = this.authService.getToken();

    /* If token doesn't exist, throw an error */
    if (!token) {
      throw new Error('Token not set. Please log in to get the token.');
    }

    /* Include the token in the request headers */
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    console.log(token)
    console.log(headers)
    /* Make the POST request to upvote the answer */
    return this.http.post(`${this.baseUrl}/answer/upvote/${answerId}`, {}, { headers });
  }

  downvoteAnswer(answerId: number): Observable<any> {
    /* Get the token from local storage */
    const token = this.authService.getToken();

    /* If token doesn't exist, throw an error */
    if (!token) {
      throw new Error('Token not set. Please log in to get the token.');
    }

    /* Include the token in the request headers */
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    /* Make the POST request to downvote the answer */
    return this.http.post(`${this.baseUrl}/answer/downvote/${answerId}`, {},{ headers });
  }

  rateAnswer(answerId: number, rating: number): Observable<any> {
    /* Get the token from local storage */
    const token = this.authService.getToken();

    /* If token doesn't exist, throw an error */
    if (!token) {
      throw new Error('Token not set. Please log in to get the token.');
    }

    /* Include the token in the request headers */
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(`${this.baseUrl}/answer/rate/${answerId}`, { rating }, { headers });
  }

  approveAnswer(answerId: number): Observable<any> {
    /* Get the token from local storage */
    const token = this.authService.getToken();

    /* If token doesn't exist, throw an error */
    if (!token) {
      throw new Error('Token not set. Please log in to get the token.');
    }

    /* Include the token in the request headers */
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    /* Make the POST request to approve the answer */
    return this.http.post(`${this.baseUrl}/answer/approve/${answerId}`,{}, { headers });
  }

  unapproveAnswer(answerId: number): Observable<any> {
    /* Get the token from local storage */
    const token = this.authService.getToken();

    /* If token doesn't exist, throw an error */
    if (!token) {
      throw new Error('Token not set. Please log in to get the token.');
    }

    /* Include the token in the request headers */
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    /* Make the POST request to unapprove the answer */
    return this.http.post(`${this.baseUrl}/answer/unapprove/${answerId}`, {}, { headers });
  }

  getCategories(): Observable<any> {
    return this.http.get(`${this.baseUrl}/category`);
  }

  createCategory(categoryData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/category`, categoryData);
  }

  getFilteredQuestions(isExpert: boolean): Observable<any[]> {
    /* Get the token from local storage */
    const token = this.authService.getToken();

    /* If token doesn't exist, throw an error */
    if (!token) {
      throw new Error('Token not set. Please log in to get the token.');
    }

    /* Include the token in the request headers */
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    // Prepare the request body
    const requestBody = { is_expert: isExpert };

    // Call the API route to get filtered questions based on the expert status
    return this.http.post<any[]>(`${this.baseUrl}/question/unanswered`, requestBody, { headers });
  }
}

