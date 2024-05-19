import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComponent } from './register.component';
 
describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  // Set up the test environment before each test case
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Test case: Check if the component is created successfully
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
