import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { QuestionComponent } from './question/question.component';
import { AuthGuard } from './auth.guard'

// Create routes
const routes: Routes = [
  // Login
  { path: 'login', component: LoginComponent },
  // Home question
  { path: '', component: QuestionComponent, canActivate: [AuthGuard] },
  // Register
  { path: 'register', component: RegisterComponent },
  // Redirect to login
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
