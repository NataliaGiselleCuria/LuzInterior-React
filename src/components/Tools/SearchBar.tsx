import React from 'react';
import { Products, Users } from '../../Interfaces/interfaces';
import { Link } from 'react-router-dom';
import search from '../../assets/search.png'
import { useSearch } from '../CustomHooks/useSearch';

interface SearchBarProps {
  data: (Products | Users)[];
}

const SearchBar: React.FC<SearchBarProps> = ({ data }) => {
  const { searchQuery, filteredResults, handleSearchChange } = useSearch(data);

  return (
    <div className="search-cont">
      <span className='search-input'>
        <img src={search} alt='buscador'></img>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Buscar ..."
          className="search-input"
        />
      </span>
      {filteredResults.length > 0 && (
        <ul className="dropdown-search">
          {filteredResults.map((item) => (
           <li key={item.id}>
           {isProduct(item) ? (
                <Link to={`/productos/id/${item.id}`}>{item.name}</Link>
              ) : (
                <p>{item.name}</p>
              )}
         </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const isProduct = (item: Products | Users): item is Products => {
  return (item as Products).name !== undefined;
}

export default SearchBar;