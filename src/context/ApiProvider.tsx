import { createContext, useContext, ReactNode, useState, useEffect, useMemo } from 'react';
import { Product, ApiContextType, Users, ApiResponse, Shipping, Settings, } from '../Interfaces/interfaces';


export const ApiContext = createContext<ApiContextType>({} as ApiContextType);

interface Props {
    children: ReactNode;
}

export const ApiProvider = ({ children }: Props) => {

    const [products, setProducts] = useState<Product[]>([]);
    const [users, setUsers] = useState<Users[]>([]);
    const [shipping, setShipping] = useState<Shipping[]>([]);
    const [settings, setSettings] = useState<Settings[]>([]);

    // const dev = 'http://localhost/LuzInterior/API';
    const dev = 'https://luz-interior.free.nf/API/';
    // const dev = process.env.BASE_URL || 'http://localhost/LuzInterior/API';


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsRes, usersRes, shippingRes, settingsRes] = await Promise.all([
                    fetch(`${dev}/index.php?action=products`),
                    fetch(`${dev}/index.php?action=users`),
                    fetch(`${dev}/index.php?action=shipping`),
                    fetch(`${dev}/index.php?action=settings`),

                ]);

                if (!productsRes.ok || !usersRes.ok || !shippingRes.ok || !settingsRes.ok) {
                    throw new Error('One or more responses were not ok');
                }

                const [productsData, usersData, shippingData, settingsData] = await Promise.all([
                    productsRes.json(),
                    usersRes.json(),
                    shippingRes.json(),
                    settingsRes.json(),

                ]);

                setProducts(productsData);
                setUsers(usersData);
                setShipping(shippingData);
                setSettings(settingsData);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    //Data del usuario logueado.
    const fetchUserData = async (token: string, email: string): Promise<ApiResponse> => {
        try {
            const response = await fetch(`${dev}/index.php?action=user-data`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ email }),
            });

            return await response.json();
        } catch (error) {
            throw new Error("Error al obtener los datos del usuario");
        }
    };

    //Categorias de los productos.
    const categories = useMemo(() => {
        return Array.from(new Set(products.map((product) => product.category)));
    }, [products]);

    useEffect(() => {
        console.log(products)
      }, [products]);

    const apiValue = useMemo(() => ({
        products,
        setProducts,
        users,
        shipping,
        settings,
        categories,
        dev,
        fetchUserData
    }),
        [
            products,
            users,
            shipping,
            settings,
        ]);

    return (
        <ApiContext.Provider value={apiValue}>
            {children}
        </ApiContext.Provider>
    );
};

export const useApi = () => {
    return useContext(ApiContext);
};
