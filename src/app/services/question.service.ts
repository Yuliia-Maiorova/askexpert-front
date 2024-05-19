import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

// Question service
export class QuestionService {
  // Base URL
  private baseUrl = environment.env_url;

  // Constructor
  constructor(private http: HttpClient, private authService: AuthService) {}

  // Method to get questions
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

  // Method to get question by ID
  postQuestion(newQuestion: any): Observable<any> {
    /* Get the token from local storage */
    const token = this.authService.getToken();
    /* Set the token in the header */
    const userId = this.authService.getUserIdFromToken();
  
    /* If token doesn't exist throw an error */
    if (!token) {
      throw new Error('Token not set. Please log in to get the token.');
    }

    // Is user authenticated get the id
    if (userId !== null) {
      newQuestion.id = userId;
    }

    /* Include the token in the request headers */
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

  // Method to get question by ID
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

  // Post answer to a question
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

  // Upvote an answer
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

    /* Make the POST request to upvote the answer */
    return this.http.post(`${this.baseUrl}/answer/upvote/${answerId}`, {}, { headers });
  }

  // Downvote an answer
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

  // Rate an answer
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

  // Approve an answer
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

  // Unapprove an answer
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

  // Get existing categories
  getCategories(): Observable<any> {
    return this.http.get(`${this.baseUrl}/category`);
  }

  // Create a new category
  createCategory(categoryData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/category`, categoryData);
  }

  // Get filtered questions
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
    return this.http.get<any[]>(`${this.baseUrl}/question/unanswered`, { headers });
  }

  // Method to post a new comment for an answer
  postComment(answerId: number, content: string): Observable<any> {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('Token not set. Please log in to get the token.');
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.put<any>(`${this.baseUrl}/comment/${answerId}`, { content }, { headers }).pipe(
      catchError(error => {
        console.error('Error posting comment:', error);
        return throwError('Something went wrong while posting comment.');
      })
    );
  }

  // Method to fetch comments for an answer
  getCommentsForAnswer(answerId: number): Observable<any[]> {
    const token = this.authService.getToken();
    if (!token) {
      throw new Error('Token not set. Please log in to get the token.');
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any[]>(`${this.baseUrl}/comment/${answerId}`, { headers }).pipe(
      catchError(error => {
        console.error('Error fetching comments:', error);
        return throwError('Something went wrong while fetching comments.');
      })
    );
  }
}

