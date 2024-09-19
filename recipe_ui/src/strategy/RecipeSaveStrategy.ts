import { RecipeCreate } from "../types/RecipeCreate";
 
export interface RecipeSaveStrategy {
    saveRecipe(recipe: RecipeCreate): Promise<boolean>;
  }