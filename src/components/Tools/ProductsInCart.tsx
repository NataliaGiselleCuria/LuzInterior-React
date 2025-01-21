
import { useApi } from "../../context/ApiProvider";
import { useCart } from "../../context/CartProvider";
import { useUser } from "../../context/UserContext";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import QuantitySelector from "./QuantitySelector";
import useCurrencyFormat from "../../CustomHooks/currencyFormat";
import 'react-lazy-load-image-component/src/effects/blur.css';

interface Props {
  price: string;
  editable: boolean;
}

const ProductsInCart = ({ price, editable }: Props) => {

  const { isLogin } = useUser();
  const { dev } = useApi();
  const { cart, updateQuantity, removeFromCart, totalPrice } = useCart();
  const formatCurrency = useCurrencyFormat();

  const handleRemoveFromCart = (productId: string) => {
    removeFromCart(productId)
  }

  return (
    <>
      <ul className="ul-column-nopadding">
        {cart.map((item) => {
          const totalForProduct = item.quantity * item.product.price;

          return (
            <li key={item.product.id}>
              <LazyLoadImage src={`${dev}${item.product.img_url[0].url}`} alt={item.product.name} />
              <h3>{item.product.name}</h3>
              {isLogin && <p>Precio unitario: {formatCurrency(item.product.price)}</p>}
              {editable &&
                <QuantitySelector
                  productId={item.product.id}
                  quantity={item.quantity}
                  onQuantityChange={(newQuantity) =>
                    updateQuantity(item.product.id, newQuantity)
                  }
                />
              }
              {isLogin && <p>Total: {formatCurrency(totalForProduct)}</p>}
              {editable &&
                <button onClick={() => handleRemoveFromCart(item.product.id)}>
                  Eliminar
                </button>
              }
            </li>
          );
        })}
      </ul>
      {isLogin ? (
        price === 'total' ? (
          <h2>Total del carrito: {formatCurrency(totalPrice)}</h2>
        ) : price === 'subtotal' ? (
          <h2>Subtotal: {formatCurrency(totalPrice)}</h2>
        ) : null
      ) : null}


    </>
  );
}

export default ProductsInCart
