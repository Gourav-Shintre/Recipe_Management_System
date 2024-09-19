import axios from "axios";
import { RecipeCreate } from "../types/RecipeCreate";
import { RecipeSaveStrategy } from "../strategy/RecipeSaveStrategy";
 
export class ApiRecipeSaveStrategy implements RecipeSaveStrategy {
   url = "https://localhost:7048/api/recipeservice/recipe";
 
  async saveRecipe(recipe: RecipeCreate): Promise<boolean> {
    try {
      const token = localStorage.getItem('token');  
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };
      const response = await axios.post(this.url, recipe, config);
      console.log("Recipe saved successfully!", response.data);
      return true;
    } catch (error) {
      console.error("Failed to save recipe:", error);
      return false;
    }
  }
}
 