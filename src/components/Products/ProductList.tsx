import { Link, useParams } from "react-router-dom";
import { useApi } from "../../context/ApiProvider"
import ProductCard from "./ProductCard";
import './products.css'
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProductList = () => {

    const { products, categories } = useApi();
    const { category } = useParams<{ category?: string }>();
    const navigate = useNavigate();

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

    return (
        <div className="cont container prod-list">
            <div className="title-page">
                <h1>{category ? `${category}` : 'PRODUCTOS'}</h1>
                <span className="line"></span>
            </div>
            {!category && (
                <div className="container">
                    <ul className="row row-cols-1 row-cols-sm-2 row-cols-md-7 ul-row-nopadding">
                        {categories.map((cat) => (
                            <li key={cat} className="categories">
                                <Link to={`/productos/categoria/${cat}`}>{cat}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <span className="route"><Link to={'/productos'}>/todos los productos</Link></span>
            <div className="container">
                <ul className="prod-list-cont">
                    {productFilter.map((product) => (
                        <li key={product.id} className="prod-list-li">
                            <Link to={`/productos/id/${product.id}`} className="h100 w100" onClick={() => handleProductClick(product.id)}>
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                />
                            </Link>
                        </li>

                    ))}
                </ul>
            </div>
        </div>
    )
}

export default ProductList
