import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Address, Order, OrderContextType, ProductInCart, Shipping, Response, Users } from "../Interfaces/interfaces";
import { useApi } from "./ApiProvider";
import { useUser } from "./UserContext";
import { NavigateFunction } from "react-router-dom";


export const OrderContext = createContext<OrderContextType>({} as OrderContextType);

interface Props {
    children: React.ReactNode;
}

export const OrderProvider = ({ children }: Props) => {

    const { checkToken } = useUser();
    const { dev} = useApi();
    const [order, setOrder] = useState<Order | null>(null);

    const addProductsToOrder = (user: Users, cart: ProductInCart[], totalPrice: number, address: Address, shipping: Shipping) => {
        const newOrder: Order = {
            user: user,
            products: cart,
            total_price: totalPrice,
            date: new Date(),
            address: address,
            shipping: shipping,
            state: 'En proceso'
        };

        setOrder(newOrder);
    }

    const sendOrder = async (data: Order, navigate: NavigateFunction): Promise<Response> => {
        try {
            const token = localStorage.getItem('token')
            
            if (!token) {
                checkToken("", navigate);
                return { success: false, message: "Credenciales incorrectas" };
            } else {

                const tokenResult = await checkToken(token, navigate);

                if (!tokenResult.success) {
                    return { success: false, message: tokenResult.message || "Token inválido" };
                } else {
                    const response = await fetch(`${dev}/index.php?action=save-order`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                        body: JSON.stringify({ data }),
                    });

                    const result = await response.json();

                    if (result.success) {
                        return { success: true, message: "Orden enviada correctamente" };

                    } else {
                        return { success: false, message: result.message || "No se pudo enviar la orden" };
                    }
                }
            }

        } catch (error) {
            const errorMessage = error instanceof TypeError
                ? "Error de conexión. Verifique su conexión a internet."
                : "Ocurrió un problema inesperado.";

            return { success: false, message: errorMessage };
        }
    }

    useEffect(() => {
        console.log('orden:', order)
    }, [order])

    const value = useMemo(() => ({
        order,
        addProductsToOrder,
        sendOrder,
    }),
        [order]);



    return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export const useOrder = () => {
    return useContext(OrderContext);
};