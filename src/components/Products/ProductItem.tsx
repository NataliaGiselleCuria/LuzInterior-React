import { useParams, useNavigate, Link } from "react-router-dom";
import { useApi } from "../../context/ApiProvider";
import QuantitySelector from "../Tools/QuantitySelector";
import { useCart } from "../../context/CartProvider";
import { useState } from "react";
import { useUser } from "../../context/UserContext";
import useCurrencyFormat from "../CustomHooks/currencyFormat";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

interface ProductItemProps {
    openCart: () => void;
}

const ProductItem: React.FC < ProductItemProps > = ({ openCart }) => {

    const { isLogin } = useUser();
    const { products, dev, prod } = useApi();
    const { addToCart} = useCart();

    const formatCurrency = useCurrencyFormat();
    const [quantityToAdd, setQuantityToAdd] = useState(1);

    const { id } = useParams<{ id: string }>();
    const productItem = products.find((product) => product.id === id);
    
    const navigate = useNavigate();
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

    const handleBuyNow = () => {
        addToCart(productItem, quantityToAdd);
        navigate('/carrito');
    }

    return (
        <div>
            <p><Link to='/'>Inicio</Link>/<Link to={`/productos/categoria/${productItem.category}`}>{productItem.category}</Link>/<span>{productItem.name}</span></p>
            <h2> { productItem.id }</h2>
            <div>
            <LazyLoadImage src={`${dev}${productItem.img_url[0].url}`} alt={productItem.name} />
                <h3>{productItem.name}</h3>
                <h4>{productItem.id}</h4>
                {isLogin && <p>Precio: {formatCurrency(productItem.price)}</p>}
            </div>
            <QuantitySelector productId={productItem.id} quantity={quantityToAdd} onQuantityChange={handleQuantityChange} />
            <button onClick={handleAddToCart}>Agregar al carrito</button>
            <button onClick={handleBuyNow}>Realizar compra</button>
        </div>
    )
}

export default ProductItem
