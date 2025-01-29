import React, { useState } from 'react';
import { Products } from '../../Interfaces/interfaces';
import { useUser } from "../../context/UserContext";
import useCurrencyFormat from "../../CustomHooks/currencyFormat";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { useApi } from '../../context/ApiProvider';

interface ProductCardProps {
    product: Products;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {

    const { isLogin } = useUser();
    const { dev } = useApi();
    const formatCurrency = useCurrencyFormat();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handleMouseEnter = () => {
        if (product.img_url.length > 1) {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.img_url.length);
        }
    };

    const handleMouseLeave = () => {
        setCurrentImageIndex(0);
    };

    return (
        <div className='prod-card-cont position-relative d-flex flex-column justify-content-end h100 w100'
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}>
            <div className='img-cont'>
                <LazyLoadImage
                    className="prod-card-img"
                    src={`${dev}${product.img_url[currentImageIndex]?.url}`}
                    alt={product.name}
                />
            </div>
            <div className='prod-card-description'>
                <span>
                    <h4 className='text-uppercase'>{product.name}.</h4>
                    <h5>{product.id}</h5>
                </span>
                {isLogin ? <p>{formatCurrency(product.price)}</p> : <></>}
            </div>
            {product.novelty ? <span className='novelty-mark'>Novedad</span> : <></>}
        </div>
    );
};

export default ProductCard;