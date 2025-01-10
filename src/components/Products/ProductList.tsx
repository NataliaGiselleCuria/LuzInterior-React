import { Link, useParams } from "react-router-dom";
import { useApi } from "../../context/ApiProvider"
import { useUser } from "../../context/UserContext";
import useCurrencyFormat from "../CustomHooks/currencyFormat";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import './products.css'

const ProductList = () => {

    const { isLogin } = useUser();
    const { products, categories, dev } = useApi();
    const { category } = useParams<{ category?: string }>();
    const formatCurrency = useCurrencyFormat();

    const productFilter = category
        ? products.filter((product) => product.category === category)
        : products;

    return (
        <div className="cont container">
            <h2>{category ? `${category}` : 'Todos los Productos'}</h2>
            {!category && (
                <div>
                    <h3>Categorías</h3>
                    <ul>
                        {categories.map((cat) => (
                            <li key={cat}>
                                <Link to={`/productos/categoria/${cat}`}>{cat}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <div>
                <Link to={'/productos'}>/todos los productos</Link>
                <ul>
                    {productFilter.map((product) => (
                    
                        <li key={product.id}>
                            <Link to={`/productos/id/${product.id}`}>
                                <LazyLoadImage  className='prod-img' src={`${dev}${product.img_url[0]?.url}`} alt={product.name} />
                                <h3>{product.name}</h3>
                                <h4>{product.id}</h4>
                                {isLogin && <p>Precio: {formatCurrency(product.price)}</p>}
                            </Link>
                        </li>
                    
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default ProductList
