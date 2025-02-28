import { useState } from "react";
import { useApi } from "../../context/ApiProvider"
import { ListPrice, Products } from "../../Interfaces/interfaces";
import { useSearch } from "../../CustomHooks/useSearch";
import AddProductForm from "./AddProductForm";
import ItemListProduct from "./ItemListProduct";
import useVerifyToken from "../../CustomHooks/useVerefyToken";
import useModal from "../../CustomHooks/useModal";
import ModalMesagge from "../Tools/ModalMesagge";
import { useProduct } from "../../context/ProductProvider";
import { useForm } from "react-hook-form";

export const AdminProducts = () => {

    const { products, listPrice, fileUrl, getFile } = useApi();
    const { updateProductPrices, updateListPrice, deleteListPrice } = useProduct();
    const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
    const [percentage, setPercentage] = useState<number>(0)
    const { validateToken } = useVerifyToken();
    const { modalConfig, openModal, closeModal } = useModal();
    const { searchQuery, filteredResults, handleSearchChange } = useSearch(products, true);
    const { register, handleSubmit } = useForm<ListPrice>({});
    const [focusedProductId, setFocusedProductId] = useState<string | null>(null);

    const toggleProductSelection = (id: number) => {
        setSelectedProducts((prev) =>
            prev.includes(id) ? prev.filter((productId) => productId !== id) : [...prev, id]
        );
    };

    const handleIncreasePrices = async (forSelected: boolean) => {

        if (percentage <= 0) {
            openModal("Error", "El porcentaje debe ser mayor que cero.", closeModal);
            return;
        }

        const isTokenValid = await validateToken();
        if (!isTokenValid) {
            return false;
        }

        if (forSelected === true && selectedProducts.length === 0) {
            openModal("Error", "No hay productos seleccionados.", closeModal);
            return;
        }

        try {
            const response = await updateProductPrices(percentage, forSelected ? selectedProducts : []);

            if (response.success) {
                openModal("Éxito", "Los precios se actualizaron correctamente.", closeModal);
                setSelectedProducts([]);
                setPercentage(0)
            } else {
                openModal("Error", `Error al actualizar los precios: ${response.message}`, closeModal);
            }
        } catch (error) {
            openModal("Error", `Error inesperado al actualizar los precios: , ${error}`, closeModal);
        }
    };

    const saveNewListPrice = async (data: ListPrice) => {
        const isTokenValid = await validateToken();
        if (!isTokenValid) {
            return false;
        }

        try {
            if (data.list_price) {
                const response = await updateListPrice(data);
                if (response.success) {
                    openModal("Éxito", "La lista de precios se guardó correctamente.", closeModal);
                    getFile();
                } else {
                    openModal("Error", `Error al actualizar la lista de precios: ${response.message}`, closeModal);
                }
            } else {
                openModal("Error", "No se ha seleccionado un archivo PDF.", closeModal);
            }
        } catch (error) {
            openModal("Error", `Error inesperado al actualizar la lista de precios: , ${error}`, closeModal);
        }

    }

    const handleDeleteListPrice = async () => {
        const isTokenValid = await validateToken();
        if (!isTokenValid) {
            return false;
        }

        try {
            const response = await deleteListPrice();
            if (response.success) {
                openModal("Éxito", "La lista de precios se eliminó correctamente.", closeModal);
                getFile();
            } else {
                openModal("Error", `Error al eliminar la lista de precios: ${response.message}`, closeModal);
            }
        } catch (error) {
            openModal("Error", `Error inesperado al actualizar la lista de precios: , ${error}`, closeModal);
        }
    }

    return (
        <div className="w-100 prods">
            <div className="title-page">
                <h4>Productos</h4>
            </div>
            <div className="accordion" id="accordionPanelsStayOpenExample">
                <div id="prods-list" className="accordion-item">
                    <div className="accordion-header">
                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="false" aria-controls="panelsStayOpen-collapseOne">
                            <h6>Productos en lista</h6>
                        </button>
                    </div>
                    <div id="panelsStayOpen-collapseOne" className="accordion-collapse collapse">
                        <div className="accordion-body item-cont">
                            <div className="search-container">
                                <input
                                    className="admin-search"
                                    type="text"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    placeholder="Buscar productos..."
                                />
                            </div>
                            <ul className="item-cont column-g-20">
                                {filteredResults.filter((item): item is Products => 'category' in item && 'price' in item)
                                    .map((prod) => (
                                        <li
                                            key={prod.id}
                                            className={`item-cont shadow-sm left-decoration-grey border-bottom border-top ${focusedProductId === prod.id ? 'focused' : ''}`}
                                            onFocus={() => setFocusedProductId(prod.id)}
                                            onBlur={() => setFocusedProductId(null)}
                                            tabIndex={0}
                                        >
                                            <ItemListProduct key={prod.id} product={prod} />
                                        </li>

                                    ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <div id="add-prods" className="accordion-item">
                    <div className="accordion-header">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseTwo" aria-expanded="false" aria-controls="panelsStayOpen-collapseTwo">
                            <h6>Agregar producto</h6>
                        </button>
                    </div>
                    <div id="panelsStayOpen-collapseTwo" className="accordion-collapse collapse">
                        <div className="accordion-body">
                            <AddProductForm></AddProductForm>
                        </div>
                    </div>
                </div>
                <div id="prods-price" className="accordion-item">
                    <div className="accordion-header">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseThree" aria-expanded="false" aria-controls="panelsStayOpen-collapseThree">
                            <h6>Editar precios de productos en lista</h6>
                        </button>
                    </div>
                    <div id="panelsStayOpen-collapseThree" className="accordion-collapse collapse">
                        <div className="accordion-body">
                            <div className="row">
                                <div className="col-md-3">
                                    <div className="item-cont">
                                        <label htmlFor="percentageInput">
                                            <h6>Ingrese el porcentaje de aumento</h6>
                                        </label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            id="percentageInput"
                                            placeholder="Ej. 10 para aumentar un 10%"
                                            value={percentage}
                                            onChange={(e) => setPercentage(parseFloat(e.target.value) || 0)}
                                        />
                                    </div>
                                    <div className="item-cont">
                                        <button className="general-button" onClick={() => handleIncreasePrices(false)}>Aumentar a Todos</button>
                                        <button className="light-button" onClick={() => handleIncreasePrices(true)}>Aumentar a Seleccionados</button>
                                    </div>
                                </div>
                                <div className="prods-price-cont col-md-9">
                                    <div className="item-cont">
                                        <h6>Seleccionar productos:</h6>
                                        <div className="search-container">
                                            <input
                                                className="admin-search"
                                                type="text"
                                                value={searchQuery}
                                                onChange={handleSearchChange}
                                                placeholder="Buscar productos..."
                                            />
                                        </div>
                                        <ul className="ul-prod-price">
                                            {filteredResults.filter((item): item is Products => 'category' in item && 'price' in item).map((product) => (
                                                <li key={product.id}>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedProducts.includes(Number(product.id))}
                                                        onChange={() => toggleProductSelection(Number(product.id))}
                                                    />
                                                    <div><p>{product.id} -</p> <p>{product.name} - </p><p>{product.category} -</p><p> ${product.price}</p></div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="prods-list-price" className="accordion-item">
                    <div className="accordion-header">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseFour" aria-expanded="false" aria-controls="panelsStayOpen-collapseFour">
                            <h6>Actualizar lista de precios descargable</h6>
                        </button>
                    </div>
                    <div id="panelsStayOpen-collapseFour" className="accordion-collapse collapse">
                        <div className="accordion-body">
                            <div className="row">
                                <div className="col-md-5">
                                    {listPrice[0] ? (
                                        <>
                                            <div className="item-cont">
                                                <div className="item-info align-items-center">
                                                    <h6 className="pr-20">Ultima actualización:</h6>
                                                    <p className="fw-medium fs-6">{new Date(new Date(listPrice[0].date + "T00:00:00")).toLocaleDateString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })}</p>
                                                </div>
                                                <div className="button-cont">
                                                    {fileUrl ? (
                                                        <button className="light-button"><a href={fileUrl} download>Descargar última lista cargada.</a></button>
                                                    ) : (
                                                        <p>No hay archivos disponibles.</p>
                                                    )}
                                                </div>
                                            </div>
                                            <span className="button-cont">
                                                <button className="no-button" onClick={handleDeleteListPrice}>Eliminar lista actual</button>
                                            </span>
                                        </>
                                    ) : (
                                        <p>No hay ningun archivo cargado.</p>
                                    )}
                                </div>
                                <form className="col-md-7" onSubmit={handleSubmit(saveNewListPrice)}>
                                    <div className="item-cont">
                                        <h6>Subir nueva lista de precios:</h6>
                                        <div className="button-cont align-items-start">
                                            <input id="pdf-list-price" type="File" {...register('list_price', { required: true })}></input>
                                            <button className="general-button">Guardar</button>
                                        </div>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ModalMesagge
                isOpen={modalConfig.isOpen}
                title={modalConfig.title}
                content={<p>{modalConfig.content}</p>}
                onClose={closeModal}
                onConfirm={modalConfig.onConfirm}
                confirmText={modalConfig.confirmText}
                cancelText={modalConfig.cancelText}
            />
        </div>
    )
}
