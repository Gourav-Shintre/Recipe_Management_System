import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { environment } from '../../environments/environment';
import { RecipeList } from './recipe-list';

@Injectable({
  providedIn: 'root'
})
export class RecipeListService {

  constructor(private http: HttpClient) {
  }

  url: string = environment.apiBaseUrl + 'api/recipeservice/recipe';
  listRecipe: RecipeList[] = [];

  getRecipeSort() {
    this.listRecipe = this.listRecipe.sort((a, b) => {
      const dateA = new Date(a.createdOn);
      const dateB = new Date(b.createdOn);
      return dateB.getTime() - dateA.getTime();
    });
  }

  getRecipes() {
    const token = sessionStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    this.http.get(this.url, { headers })
      .subscribe({
        next: res => {
          this.listRecipe = res as RecipeList[]
          this.getRecipeSort();
        },
        error: err => console.log(err)
      })
  }
}
