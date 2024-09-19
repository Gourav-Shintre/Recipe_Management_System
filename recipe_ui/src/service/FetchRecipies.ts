import axios from "axios";
 
const API_URL = "https://localhost:7048/api/recipeservice/recipe";
 
export const getAllRecipes = async () => {
  try {
    const token = localStorage.getItem('token');  
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
       const response = await axios.get(API_URL,config);
       return response.data;
     } catch (error) {
       console.error("Error fetching recipes", error);
       throw error;
     }
};