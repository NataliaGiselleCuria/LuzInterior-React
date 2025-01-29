import { useEffect, useState } from "react";
import { useApi } from "../../context/ApiProvider";
import { LazyLoadImage } from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/blur.css';
import './tools.css'

interface Image {
    id_img: string;
    url: File;
    priority: number;
}

interface Props {
    images: Image[];
}

const ProductsImages: React.FC<Props> = ({ images }) => {
    const {dev} = useApi();
    const [mainImage, setMainImage] = useState<Image>(images[0]);

    useEffect(() => {
        if (images.length > 0) {
            setMainImage(images[0]);
        }
    }, [images]);

    const handleThumbnailClick = (image: Image) => {
        setMainImage(image);
    };

    return (
        <div className="image-gallery h100">
            {/* Imagen principal */}
            <div className="main-image img-cont">
                <LazyLoadImage src={`${dev}${mainImage.url}`} alt="Producto principal" />
            </div>

            {/* Miniaturas */}
            <div className="thumbnail-container">
                {images.map((image, index) => (
                    <div className={`thumbnail ${image === mainImage ? "active" : ""} thumbnail-img-cont` }
                        onClick={() => handleThumbnailClick(image)}
                        key={image.id_img}>
                        <LazyLoadImage 
                            key={image.id_img}                          
                            src={`${dev}${image.url}`}
                            alt={`Vista ${index + 1}`}                           
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductsImages;