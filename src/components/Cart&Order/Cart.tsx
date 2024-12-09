
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartProvider";
import ProductsInCart from "../Tools/ProductsInCart";

const Cart = () => {

  const { totalPrice } = useCart();
 
  return (
    <div>
      <h2>Carrito</h2>
      <div>
      <ProductsInCart></ProductsInCart>
      </div>
      <p>Total: ${totalPrice}</p>
      <Link to='/checkout'><button>Realizar orden de compra</button></Link>
    </div>
  )
}

export default Cart
