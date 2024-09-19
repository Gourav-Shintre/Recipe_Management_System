import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecipeListComponent } from './recipe-list.component';
import { RecipeListService } from '../shared/recipe-list.service';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('RecipeListComponent', () => {
  let component: RecipeListComponent;
  let fixture: ComponentFixture<RecipeListComponent>;
  let mockRecipeListService: jasmine.SpyObj<RecipeListService>;

  beforeEach(async () => {
    // Create a mock service with a spy method for getRecipes
    mockRecipeListService = jasmine.createSpyObj('RecipeListService', ['getRecipes']);
    // Use of() to return a mock observable
    mockRecipeListService.listRecipe = [
      {
        image: 'test.jpg',
        title: 'Test Recipe',
        category: 'Dessert',
        preparationTime: 45,
        recipeId: 1,
        ingredients: "qwwqdwqd,dfefeqdfe",
        cookingInstruction: "wfewfwfwfwefwfwfwfwfwfwfwfwfwfw",
        userId: 1,
        createdOn: new Date("2024-08-06 16:01:27.0254221"),
      }];

    await TestBed.configureTestingModule({
      declarations: [RecipeListComponent],
      providers: [
        { provide: RecipeListService, useValue: mockRecipeListService }
      ],
      schemas: [NO_ERRORS_SCHEMA]  // This prevents errors about unknown elements (e.g., app-recipe-list-card)
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // triggers ngOnInit and other lifecycle hooks
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getRecipes on initialization', () => {
    expect(mockRecipeListService.getRecipes).toHaveBeenCalled();
  });
});
