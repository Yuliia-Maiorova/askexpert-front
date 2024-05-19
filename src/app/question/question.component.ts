import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../services/question.service';
import { CategoryService } from '../services/category.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {
  newQuestion: any = {};
  questions: any[] = [];
  selectedCategory: any;
  selectedCategoryId: number = 0;
  selectedCategoryHex: string = '';
  categories: any[] = [];
  isExpert: boolean = false; // Assuming isExpert should be a boolean property
  newAnswer: string = ''; // Assuming newAnswer should be a string property

  constructor(private questionService: QuestionService, private categoryService: CategoryService) { }

  ngOnInit(): void {
    //this.getQuestions();
    this.getCategories();
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
    if (this.selectedCategoryId === 0) {
      console.error('Please select a category');
      return;
    }

    this.newQuestion.category_id = this.selectedCategoryId;
    
    this.questionService.postQuestion(this.newQuestion).subscribe(
      (response) => {
        console.log('Question posted successfully:', response);
        // Clear the form fields after successful submission
        this.newQuestion = {};
        this.selectedCategoryId = 0;
        // Refresh the questions list
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
      this.questions[questionIndex].showAnswers = !this.questions[questionIndex].showAnswers;
    }
  }

  upvoteAnswer(answerId: number) {
    // Send a request to the backend to increment the upvote counter for the answer with the given ID
    this.questionService.upvoteAnswer(answerId).subscribe(
      (response) => {
        console.log('Answer upvoted successfully:', response);
        // Update the answer's upvote counter in the UI if needed
      },
      (error) => {
        console.error('Error upvoting answer:', error);
      }
    );
  }

  approveAnswer(answerId: number) {
    // Send a request to the backend to increment the approve counter for the answer with the given ID
    this.questionService.approveAnswer(answerId).subscribe(
      (response) => {
        console.log('Answer approved successfully:', response);
        // Update the answer's approve counter in the UI if needed
      },
      (error) => {
        console.error('Error approving answer:', error);
      }
    );
  }

  postAnswer(questionId: number) {
    if (!this.newAnswer.trim()) {
      console.error('Please enter a valid answer');
      return;
    }

    this.questionService.postAnswer(questionId, this.newAnswer).subscribe(
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
