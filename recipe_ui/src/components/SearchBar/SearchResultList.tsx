import React from "react";
import { RecipeCreate } from "../../types/RecipeCreate";
import SearchResult from "./SearchResult";
import { useHistory } from "react-router-dom";
import "./SearchResultList.css";

interface SearchResultsListProps {
  results: RecipeCreate[];
}

const SearchResultsList: React.FC<SearchResultsListProps> = ({ results }) => {
  const history = useHistory();

  const handleRecipeClick = (recipeId: string) => {
    history.push(`/recipe-details/${recipeId}`);
  };

  return (
    <div>
      {results.length === 0 ? (
        <div className="no-results">No results found</div>
      ) : (
        <ul>
          {results.map((result) => (
            <li key={result.id}>
              <SearchResult
                result={result}
                onClick={() => handleRecipeClick(result.recipeId.toString())}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchResultsList;
