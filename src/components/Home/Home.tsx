import { Link } from 'react-router-dom';
import { useApi } from '../../context/ApiProvider';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './home.css';
import ProductCard from '../Products/ProductCard';
import { useEffect, useState } from 'react';

interface HomeProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const Home: React.FC<HomeProps> = () => {
  const { categories, products, } = useApi();
  const [loading, setLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    const loadImages = () => {
      const images = document.querySelectorAll("img");
      const promises = Array.from(images).map(
        (img) =>
          new Promise((resolve) => {
            if (img.complete) {
              resolve(true);
            } else {
              img.onload = () => resolve(true);
              img.onerror = () => resolve(false); 
            }
          })
      );
      Promise.all(promises).then(() => setImagesLoaded(true));
    };

    loadImages();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (imagesLoaded) {
        setLoading(false);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [imagesLoaded]);

  if (loading) {
    return <div className='loading'>Loading...</div>;
  }

  return (
    <div className="cont container">
          <h1 className='d-none'>Luz Interior | Fábrica de luminaria de diseño.</h1>
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
                    <Link to={`/productos/id/${product.id}`} className="h100 w100">
                      <ProductCard
                        product={product}>
                      </ProductCard>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
   
    </div>
  )
}

export default Home
