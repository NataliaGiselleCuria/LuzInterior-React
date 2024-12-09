import { useEffect, useState } from 'react';
import { Product } from '../../Interfaces/interfaces';

export const useSearchProducts = (products: Product[], showAll: boolean = false) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredProducts, setFilteredProducts] = useState<Product[]>(
        showAll ? products : []
      );
    

    useEffect(() => {
        if (showAll) {
            setFilteredProducts(products);
          }
      }, [products, showAll]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value;
        setSearchQuery(query);

        if (query === '') {
            setFilteredProducts(showAll ? products : []);
        } else {
            const filtered = products.filter((product) =>
                Object.keys(product).some((key) => {
                    const productKey = key as keyof Product;
                    if (typeof product[productKey] === 'string') {
                        return product[productKey].toLowerCase().includes(query.toLowerCase());
                    }
                    return false;
                })
            );
            setFilteredProducts(filtered);
        }
    };

    return { searchQuery, filteredProducts, handleSearchChange };
};