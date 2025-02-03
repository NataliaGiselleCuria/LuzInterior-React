import { createContext, useContext, ReactNode, useState, useEffect, useMemo } from 'react';
import { Products, ApiContextType, Users, ApiResponse, Shipping, CompanyInfo, Orders, Address, Socials, ListPrice, Faq, Imgs, } from '../Interfaces/interfaces';

export const ApiContext = createContext<ApiContextType>({} as ApiContextType);

interface Props {
    children: ReactNode;
}

export const ApiProvider = ({ children }: Props) => {

    const [products, setProducts] = useState<Products[]>([]);
    const [users, setUsers] = useState<Users[]>([]);
    const [orders, setOrders] = useState<Orders[]>([]);
    const [shipping, setShipping] = useState<Shipping[]>([]);
    const [companyInfo, setCompanyInfo] = useState<CompanyInfo[]>([]);
    const [gallery, setGallery] = useState<Imgs[]>([]);
    const [bannerDesktop, setBannerDesktop] = useState<Imgs[]>([]);
    const [bannerMobile, setBannerMobile] = useState<Imgs[]>([]);
    const [social, setSocial] = useState<Socials[]>([]);
    const [listPrice, setListPrice] = useState<ListPrice[]>([]);
    const [fileUrl, setFileUrl] = useState('');
    const [faq, setFaq] = useState<Faq[]>([]);

    const dev = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsRes, usersRes, ordersRes, shippingRes, companyInfoRes, galleryRes, bannerDesktopRes, bannerMobileRes, socialRes, listPriceRes, faqRes] = await Promise.all([
                    fetch(`${dev}/index.php?action=products`),
                    fetch(`${dev}/index.php?action=users`),
                    fetch(`${dev}/index.php?action=orders`),
                    fetch(`${dev}/index.php?action=shipping`),
                    fetch(`${dev}/index.php?action=company-info`),
                    fetch(`${dev}/index.php?action=gallery`),
                    fetch(`${dev}/index.php?action=banner-desktop`),
                    fetch(`${dev}/index.php?action=banner-mobile`),
                    fetch(`${dev}/index.php?action=social`),
                    fetch(`${dev}/index.php?action=list-price`),
                    fetch(`${dev}/index.php?action=frequently-asked-questions`),
                ]);

                if (!productsRes.ok || !usersRes.ok || !ordersRes.ok || !shippingRes.ok || !companyInfoRes.ok || !galleryRes.ok || !bannerDesktopRes.ok || !bannerMobileRes.ok || !socialRes.ok || !listPriceRes.ok || !faqRes.ok) {
                    throw new Error('One or more responses were not ok');
                }

                const [productsData, usersData, ordersData, shippingData, companyInfoData, galleryData, bannerDesktopData, bannerMobileData, socialData, listPriceData, faqData] = await Promise.all([
                    productsRes.json(),
                    usersRes.json(),
                    ordersRes.json(),
                    shippingRes.json(),
                    companyInfoRes.json(),
                    galleryRes.json(),
                    bannerDesktopRes.json(), 
                    bannerMobileRes.json(),
                    socialRes.json(),
                    listPriceRes.json(),
                    faqRes.json(),
                ]);

                const mappedOrders = ordersData.map((orderData: any) => ({
                    id: orderData.id_order,
                    user: getUserById(usersData, orderData.id_user),
                    date: new Date(orderData.date + "T00:00:00"),
                    products: orderData.products,
                    total_price: parseFloat(orderData.total_price),
                    address: getAddressById(usersData, orderData.id_user, orderData.shipping_address),
                    shipping: orderData.shipping_type,
                    state: orderData.state,
                    new: orderData.new
                }));

                setProducts(productsData);
                setUsers(usersData);
                setOrders(mappedOrders);
                setShipping(shippingData);
                setCompanyInfo(companyInfoData);
                setGallery(galleryData);
                setBannerDesktop(bannerDesktopData);
                setBannerMobile(bannerMobileData);
                setSocial(socialData);
                setListPrice(listPriceData);
                setFaq(faqData)

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
                },
                body: JSON.stringify({ email, token }),
            });
            const data = await response.json();
            console.log(data)
            return data;
        } catch (error) {
            throw new Error("Error al obtener los datos del usuario");
        }
    };

    //Categorias de los productos.
    const categories = useMemo(() => {
        return Array.from(new Set(products.map((product) => product.category)));
    }, [products]);

    // Funciones auxiliares para obtener los detalles de las ordenes.
    const getUserById = (usersData: Users[], userId: number) => {
        if (!Array.isArray(usersData)) {
            console.error('usersData is not an array:', usersData);
            return null;
        }
        return usersData.find(user => user.id === userId) || null;
    }

    const getAddressById = (usersData: Users[], userId: number, addressId: number): Address | null => {

        const user = usersData.find(user => user.id === userId) || null;
        if (!user) {
            return null;
        }

        const address = user.addresses.find(address => Number(address.id) === Number(addressId));
        return address || null;
    };

    const refreshUser = async () => {
        const updateUsers = await fetch(`${dev}/index.php?action=users`);
        const data = await updateUsers.json();
        setUsers(data);
    }

    const refreshOrders = async () => {
        try {
            const [updateOrders, updatedUsers] = await Promise.all([
                fetch(`${dev}/index.php?action=orders`),
                fetch(`${dev}/index.php?action=users`),
            ]);

            const [ordersData, usersData] = await Promise.all([
                updateOrders.json(),
                updatedUsers.json(),
            ]);

            const mappedOrders = ordersData.map((orderData: any) => ({
                id: orderData.id_order,
                user: getUserById(usersData, orderData.id_user),
                date: new Date(orderData.date + "T00:00:00"),
                products: orderData.products,
                total_price: parseFloat(orderData.total_price),
                address: getAddressById(usersData, orderData.id_user, orderData.shipping_address),
                shipping: orderData.shipping_type,
                state: orderData.state,
                new: orderData.new,
            }));

            setOrders(mappedOrders);
        } catch (error) {
            console.error('Error refreshing orders:', error);
        }
    };

    const refreshProducts = async () => {
        const updateProducts = await fetch(`${dev}/index.php?action=products`);
        const data = await updateProducts.json();
        setProducts(data);
    }

    const refreshListPrice = async () => {
        const updateListPrice = await fetch(`${dev}/index.php?action=list-price`);
        const data = await updateListPrice.json();
        setListPrice(data);
    }

    const refreshGallery = async () => {
        try {
            const updateGallery = await fetch(`${dev}/index.php?action=gallery`);
            const data = await updateGallery.json();
            setGallery(data);
        } catch (error) {
            throw new Error("Error al obtener las imagenes de la galería");
        }
    }

    const refreshBanner = async () => {
        try {
            const updateBannerD = await fetch(`${dev}/index.php?action=banner-desktop`);
            const dataD = await updateBannerD.json();
            setBannerDesktop(dataD);

            const updateBannerM = await  fetch(`${dev}/index.php?action=banner-mobile`);
            const dataM = await updateBannerM.json();
            setBannerMobile(dataM);
        } catch (error) {
            throw new Error("Error al obtener las imagenes de la galería");
        }
    }

    const refreshFaq = async () => {
        try {
            const updateFaq = await fetch(`${dev}/index.php?action=frequently-asked-questions`);
            const data = await updateFaq.json();
            setFaq(data);
        } catch (error) {
            throw new Error("Error al obtener las imagenes de la galería");
        }
    }

    const refreshSocial = async () => {
        const updateSocial = await fetch(`${dev}/index.php?action=social`);
        const data = await updateSocial.json();
        setSocial(data);
    }

    useEffect(() => {
        getFile();
    }, []);

    const getFile = async () => {
        try {
            const response = await fetch(`${dev}/index.php?action=get-list-price`); // Ajusta la ruta del endpoint PHP
            const data = await response.json();

            const list = `${dev}/${data.fileUrl}`;
            if (data.success) {
                setFileUrl(list); // Guarda la URL del archivo
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error('Error fetching the file URL:', error);
        }
    };

    useEffect(() => {
        console.log(bannerDesktop)
    }, [bannerDesktop]);

    const apiValue = useMemo(() => ({
        products,
        refreshProducts,
        users,
        refreshUser,
        orders,
        setOrders,
        shipping,
        companyInfo,
        gallery,
        bannerDesktop,
        bannerMobile,
        refreshBanner,
        social,
        refreshSocial,
        listPrice,
        refreshListPrice,
        fileUrl,
        categories,
        dev,
        fetchUserData,
        refreshOrders,
        refreshGallery,
        getFile,
        faq,
        refreshFaq

    }),
        [
            products,
            users,
            orders,
            shipping,
            companyInfo,
            gallery,
            bannerDesktop,
            bannerMobile,
            social,
            fileUrl,
            faq
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
