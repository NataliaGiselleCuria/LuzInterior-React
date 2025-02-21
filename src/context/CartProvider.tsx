import { createContext, ReactNode, useContext, useEffect, useMemo, useReducer } from "react";
import { CartContextType, Products, ProductInCart } from "../Interfaces/interfaces";
import { cartReducer, CartState, calculateTotalPrice } from "./Reducers";
import { useApi } from "./ApiProvider";

export const CartContext = createContext<CartContextType>({} as CartContextType);

interface CartContextProps {
    children: ReactNode;
}

const initialCartState: CartState = {    
    cart: JSON.parse(localStorage.getItem('cart') ?? '[]') as ProductInCart[],
    totalPrice:JSON.parse(localStorage.getItem('totalPrice') ?? '0'),
};

export const CartProvider = ({ children }: CartContextProps) => {

    const [state, dispatch] = useReducer(cartReducer, initialCartState);
    const { products } = useApi();

    const totalPrice = useMemo(() => {
        return calculateTotalPrice(state.cart);
    }, [state.cart]);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(state.cart));
    }, [state.cart]);

    const removeUnavailableProductsFromCart = (storeProducts: Products[]) => {
        const availableProductsInCart = state.cart.filter(cartItem =>
            storeProducts.some(storeProduct => storeProduct.id === cartItem.product.id)
        );
        dispatch({ type: 'set_cart', payload: availableProductsInCart });
    };

    useEffect(() => {

        if (products && products.length > 0) {
            removeUnavailableProductsFromCart(products);
        }
    }, [products]);

    const addToCart = (product: Products, quantity: number) => {
        dispatch({ type: 'add_to_cart', payload: { product, quantity } });
    };

    const removeFromCart = (productId: string) => {
        dispatch({ type: 'remove_from_cart', payload: { productId } });
    };

    const updateQuantity = (productId: string, quantity: number) => {
        dispatch({ type: 'update_quantity', payload: { productId, quantity } });
    };

    const clearCart = () => {
        dispatch({ type: 'clear_cart' });
    };

    const cartValue = useMemo(() => {
    
        return {
            cart: state.cart,
            totalPrice,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
        };
    }, [state.cart, totalPrice]);

    return (
        <CartContext.Provider value={cartValue}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => {
    return useContext(CartContext);
};
