import { useState } from "react";
import { useApi } from "../../context/ApiProvider"
import { ListPrice, Products } from "../../Interfaces/interfaces";
import { useSearch } from "../CustomHooks/useSearch";
import AddProductForm from "./AddProductForm";
import ItemListProduct from "./ItemListProduct";
import useVerifyToken from "../CustomHooks/verefyToken";
import useModal from "../CustomHooks/modal";
import ModalMesagge from "../Tools/ModalMesagge";
import { useProduct } from "../../context/ProductProvider";
import { useForm } from "react-hook-form";

export const AdminProducts = () => {

    const { products, listPrice, fileUrl, getFile } = useApi();
    const { updateProductPrices, updateListPrice } = useProduct();
    const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
    const [percentage, setPercentage] = useState<number>(0)
    const { validateToken } = useVerifyToken();
    const { modalConfig, openModal, closeModal } = useModal();
    const { searchQuery, filteredResults, handleSearchChange } = useSearch(products, true);
    const { register, handleSubmit } = useForm<ListPrice>({});

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


    return (
        <>
            <h3>Productos</h3>
            <div className="accordion" id="accordionPanelsStayOpenExample">
                <div id="prods-list" className="accordion-item">
                    <h2 className="accordion-header">
                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="false" aria-controls="panelsStayOpen-collapseOne">
                            Productos en lista
                        </button>
                    </h2>
                    <div id="panelsStayOpen-collapseOne" className="accordion-collapse collapse">
                        <div className="accordion-body">
                            <div className="search-container">
                                <input
                                    className="admin-search"
                                    type="text"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    placeholder="Buscar productos..."
                                />
                            </div>
                            <ul className="list-acordeon">
                                {filteredResults.filter((item): item is Products => 'category' in item && 'price' in item)
                                    .map((prod) => (
                                        <ItemListProduct key={prod.id} product={prod} />
                                    ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <div id="add-prods" className="accordion-item">
                    <h2 className="accordion-header">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseTwo" aria-expanded="false" aria-controls="panelsStayOpen-collapseTwo">
                            Agregar producto
                        </button>
                    </h2>
                    <div id="panelsStayOpen-collapseTwo" className="accordion-collapse collapse">
                        <div className="accordion-body">
                            <AddProductForm></AddProductForm>
                        </div>
                    </div>
                </div>
                <div id="prods-price" className="accordion-item">
                    <h2 className="accordion-header">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseThree" aria-expanded="false" aria-controls="panelsStayOpen-collapseThree">
                            Editar precios
                        </button>
                    </h2>
                    <div id="panelsStayOpen-collapseThree" className="accordion-collapse collapse">
                        <div className="accordion-body">
                            <div className="form-group">
                                <label htmlFor="percentageInput">Ingrese el porcentaje de aumento</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    id="percentageInput"
                                    placeholder="Ej. 10 para aumentar un 10%"
                                    value={percentage}
                                    onChange={(e) => setPercentage(parseFloat(e.target.value) || 0)}
                                />
                                <button onClick={() => handleIncreasePrices(false)}>Aumentar a Todos</button>
                                <button onClick={() => handleIncreasePrices(true)}>Aumentar a Seleccionados</button>
                            </div>
                            <div>
                                <h5>Seleccionar productos:</h5>
                                <div className="search-container">
                                    <input
                                        className="admin-search"
                                        type="text"
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        placeholder="Buscar productos..."
                                    />
                                </div>
                                <ul>
                                    {filteredResults.filter((item): item is Products => 'category' in item && 'price' in item).map((product) => (
                                        <li key={product.id}>
                                            <label>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedProducts.includes(Number(product.id))}
                                                    onChange={() => toggleProductSelection(Number(product.id))}
                                                />
                                                {product.id} - {product.name} - {product.category} - ${product.price}
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="prods-list-price" className="accordion-item">
                    <h2 className="accordion-header">
                        <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseFour" aria-expanded="false" aria-controls="panelsStayOpen-collapseFour">
                            Lista de precios
                        </button>
                    </h2>
                    <div id="panelsStayOpen-collapseFour" className="accordion-collapse collapse">
                        <div className="accordion-body">
                            <span>
                                {listPrice[0] ? (
                                    <>
                                        <p>Ultima actualización:</p>
                                        <p>{new Date(new Date(listPrice[0].date + "T00:00:00")).toLocaleDateString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' })}</p>
                                        {fileUrl ? (
                                            <a href={fileUrl} download>Descargar última lista cargada.</a>
                                        ) : (
                                            <p>No hay archivos disponibles.</p>
                                        )}
                                    </>
                                ) : (
                                    <p>No hay ningun archivo cargado.</p>
                                )}
                            </span>
                            <form onSubmit={handleSubmit(saveNewListPrice)}>
                                <p>Subir nueva lista de precios:</p>
                                <input id="pdf-list-price" type="File" {...register('list_price', { required: true })}></input>
                                <button>Guardar</button>
                            </form>
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
        </>
    )
}
