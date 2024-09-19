import { Component, Input } from '@angular/core';
import { RecipeList } from '../../shared/recipe-list';

@Component({
  selector: 'app-recipe-list-card',
  templateUrl: './recipe-list-card.component.html',
  styleUrl: './recipe-list-card.component.css'
})
export class RecipeListCardComponent {
  @Input() recipe!: RecipeList;

  getFlooredValue(someValue: number): number {
    return Math.floor(someValue);
  }
}
