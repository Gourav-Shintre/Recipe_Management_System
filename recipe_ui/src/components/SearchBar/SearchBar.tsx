import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import './SearchBar.css';
import { RecipeCreate } from '../../types/RecipeCreate';
import SearchResultsList from '../SearchBar/SearchResultList';
import { useRecipes } from '../../contexts/RecipeContext';
import { useHistory } from 'react-router-dom';

interface SearchBarProps {
  setResults: React.Dispatch<React.SetStateAction<RecipeCreate[]>>;
}

const SearchBar: React.FC<SearchBarProps> = ({ setResults }) => {
  const { recipes } = useRecipes();
  const [input, setInput] = useState<string>("");
  const [results, setLocalResults] = useState<RecipeCreate[]>([]);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [showMore, setShowMore] = useState<boolean>(false);
  const history = useHistory();

  const fetchData = async (value: string) => {
    if (value.trim() === "") {
      setLocalResults([]);
      setResults([]);
      setHasSearched(false);
      setShowMore(false);
      return;
    }

    const filteredResults = recipes.filter((recipe: RecipeCreate) =>
      recipe.title.toLowerCase().includes(value.toLowerCase())
    );

    console.log("Filtered Results:", filteredResults);

    setLocalResults(filteredResults);
    setResults(filteredResults);
    setHasSearched(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    fetchData(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      fetchData(input);
    }
  };

  const handleViewMoreClick = () => {
    setHasSearched(false)
    history.push('/results', { searchQuery: input, searchResults: results });
  };

  const handleFullResultsClick = () => {
    history.push('/results', { searchQuery: input, searchResults: results });
  };

  // Determine which results to show based on the `showMore` state
  const resultsToShow = showMore ? results : results.slice(0, 4);

  return (
    <div className='input-wrapper'>
      <FaSearch id='search-icon' />
      <input
        placeholder='Type to Search...'
        value={input}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      {hasSearched ? (<div className={`search-results ${hasSearched ? 'visible' : ''}`}>
        {hasSearched && results.length === 0 ? (
          <div className="no-results">No results found</div>
        ) : (
          <>
            <SearchResultsList results={resultsToShow} />
            {results.length > 4 && (
              <a className="view-more" onClick={handleViewMoreClick} style={{ cursor: 'pointer' }}>
                {showMore ? 'Show Less' : 'View all related recipes'}
              </a>
            )}
            {showMore && results.length > 4 && (
              <a className="view-more" onClick={handleFullResultsClick} style={{ cursor: 'pointer' }}>
                View Full Results
              </a>
            )}
          </>
        )}
      </div>):(null)}
    </div>
  );
};

export default SearchBar;
