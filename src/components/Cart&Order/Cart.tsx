
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartProvider";
import ProductsInCart from "../Tools/ProductsInCart";
import useCurrencyFormat from "../../CustomHooks/useCurrencyFormat";
import { useUser } from "../../context/UserContext";

const Cart = () => {

  const { isLogin } = useUser();
  const { totalPrice, cart } = useCart();
  const formatCurrency = useCurrencyFormat();
  const isCartEmpty = cart.length === 0;

  return (
    <div className="cont container">
      <div className="cart-container">
        <div className="row justify-content-evenly">
          <div className="col-lg-7 cart-prod-list">
            <div className="title-page">
              <h4> Mi Carrito</h4><span className="line"></span>
              <Link to="#" onClick={(e) => {
                e.preventDefault();
                window.history.back();
              }}>
                Seguir navegando →
              </Link>
            </div>
            <ProductsInCart price='total' editable={true}></ProductsInCart>
          </div>
          <div className="col-lg-4 cart-info">
            <div className="cart-info-container">
              <span className="back"></span>
              <div className="title-page">
                <h4>Resumen del pedido</h4><span className="line"></span>
              </div>
              <div className="cart-total">
                {isLogin && !isCartEmpty? (
                  <>
                    <span className="d-flex align-items-baseline gap-2">
                    <h6>Subtotal:</h6><h5>{formatCurrency(totalPrice)}</h5>
                    </span>                    
                    <p className="small">IVA incluido</p>
                  </>
                ) : null}
              </div>
              <Link to={isCartEmpty ? "#" : "/checkout"}>
                <button className="general-button" disabled={isCartEmpty}>
                  Realizar orden de compra
                </button>
              </Link>
              {isCartEmpty && <p className="empty-cart-warning">Agrega productos para continuar con la compra.</p>}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Cart
