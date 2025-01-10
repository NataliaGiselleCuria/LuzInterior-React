import { useApi } from "../../context/ApiProvider";


const Gallery = () => {
    const { dev, gallery } = useApi();

  return (
    <div>
        <h1>Galería</h1>
        <div>
            {gallery.map((item)=>(
                <img key={item.id} src={`${dev}/${item.img_url}`}></img>
            ))}
        </div>
      
    </div>
  )
}

export default Gallery
