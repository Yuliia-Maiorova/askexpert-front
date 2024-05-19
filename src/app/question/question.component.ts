import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../services/question.service';
import { CategoryService } from '../services/category.service';
import { AuthService } from '../services/auth.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {
  newQuestion = {
    title: '',
    content: '',
    category_id: null as number | null,
    id: null as number | null
  };
  questions: any[] = [];
  selectedCategory: any;
  selectedCategoryId: number = 0;
  selectedCategoryHex: string = '';
  categories: any[] = [];
  isExpert: boolean = false; // Assuming isExpert should be a boolean property
  newAnswer: string = ''; // Assuming newAnswer should be a string property

  constructor(private questionService: QuestionService, private categoryService: CategoryService, private authService: AuthService) { }

  ngOnInit(): void {
    this.getQuestions();
    this.getCategories();
    /* Set isExpert based on token */
    const token = this.authService.getToken();
    if (token) {
      const decodedToken: any = jwtDecode(token);
      this.isExpert = decodedToken.is_expert;
    }
  }

  // Method to handle category change
  onCategoryChange(category: any) {
    this.selectedCategory = category;
    this.selectedCategoryId = category.id;
    this.selectedCategoryHex = category.hex_code;
  }

  getQuestions() {
    this.questionService.getQuestions().subscribe(
      (response) => {
        this.questions = response;
      },
      (error) => {
        console.error('Error fetching questions:', error);
      }
    );
  }

  getCategories() {
    this.categoryService.getCategories().subscribe(
      (response) => {
        this.categories = response;
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );
  }

  postQuestion() {
    const userId = this.authService.getUserIdFromToken();
    // Retrieve title and content from the form fields
    const title = this.newQuestion.title;
    const content = this.newQuestion.content;

    if (!userId) {
      console.error('User not authenticated');
      return;
    }

    // Ensure title and content are not empty
    if (!title || !content) {
      console.error('Please provide a title and content');
      return;
    }

    if (this.selectedCategoryId === 0) {
      console.error('Please select a category');
      return;
    }

    this.newQuestion.title = title;
    this.newQuestion.content = content;
    this.newQuestion.category_id = this.selectedCategoryId;
    this.newQuestion.id = userId;

    this.questionService.postQuestion(this.newQuestion).subscribe(
      (response) => {
        console.log('Question posted successfully:', response);
        this.newQuestion = { title: '', content: '', category_id: null, id: null };
        this.selectedCategoryId = 0;
        this.getQuestions();
      },
      (error) => {
        console.error('Error posting question:', error);
      }
    );
  }

  toggleAnswers(questionId: number) {
    const questionIndex = this.questions.findIndex(q => q.id === questionId);
    if (questionIndex !== -1) {
      if (!this.questions[questionIndex].showAnswers) {
        /* Fetch answers for the question if not already fetched */
        this.questionService.getAnswersForQuestion(questionId).subscribe(
          (answers) => {
            this.questions[questionIndex].answers = answers;
            this.questions[questionIndex].showAnswers = true;
          },
          (error) => {
            console.error('Error fetching answers:', error);
          }
        );
      } else {
        this.questions[questionIndex].showAnswers = false;
      }
    }
  }

  upvoteAnswer(answerId: number) {
    // Updated method to call the new upvoteAnswer service method
    this.questionService.upvoteAnswer(answerId).subscribe(
      (response) => {
        console.log('Answer upvoted successfully:', response);
      },
      (error) => {
        console.error('Error upvoting answer:', error);
      }
    );
  }

  downvoteAnswer(answerId: number) {
    // Updated method to call the new downvoteAnswer service method
    this.questionService.downvoteAnswer(answerId).subscribe(
      (response) => {
        console.log('Answer upvoted successfully:', response);
      },
      (error) => {
        console.error('Error upvoting answer:', error);
      }
    );
  }
  
  rateAnswer(answerId: number, rating: number) {
    this.questionService.rateAnswer(answerId, rating).subscribe(
      (response) => {
        console.log('Rating operation successful:', response);
        // Update the UI here if needed
      },
      (error) => {
        console.error('Error during rating operation:', error);
      }
    );
  }

  approveAnswer(answerId: number) {
    console.log(answerId)
    this.questionService.approveAnswer(answerId).subscribe(
      (response) => {
        console.log('Answer approved successfully:', response);
        // Update the UI here if needed
      },
      (error) => {
        console.error('Error approving answer:', error);
      }
    );
  }

  unapproveAnswer(answerId: number) {
    this.questionService.unapproveAnswer(answerId).subscribe(
      (response) => {
        console.log('Answer unapproved successfully:', response);
        // Update the UI here if needed
      },
      (error) => {
        console.error('Error unapproving answer:', error);
      }
    );
  }

  postAnswer(postId: number) {
    if (!this.newAnswer.trim()) {
      console.error('Please enter a valid answer');
      return;
    }

    // Create answer data object
    const answerData = {
      id: this.authService.getUserIdFromToken(),
      content: this.newAnswer,
      is_expert: this.isExpert,
    };

    this.questionService.postAnswer(postId, answerData).subscribe(
      (response) => {
        console.log('Answer posted successfully:', response);
        // Clear the newAnswer field after successful submission
        this.newAnswer = '';
        // Refresh the questions list or update the specific question's answers if needed
        this.getQuestions();
      },
      (error) => {
        console.error('Error posting answer:', error);
      }
    );
  }
}
