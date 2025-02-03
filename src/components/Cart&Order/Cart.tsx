
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartProvider";
import ProductsInCart from "../Tools/ProductsInCart";

const Cart = () => {

  const { totalPrice } = useCart();

  return (
    <div className="cont container">
      <div className="title-page">
        <h2> Mi Carrito</h2><span className="line"></span>
      </div>

      <div className="cart-container container">
        <div className="row col-md-7">
          <ProductsInCart price='total' editable={true}></ProductsInCart>
        </div>
        <div className="row col-md-5">
          <h4>Resumen de pedido</h4>
          <p>Subtotal: ${totalPrice}</p>
          <p className="small">Impuestos incluidos</p>
          <Link to='/checkout'><button className="light-button">Realizar orden de compra</button></Link>
        </div>
      </div>
    </div>
  )
}

export default Cart
