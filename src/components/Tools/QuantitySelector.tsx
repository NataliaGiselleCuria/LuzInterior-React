
import { useCart } from "../../context/CartProvider";


interface QuantitySelectorProps {
    quantity: number;
    onQuantityChange: (newQuantity: number) => void;
    productId: string
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({ quantity, onQuantityChange, productId }) => {

    const { cart } = useCart();

    const productItem = cart.find((item) => item.product.id === productId);
    const currentQuantity = productItem ? productItem.quantity : 1;
    

    const handleIncrement = () => {
        const newQuantity = quantity + 1;
        onQuantityChange(newQuantity);
    };

    const handleDecrement = () => {
        if (currentQuantity  > 1) {
            const newQuantity = quantity - 1;
            onQuantityChange(newQuantity);
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newQuantity = parseInt(event.target.value, 10);
        if (!isNaN(newQuantity) && newQuantity > 0) {
            onQuantityChange(newQuantity);
        }
    };

    return (
        <div>
            <button onClick={handleDecrement}>-</button>
            <input
                type="number"
                value={quantity === 0 ? 1 : quantity}
                onChange={handleChange}
                min="1"
            />
            <button onClick={handleIncrement}>+</button>
        </div>
    );
};

export default QuantitySelector;