import React from 'react';
import { Product } from '../../Interfaces/interfaces';
import { Link } from 'react-router-dom';
import search from '../../assets/search.png'
import { useSearchProducts } from '../CustomHooks/searchProduct';

interface SearchBarProps {
  products: Product[];
}

const SearchBar: React.FC<SearchBarProps> = ({ products }) => {
  const { searchQuery, filteredProducts, handleSearchChange } = useSearchProducts(products);

  return (
    <div className="search-cont">
      <span className='search-input'>
        <img src={search} alt='buscador'></img>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Buscar productos..."
          className="search-input"
        />
      </span>
      {filteredProducts.length > 0 && (
        <ul className="dropdown-search">
          {filteredProducts.map((product: Product) => (
            <li key={product.id}>
              <Link to={`/productos/id/${product.id}`}>{product.name}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;