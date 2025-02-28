import { createContext, useContext, useMemo, useState } from "react";
import { Address, Orders, OrderContextType, ProductInCart, Shipping, Response, Users } from "../Interfaces/interfaces";
import { useApi } from "./ApiProvider";
import { useUser } from "./UserContext";
import { NavigateFunction } from "react-router-dom";
import useVerifyToken from "../CustomHooks/useVerefyToken";
import { useCart } from "./CartProvider";


export const OrderContext = createContext<OrderContextType>({} as OrderContextType);

interface Props {
    children: React.ReactNode;
}

export const OrderProvider = ({ children }: Props) => {

    const { checkToken } = useUser();
    const { dev, refreshOrders } = useApi();
    const { clearCart } = useCart();
    const { validateToken } = useVerifyToken();
    const [ order, setOrder ] = useState<Orders | null>(null);


    const addProductsToOrder = (user: Users, cart: ProductInCart[], totalPrice: number, address: Address, shipping: Shipping) => {
        const newOrder: Orders = {
            id: user.id + Math.random(),
            user: user,
            products: cart,
            total_price: totalPrice,
            date: new Date(),
            address: address,
            shipping: shipping,
            state: 'En proceso',
            new: true
        };

        setOrder(newOrder);
    }

    const sendOrder = async (data: Orders, navigate: NavigateFunction): Promise<Response> => {
        try {
            const token = localStorage.getItem('user_token')

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
                        },
                        body: JSON.stringify({ data, token }),
                    });

                    const result = await response.json();

                    if (result.success) {
                        refreshOrders();
                        clearCart();
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

    const updateOrderState = async (orderId: number, newState: string): Promise<Response> => {
        const isTokenValid = await validateToken();

        if (!isTokenValid) {
            return { success: false, message: "Token inválido." };
        }

        const token = localStorage.getItem('user_token')

        try {
            const response = await fetch(`${dev}/index.php?action=update-state-order`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({orderId, newState, token}),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                const errorData = await response.json();
                return { success: false, message: errorData.message || "Error al actualizar el estado de la orden." };
            }

            return {
                success: result.success,
                message: result.message || "Estado de la orden modificado exitosamente.",
            };

        } catch (error) {
            const errorMessage =
                error instanceof TypeError
                    ? "Error de conexión. Verifique su conexión a internet e intente nuevamente."
                    : "Ocurrió un problema inesperado.";

            return { success: false, message: errorMessage };
        }
    }

    const updateNew = async (orderId: number): Promise<Response> => {
        const isTokenValid = await validateToken();

        if (!isTokenValid) {
            return { success: false, message: "Token inválido." };
        }

        const token = localStorage.getItem('user_token')

        try {
            const response = await fetch(`${dev}/index.php?action=update-new`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({orderId,token}),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                const errorData = await response.json();
                return { success: false, message: errorData.message || "Error alcualizar la orden." };
            }

            refreshOrders();
            return {
                success: result.success,
                message: result.message || "La orden se alcualizar exitosamente.",
            };

        } catch (error) {
            const errorMessage =
                error instanceof TypeError
                    ? "Error de conexión. Verifique su conexión a internet e intente nuevamente."
                    : "Ocurrió un problema inesperado.";

            return { success: false, message: errorMessage };
        }
    }

    const deleteOrder = async(orderId: number): Promise<Response> => {
        const isTokenValid = await validateToken();

        if (!isTokenValid) {
            return { success: false, message: "Token inválido." };
        }

        const token = localStorage.getItem('user_token')

        try {
            const response = await fetch(`${dev}/index.php?action=delete-order`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({orderId,token}),
            });

            const result = await response.json();

            if (!response.ok  || !result.success) {
                const errorData = await response.json();
                return { success: false, message: errorData.message || "Error al eliminar la orden." };
            }

            refreshOrders();
            return {
                success: result.success,
                message: result.message || "La orden se eliminó exitosamente.",
            };

        } catch (error) {
            const errorMessage =
                error instanceof TypeError
                    ? "Error de conexión. Verifique su conexión a internet e intente nuevamente."
                    : "Ocurrió un problema inesperado.";

            return { success: false, message: errorMessage };
        }
    }
    
    const value = useMemo(() => ({
        
        addProductsToOrder,
        sendOrder,
        updateOrderState,
        updateNew,
        deleteOrder,
        order
    }),
        []);

    return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export const useOrder = () => {
    return useContext(OrderContext);
};