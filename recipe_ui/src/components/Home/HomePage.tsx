import React, { useEffect, useState } from "react";
import { getAllRecipes } from "../../service/FetchRecipies";
import DisplayAllRecipes from "../Home/DisplayRecipies";
import "./HomePage.css";
import { useHistory } from "react-router-dom";

interface Recipe {
  recipeId: number;
  title: string;
  category: string;
  image: string;
  preparationTime: string; // Assuming this comes as a string and needs parsing
  ingredients: string[]; // Ensure this is always an array
  cookingInstruction: string;
}

const HomePage: React.FC = () => {
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
    const fetchRecipes = async () => {
      try {
        const data = await getAllRecipes();
        setRecipes(data.slice(-10).reverse()); // Display only the latest 10 recipes
      } catch (error) {
        console.error("Error fetching recipes", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  });

  if (loading) {
    return <p className="loading">Loading...</p>;
  }
  return (
    <div className="home-page">
      {recipes.map((recipe) => (
        <DisplayAllRecipes
          key={recipe.recipeId}
          id={recipe.recipeId}
          title={recipe.title}
          category={recipe.category}
          image={recipe.image}
          preparationTime={parseInt(recipe.preparationTime, 10)}
          ingredients={recipe.ingredients} // Pass ingredients as an array
          cookingInstruction={recipe.cookingInstruction}
          isOnMyRecipe={false}
        />
      ))}
    </div>
  );
};

export default HomePage;
