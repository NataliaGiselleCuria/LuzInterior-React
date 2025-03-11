import { LazyLoadImage } from "react-lazy-load-image-component";
import { useApi } from "../../context/ApiProvider";
import FullScreenImage from "../Tools/FullScreenImage";
import { useState } from "react";
import 'react-lazy-load-image-component/src/effects/blur.css';

const Gallery = () => {
  const { dev, gallery } = useApi();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <>
      <div className="cont container">
      <h1 className='hidden'>Luz Interior | Galería de imágenes.</h1>
        <div className="title-page">
          <h2>Galería</h2>
          <span className="line"></span>
        </div>
        <ul className="gallery-ul">
          {gallery
            .sort((a, b) => a.priority - b.priority) // Ordena por prioridad (puedes ajustar según cómo esté definida la prioridad)
            .map((item) => (
              <li key={item.id} onClick={() => setSelectedImage(`${dev}/${item.img_url}`)}>
                <LazyLoadImage
                  key={item.id}
                  src={`${dev}/${item.img_url}`}
                  alt={`Imagen de la galeria ${item.id}`}
                  effect='blur'
                />
              </li>
            ))}
        </ul>

      </div>
      {selectedImage && <FullScreenImage src={selectedImage} onClose={() => setSelectedImage(null)} />}
    </>
  )
}

export default Gallery
