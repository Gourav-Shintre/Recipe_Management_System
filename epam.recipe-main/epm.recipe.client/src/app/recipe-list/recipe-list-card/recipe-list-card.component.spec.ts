import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecipeListCardComponent } from './recipe-list-card.component';
import { RecipeList } from '../../shared/recipe-list';

describe('RecipeListCardComponent', () => {
  let component: RecipeListCardComponent;
  let fixture: ComponentFixture<RecipeListCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecipeListCardComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RecipeListCardComponent);
    component = fixture.componentInstance;
    component.recipe  = {
      image: 'test.jpg',
      title: 'Test Recipe',
      category: 'Dessert',
      preparationTime: 45,
      recipeId: 1,
      ingredients: "qwwqdwqd,dfefeqdfe",
      cookingInstruction: "wfewfwfwfwefwfwfwfwfwfwfwfwfwfw",
      userId: 1,
      createdOn: new Date("2024-08-06 16:01:27.0254221"),
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct preparation time as mins when value is less than 60', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelectorAll('.card-text')[1].textContent).toContain('45mins');
  });

  it('getFlooredValue should return the floored value of a number', () => {
    expect(component.getFlooredValue(45.6)).toBe(45);
  });
});
