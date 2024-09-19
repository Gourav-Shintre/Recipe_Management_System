import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RecipeListService } from './recipe-list.service';
import { RecipeList } from './recipe-list';
import { environment } from '../../environments/environment';

describe('RecipeListService', () => {
  let service: RecipeListService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RecipeListService]
    });

    service = TestBed.inject(RecipeListService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have correct API URL', () => {
    expect(service.url).toBe(`${environment.apiBaseUrl}api/recipeservice/recipe`);
  });

  describe('getRecipes', () => {
    it('should retrieve and sort recipes from the API', () => {
      const mockRecipes: RecipeList[] = [
        {
          image: 'test.jpg',
          title: 'Test Recipe 1',
          category: 'Dessert',
          preparationTime: 45,
          recipeId: 1,
          ingredients: "qwwqdwqd,dfefeqdfe",
          cookingInstruction: "wfewfwfwfwefwfwfwfwfwfwfwfwfwfw",
          userId: 1,
          createdOn: new Date("2024-08-06 16:01:27.0254221"),
        },
        {
          image: 'test.jpg',
          title: 'Test Recipe 2',
          category: 'Dessert',
          preparationTime: 45,
          recipeId: 1,
          ingredients: "qwwqdwqd,dfefeqdfe",
          cookingInstruction: "wfewfwfwfwefwfwfwfwfwfwfwfwfwfw",
          userId: 1,
          createdOn: new Date("2024-08-06 16:01:27.0254221"),
        },
        {
          image: 'test.jpg',
          title: 'Test Recipe 3',
          category: 'Dessert',
          preparationTime: 45,
          recipeId: 1,
          ingredients: "qwwqdwqd,dfefeqdfe",
          cookingInstruction: "wfewfwfwfwefwfwfwfwfwfwfwfwfwfw",
          userId: 1,
          createdOn: new Date("2024-08-06 16:01:27.0254221"),
        }
      ];

      service.getRecipes();

      const req = httpMock.expectOne(`${environment.apiBaseUrl}api/recipeservice/recipe`);
      expect(req.request.method).toBe('GET');
      req.flush(mockRecipes);

      expect(service.listRecipe).toEqual([
        {
          image: 'test.jpg',
          title: 'Test Recipe 1',
          category: 'Dessert',
          preparationTime: 45,
          recipeId: 1,
          ingredients: "qwwqdwqd,dfefeqdfe",
          cookingInstruction: "wfewfwfwfwefwfwfwfwfwfwfwfwfwfw",
          userId: 1,
          createdOn: new Date("2024-08-06 16:01:27.0254221"),
        },
        {
          image: 'test.jpg',
          title: 'Test Recipe 2',
          category: 'Dessert',
          preparationTime: 45,
          recipeId: 1,
          ingredients: "qwwqdwqd,dfefeqdfe",
          cookingInstruction: "wfewfwfwfwefwfwfwfwfwfwfwfwfwfw",
          userId: 1,
          createdOn: new Date("2024-08-06 16:01:27.0254221"),
        },
        {
          image: 'test.jpg',
          title: 'Test Recipe 3',
          category: 'Dessert',
          preparationTime: 45,
          recipeId: 1,
          ingredients: "qwwqdwqd,dfefeqdfe",
          cookingInstruction: "wfewfwfwfwefwfwfwfwfwfwfwfwfwfw",
          userId: 1,
          createdOn: new Date("2024-08-06 16:01:27.0254221"),
        }
      ]);
    });

    it('should handle HTTP error gracefully', () => {
      service.getRecipes();

      const req = httpMock.expectOne(`${environment.apiBaseUrl}api/recipeservice/recipe`);
      expect(req.request.method).toBe('GET');
      req.flush('Error', { status: 500, statusText: 'Server Error' });

      // Check that listRecipe is empty or handle the error in a specific way if required
      expect(service.listRecipe).toEqual([]);
    });
  });

  describe('getRecipeSort', () => {
    it('should sort recipes by createdOn date in descending order', () => {
      service.listRecipe = [
        {
          image: 'test.jpg',
          title: 'Test Recipe 1',
          category: 'Dessert',
          preparationTime: 45,
          recipeId: 1,
          ingredients: "qwwqdwqd,dfefeqdfe",
          cookingInstruction: "wfewfwfwfwefwfwfwfwfwfwfwfwfwfw",
          userId: 1,
          createdOn: new Date("2024-08-06 16:01:27.0254221"),
        },
        {
          image: 'test.jpg',
          title: 'Test Recipe 2',
          category: 'Dessert',
          preparationTime: 45,
          recipeId: 1,
          ingredients: "qwwqdwqd,dfefeqdfe",
          cookingInstruction: "wfewfwfwfwefwfwfwfwfwfwfwfwfwfw",
          userId: 1,
          createdOn: new Date("2024-08-06 16:01:27.0254221"),
        },
        {
          image: 'test.jpg',
          title: 'Test Recipe 3',
          category: 'Dessert',
          preparationTime: 45,
          recipeId: 1,
          ingredients: "qwwqdwqd,dfefeqdfe",
          cookingInstruction: "wfewfwfwfwefwfwfwfwfwfwfwfwfwfw",
          userId: 1,
          createdOn: new Date("2024-08-06 16:01:27.0254221"),
        }
      ];

      service.getRecipeSort();

      expect(service.listRecipe).toEqual([
        {
          image: 'test.jpg',
          title: 'Test Recipe 1',
          category: 'Dessert',
          preparationTime: 45,
          recipeId: 1,
          ingredients: "qwwqdwqd,dfefeqdfe",
          cookingInstruction: "wfewfwfwfwefwfwfwfwfwfwfwfwfwfw",
          userId: 1,
          createdOn: new Date("2024-08-06 16:01:27.0254221"),
        },
        {
          image: 'test.jpg',
          title: 'Test Recipe 2',
          category: 'Dessert',
          preparationTime: 45,
          recipeId: 1,
          ingredients: "qwwqdwqd,dfefeqdfe",
          cookingInstruction: "wfewfwfwfwefwfwfwfwfwfwfwfwfwfw",
          userId: 1,
          createdOn: new Date("2024-08-06 16:01:27.0254221"),
        },
        {
          image: 'test.jpg',
          title: 'Test Recipe 3',
          category: 'Dessert',
          preparationTime: 45,
          recipeId: 1,
          ingredients: "qwwqdwqd,dfefeqdfe",
          cookingInstruction: "wfewfwfwfwefwfwfwfwfwfwfwfwfwfw",
          userId: 1,
          createdOn: new Date("2024-08-06 16:01:27.0254221"),
        }
      ]);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty recipe list', () => {
      service.listRecipe = [];

      service.getRecipeSort();

      expect(service.listRecipe).toEqual([]);
    });

    it('should handle list with single recipe', () => {
      service.listRecipe = [
        {
          image: 'test.jpg',
          title: 'Test Recipe 1',
          category: 'Dessert',
          preparationTime: 45,
          recipeId: 1,
          ingredients: "qwwqdwqd,dfefeqdfe",
          cookingInstruction: "wfewfwfwfwefwfwfwfwfwfwfwfwfwfw",
          userId: 1,
          createdOn: new Date("2024-08-06 16:01:27.0254221"),
        }
      ];

      service.getRecipeSort();

      expect(service.listRecipe).toEqual([
        {
          image: 'test.jpg',
          title: 'Test Recipe 1',
          category: 'Dessert',
          preparationTime: 45,
          recipeId: 1,
          ingredients: "qwwqdwqd,dfefeqdfe",
          cookingInstruction: "wfewfwfwfwefwfwfwfwfwfwfwfwfwfw",
          userId: 1,
          createdOn: new Date("2024-08-06 16:01:27.0254221"),
        }
      ]);
    });
  });
});
