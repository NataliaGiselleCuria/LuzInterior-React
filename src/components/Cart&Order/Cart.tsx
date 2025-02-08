
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartProvider";
import ProductsInCart from "../Tools/ProductsInCart";
import useCurrencyFormat from "../../CustomHooks/currencyFormat";
import { useUser } from "../../context/UserContext";

const Cart = () => {

  const { isLogin } = useUser();
  const { totalPrice } = useCart();
  const formatCurrency = useCurrencyFormat();

  return (
    <div className="cont container">
      <div className="cart-container container">
        <div className="row justify-content-evenly">
          <div className="col-lg-6 cart-prod-list">
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
              <div className="title-page">
                <h4>Resumen del pedido</h4><span className="line"></span>
              </div>
              <div className="cart-total">
                {isLogin ? (
                  <>
                    <span className="d-flex align-items-center gap-2">
                    <h6>Subtotal:</h6><h5>{formatCurrency(totalPrice)}</h5>
                    </span>                    
                    <p className="small">IVA incluido</p>
                  </>
                ) : null}
              </div>
              <Link to='/checkout'><button className="general-button">Realizar orden de compra</button></Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Cart
