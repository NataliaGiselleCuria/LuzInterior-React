import React from 'react';
import { Orders, Products, Users } from '../../Interfaces/interfaces';
import { Link } from 'react-router-dom';
import { useSearch } from '../../CustomHooks/useSearch';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import search from '../../assets/search.png'

interface SearchBarProps {
  data: (Products | Users | Orders)[];
}

const SearchBar: React.FC<SearchBarProps> = ({ data }) => {
  const { searchQuery, filteredResults, handleSearchChange } = useSearch(data);

  return (
    <div className="search-cont">
      <span className='search-input'>
        <LazyLoadImage src={search} alt='buscador'></LazyLoadImage>
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