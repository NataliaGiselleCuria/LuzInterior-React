import { useApi } from "../../context/ApiProvider"
import priceList from '../../../src/assets/price_list.png'
import { LazyLoadImage } from "react-lazy-load-image-component";

const ListaDePrecios = () => {

  const { listPrice, fileUrl } = useApi();

  return (
    <div className="cont container">
      <h2>Lista de precios</h2>
      <div>

        {listPrice[0] ? (
          <>
            <span>
              <p>Ultima actualización:</p>
              <p>{new Date(new Date(listPrice[0].date + "T00:00:00")).toLocaleDateString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })}</p>
            </span>
            {fileUrl ? (
              <span>
                <LazyLoadImage src={priceList} alt="lista de precios"></LazyLoadImage>
                <button><a href={fileUrl} download>Descargar lista de precios</a></button>
              </span>
              
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
