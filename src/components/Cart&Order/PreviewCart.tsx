
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ProductsInCart from '../Tools/ProductsInCart';
import { useCart } from '../../context/CartProvider';
import { useUser } from '../../context/UserContext';
import useCurrencyFormat from '../../CustomHooks/currencyFormat';
import './cart.css'

interface PreviewCartProps {
  cartOpen: boolean;
  onClose: () => void;
}

const PreviewCart: React.FC<PreviewCartProps> = ({ cartOpen, onClose }) => {

  const { isLogin } = useUser();
  const { cart, totalPrice } = useCart();
  const formatCurrency = useCurrencyFormat();
  const [isVisible, setIsVisible] = useState(cartOpen);

  const calculateTotalQuantity = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  useEffect(() => {
    if (cartOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 500);
      return () => clearTimeout(timer);
    }

  }, [cartOpen]);

  return (
    <div id="preview-cart" className={`${cartOpen ? "show" : "hide"} ${isVisible ? "visible" : "hidden"}`} onClick={onClose}>
      <div className="prev-cart-content" onClick={(e) => e.stopPropagation()}>
        <span className="prod-name cart-title"><h4>carrito.</h4><p>{calculateTotalQuantity()} productos</p></span>
        <ProductsInCart price='total' editable={true}></ProductsInCart>
        <div className="cart-total">
        {isLogin ? (
          <>
            <h6>Subtotal:</h6>
            <h5>{formatCurrency(totalPrice)}</h5>
            <p className="small">IVA incluido</p>
          </>
        ) : null}
      </div>
        <Link to='/carrito' onClick={onClose}><button className='light-button'>Ver carrito</button></Link>
      </div>
    </div>

  )
}

export default PreviewCart
