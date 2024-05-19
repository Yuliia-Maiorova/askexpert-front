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
  showUnanswered: boolean = false; // New property for checkbox
  filteredQuestions: any[] = []; // New property for filtered questions
  selectedCategory: any;
  selectedCategoryId: number = 0;
  selectedCategoryHex: string = '';
  categories: any[] = [];
  isExpert: boolean = false; // Assuming isExpert should be a boolean property
  newAnswers: { [key: number]: string } = {}; // Object to store new answers for each question
  isUpvoted: boolean = false; // Define isUpvoted variable
  searchText: string = ''; // Search text

  constructor(private questionService: QuestionService, private categoryService: CategoryService, private authService: AuthService) { }

  // On page initialization
  ngOnInit(): void {
    // Get all questions
    this.getQuestions();
    // Get all categories
    this.getCategories();
    /* Set isExpert based on token */
    const token = this.authService.getToken();
    // Get and decode token, get expert value
    if (token) {
      const decodedToken: any = jwtDecode(token);
      this.isExpert = decodedToken.is_expert;
    }
  }

  // Voting
  toggleVote(answerId: number) {
    this.isUpvoted = !this.isUpvoted; // Toggle the vote
    if (this.isUpvoted) {
      // Call the upvote function
      this.upvoteAnswer(answerId);
    } else {
      // Call the downvote function
      this.downvoteAnswer(answerId);
    }
  }

  // Method to handle category change
  onCategoryChange(category: any) {
    // Set category information
    this.selectedCategory = category;
    this.selectedCategoryId = category.id;
    this.selectedCategoryHex = category.hex_code;
  }

  // Method to handle search text change
  filterQuestions() {
    // Filter questions based on search text
    if (this.searchText.trim() === '') {
      this.filteredQuestions = this.questions; // If search text is empty, show all questions
    } else {
      // Filter questions based on search text
      this.filteredQuestions = this.questions.filter(question => 
        question.title.toLowerCase().includes(this.searchText.trim().toLowerCase())
      );
    }
  }

  // Method to get all questions
  getQuestions() {
    // Get all questions
    this.questionService.getQuestions().subscribe(
      (response) => {
        this.questions = response.posts;
        // Call filter method after getting questions
        this.filterQuestions();
      },
      (error) => {
        console.error('Error fetching questions:', error);
      }
    );
  }

  // Method to get filtered questions
  toggleFilteredQuestions() {
    // Toggle showUnanswered value if expert else all questions
    if (this.showUnanswered && this.isExpert) {
      this.getUnansweredQuestions();
    } else {
      this.getQuestions();
    }
  }

  // Method to get unanswered questions
  async getUnansweredQuestions() {
    try {
      // Call the API to get unanswered questions
      this.questionService.getFilteredQuestions(this.isExpert).subscribe(
        (unansweredQuestions) => {
          this.filteredQuestions = unansweredQuestions; // Update filteredQuestions with unanswered questions
        },
        (error) => {
          console.error('Error fetching unanswered questions:', error);
        }
      );
    } catch (error) {
      console.error('Error fetching unanswered questions:', error);
    }
  }

  // Method to get all categories
  getCategories() {
    // Get all categories
    this.categoryService.getCategories().subscribe(
      (response) => {
        this.categories = response;
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );
  }

  // Method to post a question
  postQuestion() {
    const userId = this.authService.getUserIdFromToken();
    // Retrieve title and content from the form fields
    const title = this.newQuestion.title;
    const content = this.newQuestion.content;

    // Ensure user is authenticated
    if (!userId) {
      console.error('User not authenticated');
      return;
    }

    // Ensure title and content are not empty
    if (!title || !content) {
      console.error('Please provide a title and content');
      return;
    }

    // Ensure a category is selected
    if (this.selectedCategoryId === 0) {
      console.error('Please select a category');
      return;
    }

    // Create question object
    this.newQuestion.title = title;
    this.newQuestion.content = content;
    this.newQuestion.category_id = this.selectedCategoryId;
    this.newQuestion.id = userId;

    // Post the question
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

  // Get question answers
  toggleAnswers(questionId: number) {
    // Find the question index
    const questionIndex = this.questions.findIndex(q => q.id === questionId);
    // Toggle the answers property
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

  // Voting
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

  // Voting down
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
  
  // Rating
  rateAnswer(answerId: number, rating: number) {
    // Updated method to call the new rateAnswer service method
    this.questionService.rateAnswer(answerId, rating).subscribe(
      (response) => {
        console.log('Rating operation successful:', response);
      },
      (error) => {
        console.error('Error during rating operation:', error);
      }
    );
  }

  // Get category name
  getCategoryName(categoryId: number): string {
    const category = this.categories.find(cat => cat.id === categoryId);
    return category ? category.name : '';
  }
  
  // Get category color
  getCategoryColor(categoryId: number): string {
    const category = this.categories.find(cat => cat.id === categoryId);
    return category ? category.hex_code : 'black'; // Default color if category not found
  }

  // Filter questions by category
  filterByCategory() {
    if (!this.selectedCategory || this.selectedCategory === '') {
      // If no category selected, show all questions
      this.filteredQuestions = this.questions;
    } else {
      // Filter questions based on selected category
      this.filteredQuestions = this.questions.filter(question => parseInt(question.category_id) === parseInt(this.selectedCategory));
    }
  }  

  // Method to check if user chose score, show rate button
  showRateButton(answer: any): boolean {
    return answer.rating;
  }

  // Method to approve answer
  toggleApproval(answer: any) {
    const originalState = answer.approve_counter;

    // Optimistically update UI
    answer.approve_counter = !answer.approve_counter;

    // Determine the appropriate action and endpoint
    const action = answer.approve_counter ? this.questionService.approveAnswer(answer.id) : this.questionService.unapproveAnswer(answer.id);

    // Call the appropriate action approve
    action.subscribe(
      (response) => {
        console.log('Answer approval state changed successfully:', response);
      },
      (error) => {
        console.error('Error changing answer approval state:', error);
        // Revert UI if backend call fails
        answer.approve_counter = originalState;
      }
    );
  }

  // Method to post answer approval
  approveAnswer(answerId: number) {
    // Post approval
    this.questionService.approveAnswer(answerId).subscribe(
      (response) => {
        console.log('Answer approved successfully:', response);
      },
      (error) => {
        console.error('Error approving answer:', error);
      }
    );
  }

  // Method to post answer unapproval
  unapproveAnswer(answerId: number) {
    // Post unapproval
    this.questionService.unapproveAnswer(answerId).subscribe(
      (response) => {
        console.log('Answer unapproved successfully:', response);
      },
      (error) => {
        console.error('Error unapproving answer:', error);
      }
    );
  }

  // Method to post an answer
  postAnswer(postId: number) {
    // Create answer data object
    const answerData = {
      id: this.authService.getUserIdFromToken(),
      content: this.newAnswers[postId],
      is_expert: this.isExpert,
    };

    // Post answer
    this.questionService.postAnswer(postId, answerData).subscribe(
      (response) => {
        console.log('Answer posted successfully:', response);
        // Clear the newAnswer field after successful submission
        this.newAnswers[postId] = '';
        // Refresh the questions list or update the specific question's answers if needed
        this.getQuestions();
      },
      (error) => {
        console.error('Error posting answer:', error);
      }
    );
  }
}
