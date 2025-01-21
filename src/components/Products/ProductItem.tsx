import { useParams, useNavigate, Link } from "react-router-dom";
import { useApi } from "../../context/ApiProvider";
import { useCart } from "../../context/CartProvider";
import { useState } from "react";
import ProductCard from "./ProductCard";
import QuantitySelector from "../Tools/QuantitySelector";
import './products.css'

interface ProductItemProps {
    openCart: () => void;
}

const ProductItem: React.FC<ProductItemProps> = ({ openCart }) => {

    const { products } = useApi();
    const { addToCart } = useCart();
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
        <div className="cont container">
            <span className="route"><Link to='/'>Inicio</Link>/<Link to='/productos'>Todos los productos</Link>/<Link to={`/productos/categoria/${productItem.category}`}>{productItem.category}</Link>/<span>{productItem.name}</span></span>
            <h2> {productItem.id}</h2>
            <div>
                <ProductCard
                    key={productItem.id}
                    product={productItem}
                />
            </div>
            <QuantitySelector productId={productItem.id} quantity={quantityToAdd} onQuantityChange={handleQuantityChange} />
            <button onClick={handleAddToCart}>Agregar al carrito</button>
            <button onClick={handleBuyNow}>Realizar compra</button>
        </div>
    )
}

export default ProductItem
