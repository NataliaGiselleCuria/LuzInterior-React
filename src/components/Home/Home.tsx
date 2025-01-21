import { Link } from 'react-router-dom';
import { useApi } from '../../context/ApiProvider';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './home.css';
import ProductCard from '../Products/ProductCard';

const Home = () => {
  const { categories, products } = useApi();

  return (
    <div className="cont container">
      {/* <h1>Luz Interior | Fábrica de luminaria de diseño.</h1> */}
      <div className='banner-wholesalers'>
        <span className='line'></span>
        <span>
          <p>Acceso para clientes</p>
          <h3>MAYORISTAS</h3>
        </span>
        <span className='line'></span>
      </div>
      <div id="carousel-home" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          {categories.map((category, index) => (
            <Link to={`/productos/categoria/${category}`} className={`carousel-item ${index === 0 ? 'active' : ''}`} key={category}>
              <picture>
                {/* Imagen para pantallas grandes */}
                <source
                  media="(min-width: 768px)"
                  srcSet={`../src/assets/home-img/${category.replace(/\s+/g, '-').toLowerCase()}-desktop.png`}
                />
                {/* Imagen para pantallas pequeñas */}
                <LazyLoadImage
                  className="d-block w-100"
                  src={`../src/assets/home-img/${category.replace(/\s+/g, '-').toLowerCase()}-mobile.png`}
                  alt={category}
                />
              </picture>
              {/* <div className="carousel-caption d-none d-md-block">
                <button className="general-button">
                  <a href={`/productos/categoria/${category}`}                    
                    className="text-white text-decoration-none h100 w100">
                    Ver productos
                  </a>
                </button>
              </div> */}
            </Link>
          ))}
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carousel-home"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carousel-home"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
        <div className="text-center mt-3">
        </div>
      </div>
      <div className='latest-releases'>
        <div className="title-page">
          <h1>Ultimos lanzamientos</h1>
          <span className='line'></span>
        </div>
        <div>
          <ul className="latest-releases-cont">
            {products.filter((product) => product.novelty).map((product) => (
              <li key={product.id} className='latest-releases-list'>
                <ProductCard
                  product={product}>
                </ProductCard>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Home
