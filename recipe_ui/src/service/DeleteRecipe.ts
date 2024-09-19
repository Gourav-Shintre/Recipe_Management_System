import axios from "axios";
export const DeleteRecipe = async (id: Number,userId:Number=1)=> {
  const url =  `https://localhost:7272/api/recipe/${id}?userId=${userId}`;
  try {

    const token = localStorage.getItem('token');  
    const response = await axios.delete(url, {
        headers: {
            'Authorization': `Bearer ${token}`
          }
      });
    console.log("Recipe Deleted successfully!", response.data);
    return true;
  } catch (error) {
    console.error("Failed to Delete recipe:", error);
    return false;
  }
};