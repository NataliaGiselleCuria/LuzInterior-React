import ItemBanner from "./ItemBanner"
import AdminGallery from "./ItemGallery"

const AdminImages = () => {
    return (
        <div className="w-100">
             <div className="title-page">
                <h4>Imágenes</h4>
            </div>
            <div className="accordion images" id="accordionPanelsStayOpenExample">
                <div id="gallery" className="accordion-item">
                    <div className="accordion-header">
                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="false" aria-controls="panelsStayOpen-collapseOne">
                            <h6>Imagenes de la Galería</h6>
                        </button>
                    </div>
                    <div id="panelsStayOpen-collapseOne" className="accordion-collapse collapse">
                        <div className="accordion-body">
                            <AdminGallery></AdminGallery>
                        </div>
                    </div>
                </div>
                <div id="prods-list-price" className="accordion-item">
                    <div className="accordion-header">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseFour" aria-expanded="false" aria-controls="panelsStayOpen-collapseFour">
                        <h6>Imágenes del Banner-home</h6>  
                        </button>
                    </div>
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