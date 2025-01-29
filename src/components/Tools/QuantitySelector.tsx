
import React from "react";
import { useCart } from "../../context/CartProvider";


interface QuantitySelectorProps {
    quantity: number;
    onQuantityChange: (newQuantity: number) => void;
    productId: string
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({ quantity, onQuantityChange, productId }) => {

    const { cart } = useCart();
    const productItem = cart.find((item) => item.product.id === productId);

    const initialQuantity = productItem ? productItem.quantity : 1;

    const [currentQuantity, setCurrentQuantity] = React.useState(quantity || initialQuantity);

    const handleIncrement = () => {
        const newQuantity = currentQuantity + 1;
        setCurrentQuantity(newQuantity);
        onQuantityChange(newQuantity);
    };

    const handleDecrement = () => {
        if (currentQuantity > 1) {
            const newQuantity = currentQuantity - 1;
            setCurrentQuantity(newQuantity);
            onQuantityChange(newQuantity);
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newQuantity = parseInt(event.target.value, 10);
        if (!isNaN(newQuantity) && newQuantity > 0) {
            setCurrentQuantity(newQuantity);
            onQuantityChange(newQuantity);
        }
    };


    return (
        <div className="quantity-selector">
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