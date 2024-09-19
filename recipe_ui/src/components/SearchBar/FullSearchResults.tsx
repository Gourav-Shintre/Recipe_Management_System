import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";

import placeholderImage from "../../asset/Images/Default_Recipe_Image.jpg";
import "../SearchBar/FullSearchResults.css";
import axios from "axios";
import { getAllRecipes } from "../../service/FetchRecipies";

interface FullSearchResultProps {
  recipeId: number;
  title: string;
  category: string;
  image: string;
  preparationTime: number;
  ingredients: string[];
  cookingInstruction: string;
}

const FullSearchResult: React.FC<FullSearchResultProps> = () => {
  const history = useHistory();
  const [searchResults, setSearchResults] = useState<FullSearchResultProps[]>(
    []
  );
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const location = useLocation();
  const [data, setData] = useState<FullSearchResultProps[]>([]);

  const { searchQuery } = location.state as { searchQuery: string };

  const fetchRecipes = async () => {
    try {
      const data = await getAllRecipes();
      filterRecipes(searchQuery, data);
    } catch (error) {
      console.error("Error fetching recipe", error);
    }
  };

  useEffect(() => {
    fetchRecipes();
  },[searchQuery]);

  const filterRecipes = (value: string, data: FullSearchResultProps[]) => {
    if (value.trim() === "") {
      setSearchResults([]);
      return;
    }

    const lowercasedQuery = value.toLowerCase();
    console.log(data);
    const results = data.filter((recipe) =>
      recipe.title.toLowerCase().includes(lowercasedQuery)
    );

    setSearchResults(results);
    console.log(results);
  };

  const convertMinutesToHoursAndMinutes = (totalMinutes: number) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return { hours, minutes };
  };

  const handleExpandToggle = (recipeId: string) => {
    history.push(`/recipe-details/${recipeId}`);
  };

  return (
    <div >
      <h1>Results for: {searchQuery}</h1>
      {searchResults.length > 0 ? (
        <div className="searchRecipe">
          {searchResults.map((result) => {
            const {
              recipeId,
              title,
              category,
              image,
              preparationTime,
              ingredients,
              cookingInstruction,
            } = result;
            const { hours, minutes } =
              convertMinutesToHoursAndMinutes(preparationTime);

            return (
              <div key={recipeId} className="display-all-recipes">
                <div className={`recipe-card ${isExpanded ? "expanded" : ""}`}>
                  <img
                    src={image || placeholderImage}
                    alt={title}
                    className="recipe-image"
                  />
                  <div className="recipe-info">
                    <h3 className="recipe-title">{result.title}</h3>
                    <p className="recipe-category">{result.category}</p>
                    <p className="recipe-prep-time">
                      Prep Time:{" "}
                      {hours > 0 && `${hours} hr${hours > 1 ? "s" : ""} `}{" "}
                      {minutes > 0 && `${minutes} min${minutes > 1 ? "s" : ""}`}
                    </p>
                  </div>
                  <div className="recipe-actions">
                    {isExpanded ? (
                      <button
                        className="action-icon"
                        onClick={() =>
                          handleExpandToggle(result.recipeId.toString())
                        }
                        aria-label="Close"
                      >
                        <IoCloseSharp />
                      </button>
                    ) : (
                      <button
                        className="action-icon"
                        onClick={() =>
                          handleExpandToggle(result.recipeId.toString())
                        }
                        aria-label="View Details"
                      >
                        <FaEye />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
};

export default FullSearchResult;
