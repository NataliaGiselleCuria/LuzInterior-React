import ItemBanner from "./ItemBanner"
import AdminGallery from "./ItemGallery"

const AdminImages = () => {
    return (
        <div>
            <h3>Galería de Imágenes / Imagenes de banner</h3>
            <div className="accordion" id="accordionPanelsStayOpenExample">
                <div id="gallery" className="accordion-item">
                    <h2 className="accordion-header">
                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="false" aria-controls="panelsStayOpen-collapseOne">
                            Galería
                        </button>
                    </h2>
                    <div id="panelsStayOpen-collapseOne" className="accordion-collapse collapse">
                        <div className="accordion-body">
                            <AdminGallery></AdminGallery>
                        </div>
                    </div>
                </div>
                <div id="prods-list-price" className="accordion-item">
                    <h2 className="accordion-header">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseFour" aria-expanded="false" aria-controls="panelsStayOpen-collapseFour">
                           Banner home
                        </button>
                    </h2>
                    <div id="panelsStayOpen-collapseFour" className="accordion-collapse collapse">
                        <div className="accordion-body">
                            <ItemBanner></ItemBanner>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default AdminImages