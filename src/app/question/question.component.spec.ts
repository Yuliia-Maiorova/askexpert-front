import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionComponent } from './question.component';

describe('QuestionComponent', () => {
  let component: QuestionComponent;
  let fixture: ComponentFixture<QuestionComponent>;

  // Set up the test environment before each test case
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuestionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Test case: Check if the component is created successfully
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
