import { LazyLoadImage } from "react-lazy-load-image-component";
import { useApi } from "../../context/ApiProvider";


const Gallery = () => {
  const { dev, gallery } = useApi();

  return (
    <div className="cont container">
      <h1>Galería</h1>
      <div>
        {gallery
          .sort((a, b) => a.priority - b.priority) // Ordena por prioridad (puedes ajustar según cómo esté definida la prioridad)
          .map((item) => (
            <LazyLoadImage
              key={item.id}
              src={`${dev}/${item.img_url}`}
              alt={`Imagen de la galeria ${item.id}`}
            />
          ))}
      </div>

    </div>
  )
}

export default Gallery
