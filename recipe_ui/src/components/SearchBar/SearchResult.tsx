import React from 'react';
import "./SearchResult.css";
import { RecipeCreate } from '../../types/RecipeCreate';
 
interface SearchResultProps {
  result: RecipeCreate;
  onClick?: () => void;
}
 
const SearchResult: React.FC<SearchResultProps> = ({ result, onClick }) => {
  return (
    <div className="search-result" onClick={onClick} style={{ cursor: 'pointer' }}>
      {result.title}
    </div>
  );
};
 
export default SearchResult;