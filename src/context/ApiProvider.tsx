import { createContext, useContext, ReactNode, useState, useEffect, useMemo, useCallback } from 'react';
import { Products, ApiContextType, Users, ApiResponse, Shipping, CompanyInfo, Orders, Address, Socials, ListPrice, Faq, Imgs, } from '../Interfaces/interfaces';
import { jwtDecode } from 'jwt-decode';
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
    const [userActive, setUserActive] = useState<Users | null>(null);
    const [latestOrderActiveUser, setLatestOrderActiveUser] = useState<Orders | null>(null);

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

                const [productsData, ordersData, shippingData, companyInfoData, galleryData, bannerDesktopData, bannerMobileData, socialData, listPriceData, faqData] = await Promise.all([
                    productsRes.json(),
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

                // Decodificar el JWT recibido en las respuestas
                const usersData = await usersRes.json();
                const decodedUsers = jwtDecode(usersData.token) as any;
                const usersArray = Array.isArray(decodedUsers.data) ? decodedUsers.data : [decodedUsers.data];

                const mappedOrders = ordersData?.map((orderData: any) => ({

                    id: orderData.id_order,
                    user: getUserById(usersArray, orderData.id_user),
                    date: new Date(orderData.date + "T00:00:00"),
                    products: orderData.products,
                    total_price: parseFloat(orderData.total_price),
                    address: getAddressById(usersArray, orderData.id_user, orderData.shipping_address),
                    shipping: orderData.shipping_type,
                    state: orderData.state,
                    new: orderData.new
                }));

                setProducts(productsData);
                setUsers(decodedUsers.data);
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

            if (!data.token) {
                throw new Error("El token no fue recibido en la respuesta");
            }

            const decodedUsers = jwtDecode(data.token);

            if (!decodedUsers.data || !decodedUsers.data.user) {
                throw new Error("El token decodificado no contiene los datos esperados");
            }

            return {
                success: true,
                message: "Datos del usuario obtenidos correctamente",
                user: decodedUsers.data.user,
            };
        } catch (error) {
            return { success: false, message: "Error al obtener los datos del usuario", user: null };
        }
    };

    //Categorias de los productos.
    const categories = useMemo(() => {
        return Array.from(new Set(products.map((product) => product.category)));
    }, [products]);

    const getUserActive = useCallback(async (token: string, email: string): Promise<ApiResponse> => {
        try {
            const userActiveResponse = await fetchUserData(token, email);

            if (userActiveResponse.success && userActiveResponse.user) {

                setUserActive(userActiveResponse.user);
                return { success: true, message: "Inicio de sesión exitoso", user: userActiveResponse.user };

            } else {
                return { success: false, message: "No se pudieron obtener los datos del usuario" };
            }
        } catch (error) {
            const errorMessage = error instanceof TypeError
                ? "Error de conexión. Verifique su conexión a internet."
                : "Ocurrió un problema inesperado.";
            return { success: false, message: errorMessage };
        } finally {
            // setIsLogin(false); // Finaliza el estado de carga
        }
    }, []);

    // Funciones auxiliares para obtener los detalles de las ordenes.
    const getUserById = (decodedUsers: Users[], userId: number): Users | null => {
        if (!Array.isArray(decodedUsers)) {
            console.error('decodedUsers is not an array:', decodedUsers);
            return null;
        }

        return decodedUsers.find(user => user.id === userId) || null;
    };

    const getAddressById = (decodedUsers: Users[], userId: number, addressId: number): Address | null => {
        const user = decodedUsers.find(user => user.id === userId) || null;

        if (!user) {
            return null;
        }
        const address = user.addresses.find(address => Number(address.id_address) === Number(addressId));
        return address || null;
    };

    const getLatestOrderActiveUser = () => {
        if (!userActive) return;

        if (orders.length === 0) {
            setLatestOrderActiveUser(null);
            return;
        }

        const userOrders = orders.filter(order => order.user?.id === userActive.id);

        const latestOrder = userOrders.length > 0
            ? userOrders.reduce((latest, order) => order.id > latest.id ? order : latest)
            : null;

        setLatestOrderActiveUser(latestOrder);
    }

    const refreshUser = async () => {
        try {
            const response = await fetch(`${dev}/index.php?action=users`);
            const data = await response.json();
            const decodedData = jwtDecode(data.token) as any;

            if (!decodedData?.data) {
                throw new Error("Datos de usuario no encontrados en el token");
            }

            setUsers(Array.isArray(decodedData.data) ? decodedData.data : [decodedData.data]);
        } catch (error) {
            console.error("Error al actualizar usuarios:", error);
        }
    };

    const refreshOrders = async () => {
        try {
            const [updateOrders, updatedUsers] = await Promise.all([
                fetch(`${dev}/index.php?action=orders`),
                fetch(`${dev}/index.php?action=users`),
            ]);

            if (!updateOrders.ok || !updatedUsers.ok) {
                throw new Error("Error en la respuesta del servidor.");
            }

            const [ordersData, usersData] = await Promise.all([
                updateOrders.json(),
                updatedUsers.json(),
            ]);

            if (!usersData.token) {
                throw new Error("Token de usuarios no recibido.");
            }

            const decodedUsers = jwtDecode(usersData.token) as any;

            if (!decodedUsers?.data) {
                throw new Error("Datos de usuario no encontrados en el token");
            }

            const usersArray = Array.isArray(decodedUsers.data) ? decodedUsers.data : [decodedUsers.data];

            const mappedOrders = ordersData.map((orderData: any) => ({
                id: orderData.id_order,
                user: getUserById(usersArray, orderData.id_user),
                date: new Date(orderData.date + "T00:00:00"),
                products: orderData.products,
                total_price: parseFloat(orderData.total_price),
                address: getAddressById(usersArray, orderData.id_user, orderData.shipping_address),
                shipping: orderData.shipping_type,
                state: orderData.state,
                new: orderData.new,
            }));

            setOrders(mappedOrders);

        } catch (error) {
            console.error('Error al actualizar órdenes:', error);
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

            const updateBannerM = await fetch(`${dev}/index.php?action=banner-mobile`);
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

    useEffect(() => {
        getLatestOrderActiveUser();
    }, [orders]);

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
        getUserActive,
        userActive,
        setUserActive,
        faq,
        refreshFaq,
        latestOrderActiveUser

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
            faq,
            userActive,
            latestOrderActiveUser
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
