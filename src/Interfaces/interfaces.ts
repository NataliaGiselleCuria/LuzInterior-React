import { NavigateFunction } from "react-router-dom";

export interface Products {
    id: string;
    name: string;
    category: string;
    price: number;
    description: string;
    img_url: { id_img: string, url: File; priority: number }[];
    novelty:boolean;
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
    approved: boolean;
    register_date: Date,
    new:boolean;
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

export interface CompanyInfo {
    key: string,
    value: string | null;
}

export interface Shipping {
    id_shipping: string;
    description: string;
    price: number;
}

export interface Imgs {
    id: string;
    img_url: string;
    priority: number;
    link: string | null;
}

export interface Socials{
    id: string;
    img_social: string;
    url: string;
}

export interface ListPrice{
    list_price: FileList;
    date: Date;
}

export interface Faq{
    id: number;
    question: string;
    answer: string;
}

export interface ProductInCart {
    product:Products;
    product_id: string;
    quantity: number;
}

export type OrderStatus = "En proceso" | "Entregado" | "Cancelado";

export interface Orders {
    id: number;
    user: Users;
    date: Date;
    products: ProductInCart[];
    total_price: number;
    address: Address,
    shipping: Shipping,
    state: OrderStatus;
    new:boolean;
}


//forms
export interface FormLogin {
    email: string;
    password: string;
}

export interface FormRegister {
    name: string;
    cuit: number;
    email: string;
    tel:string;
    password: string;
    repeatPass: string;
}

export interface FormPersonalInformation{
    name: string;
    cuit: number;
    tel: string;
}

export interface FormAccountInformation{
    password:string;
}

export interface FormProduct {
    id: string;
    name: string;
    category: string;
    price: number;
    description: string;
    novelty:boolean;
}

export interface FormImgsProduct {
    id: string;
    product: string;
    url: File
    priority: number
}

export interface FormImgs {
    id: string;
    url: File | string;
    priority: number;
    preview: string;
    link: string | null;
}

export interface FormSocial{
    id: string;
    img_social: FileList;
    social_url: string;
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
    user?: Users | null;
    data?: Users
}

//context type
export type ApiContextType = {
    dev: string;
    products: Products[];
    refreshProducts: () => Promise<void>;
    users: Users[];
    refreshUser:  () => Promise<void>;
    fetchUserData: (token: string, email: string) => Promise<ApiResponse>; 
    orders: Orders[];
    setOrders: React.Dispatch<React.SetStateAction<Orders[]>>;
    refreshOrders: () => Promise<void>;
    shipping: Shipping[];
    companyInfo: CompanyInfo[];
    gallery: Imgs[];
    refreshGallery: () => Promise<void>;
    bannerDesktop: Imgs[];
    bannerMobile: Imgs[];
    refreshBanner: () => Promise<void>;
    social: Socials[];
    refreshSocial: () => Promise<void>;
    listPrice: ListPrice[];
    refreshListPrice: () => Promise<void>;
    fileUrl:string;
    getFile: () => void;
    getUserActive:(token:string, email:string) => Promise<ApiResponse>;
    userActive: Users | null;
    setUserActive: React.Dispatch<React.SetStateAction<Users | null>>;
    faq: Faq[];
    refreshFaq: () => Promise<void>;
    categories: string[];
    latestOrderActiveUser: Orders | null;
}

export type UserContextType = {
    isLogin:boolean;   
    userLogout: (navigate:NavigateFunction) => void;
    checkToken: (token:string, navigate: NavigateFunction) => Promise<Response>;
    userLogin: (email:string, passwordInput:string) => Promise<Response>;
    userRegister: (data: FormRegister) => Promise<Response>
    recoverPassword: (email: string) => Promise<Response>;
    updateUserInfo: (data: Record<string, any>, id: number, endpoint: string) => Promise<Response>;
    updateUserApproved: (id:number) => Promise<Response>;
    updateUserRole: (id:number) => Promise<Response>;
    deletUser: (id:number) => Promise<Response>;
}

export type ProductContextType = {
    registerProduct: (data: FormProduct) => Promise<Response>;
    deleteProduct: (productId:string) => Promise<Response>;
    updateProduct: (productId:string, productData: FormProduct) => Promise<Response>;
    uploadImages: (productId: string, images: FormImgsProduct[], deletedImages: FormImgsProduct[]) => Promise<Response>;
    saveProductAndImages: (productData: FormProduct, images: FormImgsProduct[]) => Promise<Response>;
    updateProductPrices: (percentage:number, productIds: number[]) => Promise<Response>;
    updateListPrice:(data: ListPrice) => Promise<Response>;
    deleteListPrice:() => Promise<Response>;
    
};

export interface CartContextType {
    cart: ProductInCart[];
    totalPrice: number;
    addToCart: (product: Products, quantity: number) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
}

export interface OrderContextType {
    // order: Orders | null;
    addProductsToOrder: (user: Users, cart:ProductInCart[], totalPrice:number, address:Address, shipping:Shipping) => void;
    sendOrder: (order: Orders, navigate: NavigateFunction) =>  Promise<Response>;
    updateOrderState: (orderId:number, newState:string) => Promise<Response>;
    updateNew: (orderId:number) => Promise<Response>;
    deleteOrder: (orderId:number) => Promise<Response>;
}










