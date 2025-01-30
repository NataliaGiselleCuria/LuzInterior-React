import { useApi } from '../../context/ApiProvider';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { Link } from 'react-router-dom';

interface CarouselProps {
    type: string;
}

const Carousel : React.FC<CarouselProps> = ({type })  => {
    const { dev, bannerDesktop, bannerMobile } = useApi();
    const images = type ==='desktop'? bannerDesktop : bannerMobile;

    return (
        <div id={`carousel-home-${type}`} className={`carousel slide ${type}`} data-bs-ride="carousel">
            <div className="carousel-inner">
                {images.map((img, i) => (
                    <div className={`carousel-item ${i === 0 ? "active" : ""}`} key={img.id}>
                        {img.link? (
                            <Link to={img.link}>
                                <LazyLoadImage
                                className="d-block w-100"
                                src={dev + img.img_url}
                                alt={`Banner Mobile ${img.priority}`}
                                />
                            </Link>
                        ):(
                            <LazyLoadImage
                            className="d-block w-100"
                            src={dev + img.img_url}
                            alt={`Banner Mobile ${img.priority}`}
                            />
                        )}
                       
                    </div>
                ))}
            </div>
            <button
                className="carousel-control-prev"
                type="button"
                data-bs-target={`#carousel-home-${type}`}
                data-bs-slide="prev"
            >
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
            </button>
            <button
                className="carousel-control-next"
                type="button"
                data-bs-target={`#carousel-home-${type}`}
                data-bs-slide="next"
            >
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
            </button>
            <div className="text-center mt-3">
            </div>
        </div>
    )
}

export default Carousel
