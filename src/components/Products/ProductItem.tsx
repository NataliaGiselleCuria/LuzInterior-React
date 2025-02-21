import { useParams, useNavigate, Link } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { useApi } from "../../context/ApiProvider";
import { useCart } from "../../context/CartProvider";
import { useEffect, useState } from "react";
import useCurrencyFormat from "../../CustomHooks/currencyFormat";
import QuantitySelector from "../Tools/QuantitySelector";
import ProductsImages from "../Tools/ProductsImages";
import './products.css'


interface ProductItemProps {
    openCart: () => void;
}

const ProductItem: React.FC<ProductItemProps> = ({ openCart }) => {

    const { products, faq } = useApi();
    const { isLogin } = useUser();
    const { addToCart } = useCart();
    const formatCurrency = useCurrencyFormat();
    const [quantityToAdd, setQuantityToAdd] = useState(1);

    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [showMessage, setShowMessage] = useState(!isLogin);

    useEffect(() => {
        if (!isLogin) {
            const timer = setTimeout(() => {
                setShowMessage(false);
            }, 10000); // 10 segundos

            return () => clearTimeout(timer);
        }
    }, [isLogin]);

    useEffect(() => {
        if (products.length) {
            setLoading(false);
        }
    }, [products]);

    if (loading) {
        return <div>Loading...</div>;
    }

    const productItem = products.find((product) => product.id === id);

    if (!productItem) {
        navigate('/error', { state: { message: 'Producto no encontrado' } });
        return null;
    }

    const handleQuantityChange = (newQuantity: number) => {
        setQuantityToAdd(newQuantity);
    };

    const handleAddToCart = () => {
        addToCart(productItem, quantityToAdd);
        openCart();
    };

    return (
        <div className="cont container prod-item">
            {showMessage && (
                <div className={`login-message ${showMessage ? "show" : "hide"}`}><span><Link to='/login'>Inicie sesión</Link><span> para acceder a los precios de los productos.</span></span></div>
            )}
            <span className="route"><span><Link to='/'>Inicio</Link><Link to='/productos'>/ Todos los productos</Link><Link to={`/productos/categoria/${productItem.category}`}>/ {productItem.category}</Link><span className="current-route">/ {productItem.name}.{productItem.id}</span></span></span>
            <div className="prod-item-cont container">
                <div className="row justify-content-between">
                    <div className="prod-item-img col-md-6">
                        <ProductsImages images={productItem.img_url} />
                    </div>
                    <div className="prod-item-info col-md-5">
                        <div className="prod-item-info-con">
                            <span className="back"></span>
                            <div className='prod-card-description'>
                                <span className="prod-name">
                                    <h4>{productItem.name}</h4>
                                    <h5>{productItem.id}</h5>
                                </span>
                                <span>
                                    {isLogin ? <p className="fs-4">{formatCurrency(productItem.price)}</p> : <></>}
                                    <p className="small">IVA incluido</p>
                                </span>

                            </div>
                            <div className="prod-card-characteristics">
                                <h5>Caracteristicas:</h5>
                                <div dangerouslySetInnerHTML={{ __html: productItem.description }} />
                            </div>
                            <div className="product-actions">
                                <QuantitySelector productId={productItem.id} quantity={quantityToAdd} onQuantityChange={handleQuantityChange} />
                                <button className='general-button' onClick={handleAddToCart}>Agregar al carrito</button>
                                {/* <button className='light-button' onClick={handleBuyNow}>Realizar compra</button> */}
                            </div>

                        </div>
                        <div className="frequently-asked-questions">
                            <div className="accordion" id="accordionPanelsStayOpenExample">
                                <div className="accordion-item">
                                    <h5 className="accordion-header">
                                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="false" aria-controls="panelsStayOpen-collapseOne">
                                            Preguntas frecuentes
                                        </button>
                                    </h5>
                                    <div id="panelsStayOpen-collapseOne" className="accordion-collapse collapse">
                                        <div className="accordion-body">
                                            <ul className="list-acordeon">
                                                {faq.map((item) => (
                                                    <li key={item.id}>
                                                        <h6 dangerouslySetInnerHTML={{ __html: item.question }}></h6>
                                                        <p dangerouslySetInnerHTML={{ __html: item.answer }}></p>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          
        </div>
    )
}

export default ProductItem
