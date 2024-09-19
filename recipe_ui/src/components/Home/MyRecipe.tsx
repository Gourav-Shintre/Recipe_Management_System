import React, { useEffect, useState } from "react";
import { getAllRecipes } from "../../service/FetchRecipies";
import DisplayAllRecipes from "../Home/DisplayRecipies";
import "./MyRecipe.css";
import "../DeleteRecipe/ConfirmationDialog.css";
import { useHistory } from "react-router-dom";

interface Recipe {
  recipeId: number;
  title: string;
  category: string;
  image: string;
  preparationTime: number;
  ingredients: string[];
  cookingInstruction: string;
}

const MyRecipes: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const history = useHistory();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      history.push({
        pathname: `/login`,
      });
    }
    fetchRecipes();
  });
  const fetchRecipes = async () => {
    try {
      const data = await getAllRecipes();
      setRecipes(data.slice(-10).reverse());
    } catch (error) {
      console.error("Error fetching recipes", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setTimeout(() => {
      fetchRecipes();
    }, 4600);
  };

  if (loading) {
    return <p className="loading">Loading...</p>;
  }

  return (
    <div className="my-recipes-page">
      {recipes.map((recipe) => (
        <DisplayAllRecipes
          key={recipe.recipeId}
          id={recipe.recipeId} // Add this line
          title={recipe.title}
          category={recipe.category}
          image={recipe.image}
          preparationTime={recipe.preparationTime}
          ingredients={recipe.ingredients}
          cookingInstruction={recipe.cookingInstruction}
          isOnMyRecipe={true}
          onRecipeDelete={handleRefresh}
        />
      ))}
    </div>
  );
};

export default MyRecipes;
