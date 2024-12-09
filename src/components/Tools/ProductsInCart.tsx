
import { useApi } from "../../context/ApiProvider";
import { useCart } from "../../context/CartProvider";
import QuantitySelector from "./QuantitySelector";
import useCurrencyFormat from "../CustomHooks/currencyFormat";
import { useUser } from "../../context/UserContext";


const ProductsInCart = () => {

  const { isLogin } = useUser();
  const { dev, prod } = useApi();
  const { cart, updateQuantity, removeFromCart, totalPrice } = useCart();
  const formatCurrency = useCurrencyFormat();

  const handleRemoveFromCart = (productId: string) => {
    removeFromCart(productId)
  }

  return (
    <>
      <ul>
        {cart.map((item) => {
          const totalForProduct = item.quantity * item.product.price;

          return (
            <li key={item.product.id}>
              <img src={`${dev}${item.product.img_url[0].url}`} alt={item.product.name} />
              <h3>{item.product.name}</h3>
              {isLogin && <p>Precio unitario: {formatCurrency(item.product.price)}</p>}
              
              <QuantitySelector
                productId={item.product.id}
                quantity={item.quantity}
                onQuantityChange={(newQuantity) =>
                  updateQuantity(item.product.id, newQuantity)
                }
              />
              {isLogin &&  <p>Total: {formatCurrency(totalForProduct)}</p>}           
              <button onClick={() => handleRemoveFromCart(item.product.id)}>
                Eliminar
              </button>
            </li>
          );
        })}
      </ul>
      {isLogin && <h2>Total del carrito: {formatCurrency(totalPrice)}</h2>}
      
    </>
  );
}

export default ProductsInCart
