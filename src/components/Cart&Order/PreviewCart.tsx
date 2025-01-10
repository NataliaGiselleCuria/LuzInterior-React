
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ProductsInCart from '../Tools/ProductsInCart';
import './cart.css'

interface PreviewCartProps {
  cartOpen: boolean;
  onClose: () => void;
}

const PreviewCart: React.FC < PreviewCartProps > = ({ cartOpen, onClose }) => {

  const [isVisible, setIsVisible] = useState(cartOpen);

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
        <h2>carrito</h2> 
        <ProductsInCart price='total' editable={true}></ProductsInCart>
        <Link to='/carrito'onClick={onClose}>Ver carrito</Link>
      </div>
      
    </div>
   
  )
}

export default PreviewCart
