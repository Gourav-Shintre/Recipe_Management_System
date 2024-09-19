import axios from 'axios';
import { RecipeEdit } from "../types/RecipeEdit";
 
export const EditRecipe = async(recipe: RecipeEdit,id: Number)=>{
    const url = `https://localhost:7048/api/recipeservice/recipe/${id}`;
    try {
        const token = localStorage.getItem('token');  
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
        const response = await axios.put(url, recipe,config);
        return response.status;
    } catch (error) {
        return error;
    }
}