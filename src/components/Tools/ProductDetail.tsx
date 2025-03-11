import { LazyLoadImage } from "react-lazy-load-image-component";
import useProductById from "../../CustomHooks/useProductById";
import 'react-lazy-load-image-component/src/effects/blur.css';

const ProductDetail = ({ id }: { id: string }) => {
  const { exists, product, imageUrl, message } = useProductById(id);

  if (!exists) {
    return (
      <div>
        <span>
          <p>{message}</p>
        </span>
      </div>
    );
  }

  return (
    <>
    {product &&
        <>
      <div className="order-prod-img">
        <LazyLoadImage src={imageUrl} alt={`Imagen de ${product.name}`} effect='blur'/>
      </div>
      <div className="item-info">
        <div>
          <span className="fw-medium">ID:</span> {product.id}
        </div>
        <div>
          <span className="fw-medium">Nombre:</span> {product.name}
        </div>
        <div>
          <span className="fw-medium">Categoría:</span> {product.category}
        </div>
        <div>
          <span className="fw-medium">Precio:</span> {product.price}
        </div>
      </div>
      </>
    }
    </>
  );
};

export default ProductDetail;