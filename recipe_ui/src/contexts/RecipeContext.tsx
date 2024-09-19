import React, { createContext, useContext, useState, useEffect } from "react";
import { getAllRecipes } from "../service/FetchRecipies";
import { RecipeCreate } from "../types/RecipeCreate";
import { RecipeEdit } from "../types/RecipeEdit";

interface RecipeContextType {
  recipes: RecipeCreate[];
  fetchRecipes: () => void;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export const RecipeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [recipes, setRecipes] = useState<RecipeCreate[]>([]);

  const fetchRecipes = async () => {
    try {
      const data: RecipeCreate[] = await getAllRecipes();
      setRecipes(data);
    } catch (error) {
      console.error("Error fetching recipes", error);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  return (
    <RecipeContext.Provider value={{ recipes, fetchRecipes }}>
      {children}
    </RecipeContext.Provider>
  );
};

export const useRecipes = () => {
  const context = useContext(RecipeContext);
  if (context === undefined) {
    throw new Error("useRecipes must be used within a RecipeProvider");
  }
  return context;
};
