import React, { useState } from 'react';
import { Orders, Products, Users } from '../../Interfaces/interfaces';
import { Link } from 'react-router-dom';
import { useSearch } from '../../CustomHooks/useSearch';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import search from '../../assets/search.png'

interface SearchBarProps {
  data: (Products | Users | Orders)[];
  handleLinkClick: () => void
}

const SearchBar: React.FC<SearchBarProps> = ({ data, handleLinkClick }) => {
  const { searchQuery, filteredResults, handleSearchChange } = useSearch(data);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleOptionClick = () => {
    setIsDropdownOpen(false);
    handleLinkClick();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleSearchChange(e);
    setIsDropdownOpen(true);
  };

  return (
    <div className="search-cont">
      <span className="search-input">
        <LazyLoadImage src={search} alt="buscador"/>
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          placeholder="Buscar ..."
          className="search-input"
        />
      </span>
      {isDropdownOpen && filteredResults.length > 0 && (
        <ul className="dropdown-search">
          {filteredResults.map((item) => (
            <li key={item.id} onClick={handleOptionClick }>
              {isProduct(item) ? (
                <Link to={`/productos/id/${item.id}`}>{item.name}</Link>
              ) : 'name' in item ? (
                <p>{item.name}</p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const isProduct = (item: Products | Users | Orders): item is Products => {
  return (item as Products).name !== undefined;
}

export default SearchBar;