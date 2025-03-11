
import { useApi } from "../../context/ApiProvider";
import { useCart } from "../../context/CartProvider";
import { useUser } from "../../context/UserContext";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import QuantitySelector from "./QuantitySelector";
import useCurrencyFormat from "../../CustomHooks/useCurrencyFormat";
import trash from "../../assets/trash.png"
import 'react-lazy-load-image-component/src/effects/blur.css';

interface Props {
  price: string;
  editable: boolean;
}

const ProductsInCart = ({ editable }: Props) => {

  const { isLogin } = useUser();
  const { dev } = useApi();
  const { cart, updateQuantity, removeFromCart } = useCart();
  const formatCurrency = useCurrencyFormat();

  const handleRemoveFromCart = (productId: string) => {
    removeFromCart(productId)
  }

  return (
    <ul className="ul-cart">
      {cart.length === 0 ? (
        <div className="empty-cart-message">
          <p>Tu carrito está vacío.</p>
        </div>
      ) : (
        cart.map((item) => {
          const totalForProduct = item.quantity * item.product.price;

          return (
            <li key={item.product.id}>
              <div className="ul-cart-img">
                <LazyLoadImage src={`${dev}${item.product.img_url[0].url}`} alt={item.product.name} effect='blur'/>
              </div>
              <div className="cart-prod-info">
                <span className="prod-info">
                  <span className="prod-name">
                    <h5>{item.product.name}. {item.product.id}</h5>
                  </span>
                  <span className="prod-cant small">Cant: {item.quantity}</span>
                  {isLogin ?(<p className="sub-total">{formatCurrency(item.product.price)}</p>): <p>$ ---</p> }
                </span>
                {editable && (
                  <QuantitySelector
                    productId={item.product.id}
                    quantity={item.quantity}
                    onQuantityChange={(newQuantity) =>
                      updateQuantity(item.product.id, newQuantity)
                    }
                  />
                )}
                {isLogin && (
                  <span className="total d-flex">
                    <p>Total:</p>
                    <p>{formatCurrency(totalForProduct)}</p>
                  </span>
                )}
              </div>
              {editable && (
                <button className="delete" onClick={() => handleRemoveFromCart(item.product.id)}>
                  <img src={trash} alt="eliminar producto"></img>
                </button>
              )}
            </li>
          );
        })
      )}
    </ul>
  );
}

export default ProductsInCart
