import { Link } from 'react-router-dom';
import { useApi } from '../../context/ApiProvider';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import ProductCard from '../Products/ProductCard';
import { useEffect, useState } from 'react';
import Carousel from '../Tools/Carousel';
import './home.css';


interface HomeProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const Home: React.FC<HomeProps> = () => {
  const { products } = useApi();
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
      <Carousel type={'desktop'}></Carousel>
      <Carousel type={'mobile'}></Carousel>
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
