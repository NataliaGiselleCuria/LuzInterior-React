import { NavigateFunction } from "react-router-dom";

export interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    description: string;
    img_url: { id_img: string, url: File; priority: number }[];
}

export interface Users {
    id: number;
    email: string;
    password: string;
    name: string;
    cuit: number;
    tel: string;
    addresses: Address[];
    role: string;
}

export interface Address {
    id_address: number;
    street: string;
    street2: string;
    city: string;
    province: string;
    cp: number;
    name_address: string;
    last_name: string;
    company_name: string;
    tel_address: string;
    default_address: boolean;
}

export interface Settings {
    key: string,
    value_number: number | null,
    value: string | null;
}

export interface Shipping {
    id: string,
    description: string,
    price: string
}

export interface ProductInCart {
    product: Product;
    quantity: number;
}

type OrderStatus = "En proceso" | "Entregado" | "Cancelado";

export interface Order {
    // id: number;
    user: Users;
    date: Date;
    products: ProductInCart[];
    total_price: number;
    address: Address,
    shipping: Shipping,
    state: OrderStatus;
}


//forms
export interface LoginFormInputs {
    email: string;
    password: string;
}

export interface RegisterFormInputs {
    name: string;
    cuit: number;
    email: string;
    tel:string;
    password: string;
    repeatPass: string;
}

export interface PersonalInformationFormInputs{
    name: string;
    cuit: number;
    tel: string;
}

export interface AccountInformationFormInputs{
    password:string;
}

export interface FormProduct {
    id: string;
    name: string;
    category: string;
    price: number;
    description: string;
}

export interface FormImgsProduct {
    id: string;
    product: string;
    url: File
    priority: number
}

//response
export interface Response {
    success: boolean;
    message: string;
    fieldErrors?: Record<string, string>;
}

export interface ApiResponse {
    success: boolean;
    message: string;
    user?: Users;
}


//context type
export type ApiContextType = {
    dev: string;
    products: Product[];
    setProducts:  React.Dispatch<React.SetStateAction<Product[]>>;
    users: Users[];
    shipping: Shipping[];
    settings: Settings[];
    categories: string[];
    fetchUserData: (token: string, email: string) => Promise<ApiResponse>;   
}

export type UserContextType = {
    isLogin:boolean;
    userActive: Users | null;
    userLogout: (navigate:NavigateFunction) => void;
    checkToken: (token:string, navigate: NavigateFunction) => Promise<Response>;
    getUserActive:(token:string, email:string) => Promise<ApiResponse>;
    userLogin: (email:string, passwordInput:string) => Promise<Response>;
    userRegister: (data: RegisterFormInputs) => Promise<Response>
    recoverPassword: (email: string) => Promise<Response>;
    updateUserInfo: (data: Record<string, any>, id: number, endpoint: string) =>  Promise<Response>;
}

export type ProductContextType = {
    registerProduct: (data: FormProduct) => Promise<Response>;
    deleteProduct: (productId:string) => Promise<Response>;
    updateProduct: (productId:string, productData: FormProduct) => Promise<Response>;
    uploadImages: (productId: string, images: FormImgsProduct[], deletedImages: FormImgsProduct[]) => Promise<Response>;
    saveProductAndImages: (productData: FormProduct, images: FormImgsProduct[]) => Promise<Response>;
};

export interface CartContextType {
    cart: ProductInCart[];
    totalPrice: number;
    addToCart: (product: Product, quantity: number) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
}

export interface OrderContextType {
    order: Order | null;
    addProductsToOrder: (user: Users, cart:ProductInCart[], totalPrice:number, address:Address, shipping:Shipping) => void;
    sendOrder: (order: Order, navigate: NavigateFunction) =>  Promise<Response>;
}










