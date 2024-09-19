import { Component, OnInit } from '@angular/core';
import { RecipeListService } from '../shared/recipe-list.service'
import { Router } from '@angular/router';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrl: './recipe-list.component.css'
})
export class RecipeListComponent implements OnInit {

  constructor(public service: RecipeListService, private router: Router) { }

  ngOnInit(): void {
    if (sessionStorage.getItem("token") === null) {
      this.router.navigate(['/']);
    }
    this.service.getRecipes();
  }

}
