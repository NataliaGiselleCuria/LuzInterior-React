import { useEffect, useState } from 'react';
import { Orders, Products, Users } from '../../Interfaces/interfaces';

export const useSearch = (data: (Products | Users | Orders)[], showAll: boolean = false) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredResults, setFilteredResults] = useState<(Products | Users | Orders)[]>(
        showAll ? data : []
    );
    

    useEffect(() => {
        if (showAll) {
            setFilteredResults(data);
        }
    }, [data, showAll]);


    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value;
        setSearchQuery(query);
   
        if (query === '') {
            setFilteredResults(showAll ? data : []);
        } else {
            const filtered = data.filter((item) => {
                if ('user' in item) {
                    const user = item.user;
                    if (
                        user.name.toLowerCase().includes(query.toLowerCase()) || 
                        user.email?.toLowerCase().includes(query.toLowerCase())
                    ) {
                        return true;
                    }
                }

                return Object.keys(item).some((key) => {
                    const itemKey = key as keyof typeof item;
                    const value = item[itemKey];
   
                    if (typeof value === 'string' && value.toLowerCase().includes(query)) {
                        return true;
                    }

                    if (key === 'cuit' && typeof value === 'number' && value.toString().includes(query)) {
                        return true;
                    }
   
                    return false;
                });
            });
            setFilteredResults(filtered);
        }
    };
   
    return { searchQuery, filteredResults, handleSearchChange };
};
