import { Link, useParams, useNavigate } from "react-router-dom";
import { useApi } from "../../context/ApiProvider"
import ProductCard from "./ProductCard";
import { useEffect, useState } from "react";
import { useUser } from "../../context/UserContext";
import { useCart } from "../../context/CartProvider";
import { Products } from "../../Interfaces/interfaces";
import add from "../../assets/add.png";
import 'react-lazy-load-image-component/src/effects/blur.css';
import './products.css'

interface ProductListProps {
    openCart: () => void;
}

const ProductList:  React.FC<ProductListProps> = ({ openCart }) =>{
    const { addToCart } =useCart();
    const { products, categories } = useApi();
    const { isLogin} = useUser();
    const { category } = useParams<{ category?: string }>();
    const navigate = useNavigate();
     const [showMessage, setShowMessage] = useState(!isLogin);
    
        useEffect(() => {
            if (!isLogin) {
                const timer = setTimeout(() => {
                    setShowMessage(false);
                }, 10000); // 10 segundos
    
                return () => clearTimeout(timer);
            }
        }, [isLogin]);

    const productFilter = category
        ? products.filter((product) => product.category === category)
        : products;

    useEffect(() => {
        const savedScrollPosition = sessionStorage.getItem("scrollPosition");
        if (savedScrollPosition) {
            window.scrollTo(0, parseInt(savedScrollPosition, 10));
            sessionStorage.removeItem("scrollPosition"); 
        }
    }, []);

    const handleProductClick = (productId:string) => {
        sessionStorage.setItem("scrollPosition", String(window.scrollY));
        navigate(`/productos/id/${productId}`);
    };

    const handleAddToCart = (product:Products) => {
        addToCart(product, 1);
        openCart();
    };

    return (
        <div className="cont container prod-list">
            {showMessage && (
                <div className={`login-message ${showMessage ? "show" : "hide"}`}><span><Link to='/login'>Inicie sesión</Link><span> para acceder a los precios de los productos.</span></span></div>
            )}
            <div className="title-page">
                <h1>{category ? `${category}` : 'PRODUCTOS'}</h1>
                <span className="line"></span>
            </div>
            {!category && (
                <div>
                    <ul className=" ul-categories ul-row-nopadding">
                        {categories.map((cat) => (
                            <li key={cat} className="categories ">
                                <Link to={`/productos/categoria/${cat}`}>{cat}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {!category ? (
             <span className="route"><span><Link className="current-route" to={'/productos'}>/ todos los productos</Link></span></span>
            ):(
                <span className="route"><span><Link to={'/productos'}>/ todos los productos</Link><span className="current-route">{`/ ${category}`}</span></span></span>
            )}
           
            <div className="">
                <ul className="prod-list-cont">
                    {productFilter.map((product) => (
                        <li key={product.id} className="prod-list-li  shadow-sm">
                            <Link to={`/productos/id/${product.id}`} className="h100 w100" onClick={() => handleProductClick(product.id)}>
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                />
                            </Link>
                            <button className='item-add' onClick={() => handleAddToCart(product)}><img src={add} alt="agregar al carrito"></img></button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default ProductList
