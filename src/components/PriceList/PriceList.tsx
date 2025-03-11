import { useApi } from "../../context/ApiProvider"
import priceList from '../../../src/assets/price_list.png'
import { LazyLoadImage } from "react-lazy-load-image-component";
import 'react-lazy-load-image-component/src/effects/blur.css';

const ListaDePrecios = () => {

  const { listPrice, fileUrl } = useApi();

  return (
    <div className="cont container list-price">
       <div className="title-page">
        <h1>Lista de precios</h1>
        <span className="line"></span>
      </div>
      <div className="list-price-cont">
      <span className="back"></span>
        {listPrice[0] ? (
          <>
            <div>
              <p>Ultima actualización:</p>
              <p>{new Date(new Date(listPrice[0].date + "T00:00:00")).toLocaleDateString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })}</p>
            </div>
            {fileUrl ? (
              <>
              <LazyLoadImage src={priceList} alt="lista de precios" effect='blur'></LazyLoadImage>
              <button className="general-button">              
                <a href={fileUrl} download aria-label="Descargar lista de precios de los productos de Luz Interior">Descargar</a>
              </button>
              </>
            ) : (
              <p>No hay archivos disponibles.</p>
            )}
          </>
        ) : (
          <p>No hay ningun archivo cargado.</p>
        )}

      </div>
    </div>
  )
}

export default ListaDePrecios
