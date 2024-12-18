import { ProductInCart, Product } from "../Interfaces/interfaces";

export type CartState = {
    cart: ProductInCart[];
    totalPrice: number;
};

type CartAction =
    | { type: 'add_to_cart'; payload: { product: Product; quantity: number } }
    | { type: 'remove_from_cart'; payload: { productId: string } } // Product ID
    | { type: 'clear_cart' }
    | { type: 'update_quantity'; payload: { productId: string; quantity: number } };

    export const calculateTotalPrice = (cart: ProductInCart[]): number => {
        return cart.reduce(
            (total, item) => total + (item.product.price * item.quantity),
            0
        );
    };

export const cartReducer = (state: CartState, action: CartAction): CartState => {

    switch (action.type) {
        case 'add_to_cart': {

            const { product, quantity } = action.payload;
            const existingItem = state.cart.find(item => item.product.id === product.id);
            let updatedCart;

            if (existingItem) {
                updatedCart = state.cart.map(item =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                updatedCart = [...state.cart, { product, quantity }];
            }
            
            return {
                ...state,
                cart: updatedCart,
            };
        }

        case 'update_quantity': {
            const { productId, quantity } = action.payload;
            let updatedCart;

            updatedCart = state.cart.map(item =>
                item.product.id === productId
                    ? { ...item, quantity }
                    : item
            )
            return {
                ...state,
                cart: updatedCart,
            }
        }

        case 'remove_from_cart': {
            const { productId } = action.payload;
            let updatedCart = state.cart.filter((item) => item.product.id !== productId)

            return {
                ...state,
                cart: updatedCart,
            };
        }

        case 'clear_cart': {
            return {
                ...state,
                cart: [],
                totalPrice: 0,
            };
        }
    }

    return state

} 