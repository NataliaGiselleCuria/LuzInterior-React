import { useEffect, useState } from "react";
import { useApi } from "../../context/ApiProvider";
import { useProduct } from "../../context/ProductProvider";
import { FormImgsProduct, FormProduct, Products } from "../../Interfaces/interfaces"
import { useForm } from "react-hook-form";
import FormImg from "../Tools/FormImg";
import useVerifyToken from "../CustomHooks/verefyToken";
import useModal from "../CustomHooks/modal";
import ModalMesagge from "../Tools/ModalMesagge";

export interface ItemListProductProps {
  product: Products;
}

const ItemListProduct = ({ product }: ItemListProductProps) => {
  const { dev, products } = useApi();
  const { deleteProduct, updateProduct, uploadImages } = useProduct();
  const { modalConfig, openModal, closeModal } = useModal();
  const { validateToken } = useVerifyToken();
  const [data, setData] = useState<{ productDetails: FormProduct | null; images: FormImgsProduct[]; }>({ productDetails: null, images: [] });
  const [isEditingProduct, setIsEditingProducts] = useState(false);
  const [isEditingImages, setIsEditingImages] = useState(false);
  const [idEditingProduct, setIdEditingProduct] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const { register, handleSubmit } = useForm<Products>({});

  useEffect(() => {
    if (product) {
      setData({
        productDetails: {
          id: product.id,
          name: product.name,
          category: product.category,
          price: product.price,
          description: product.description,
        },
        images: product.img_url.map((img) => ({
          id: img.id_img,
          product: idEditingProduct,
          url: img.url,
          priority: img.priority,
        })),
      });
    }
  }, [product]);

  const onSubmitProductInfo = (formData: any) => {
    setIsUpdating(true);
    setData((prevData) => ({
      ...prevData,
      productDetails: { ...formData }
    }));
  };

  const onSubmitImages = (images: FormImgsProduct[]) => {

    setData((prevData) => ({
      ...prevData,
      images,
    }));
    setIsUpdating(true);
  };

  useEffect(() => {
    if (isUpdating && (data.productDetails || data.images.length > 0)) {
      handleUpdate();
      setIsUpdating(false);
    }
  }, [data.productDetails, data.images, isUpdating]);

  const handleUpdate = async () => {
    const isTokenValid = await validateToken();
    if (!isTokenValid) {
      openModal("Error", "Token inválido. Por favor, inicie sesión nuevamente.", closeModal);
      return;
    }

    try {

      let productUpdateSuccess = true;
      let imageUpdateSuccess = true;

      // Actualización de la información del producto
      if (data.productDetails) {
        const updateResponse = await updateProduct(idEditingProduct, data.productDetails);
        if (!updateResponse.success) {
          openModal("Error", `Error al actualizar el producto: ${updateResponse.message}`, closeModal);
        }
      }

      // Actualización de las imágenes del producto
      const originalProduct = products.find((product) => product.id === idEditingProduct);
      const originalImages = originalProduct?.img_url || [];

      const deletedImages: FormImgsProduct[] = originalImages
        .filter(
          (original) =>
            !data.images.some(
              (updated) =>
                updated.id === original.id_img ||
                updated.url === original.url
            )
        )
        .map((original) => ({
          id: original.id_img,
          product: idEditingProduct,
          url: original.url,
          priority: original.priority,
        }));

      if (data.images && data.images.length > 0) {
        const imageResponse = await uploadImages(idEditingProduct, data.images, deletedImages);
        if (!imageResponse.success) {
          openModal("Advertencia", `Producto actualizado, pero hubo un error con las imágenes: ${imageResponse.message}`, closeModal);
        }
      }

      // Gestión de mensajes
      if (productUpdateSuccess && imageUpdateSuccess) {
        openModal("Éxito", "Producto e imágenes actualizados correctamente.", closeModal);
      } else if (productUpdateSuccess && !imageUpdateSuccess) {
        openModal(
          "Advertencia",
          "Producto actualizado, pero hubo un problema al actualizar las imágenes.",
          closeModal
        );
      } else if (!productUpdateSuccess && imageUpdateSuccess) {
        openModal(
          "Advertencia",
          "Imágenes actualizadas, pero hubo un problema al actualizar la información del producto.",
          closeModal
        );
      } else {
        openModal("Error", "No se pudo actualizar el producto ni las imágenes.", closeModal);
      }

      setIsEditingProducts(false);
      setIsEditingImages(false);
    } catch (error) {
      openModal("Error", `Error inesperado al actualizar el producto: ${error}`, closeModal);
    }
  };

  const editProductInfo = async (id: string) => {
    const isTokenValid = await validateToken();
    if (!isTokenValid) {
      return false;
    }
    setIdEditingProduct(id);
    setIsEditingProducts(true);
    setIsEditingImages(false);
  };

  const editProductImages = async (id: string) => {
    const isTokenValid = await validateToken();
    if (!isTokenValid) {
      return false;
    }
    setIdEditingProduct(id);
    setIsEditingImages(true);
    setIsEditingProducts(false);
  };

  const closeEditProduct = () => {
    setIsEditingProducts(false);
    setIsEditingImages(false);
  };

  return (
    <>
      <li className="li-acordeon">
        {!isEditingProduct && !isEditingImages ? (
          <>
            <div className="li-product-cont">
              <div className="li-product-cont-info">
                <span>ID: {product.id}</span>
                <span>Nombre: {product.name}</span>
                <span>Categoría: {product.category}</span>
                <span>Precio: {product.price}</span>
              </div>
              <div className="li-product-cont-description">
                <span>Descripción:</span>
                <span>{product.description}</span>
              </div>
              <div>
                <ul className="ul-row-nopadding">
                  {product.img_url.map((img, index) => (
                    <li className="h100 " key={`${product.name} - ${index}`}>
                      <img className="h100 w100 fix-img" id={img.id_img} src={`${dev}${img.url}`} alt={`${product.name} - ${img.id_img}`} />
                      {img.priority === 1 &&
                        <span className="priority-mark">Portada</span>
                      }
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div>
              <button onClick={() => editProductInfo(product.id)}>Editar Información</button>
              <button onClick={() => editProductImages(product.id)}>Editar Imágenes</button>
            </div>
            <button onClick={() => deleteProduct(product.id)}>Eliminar producto</button>
          </>
        ) : (
          <>
            {isEditingProduct && (
              <form>
                <div className="li-product-cont-info">
                  <span>ID: <input id="id" type="text" {...register('id', { required: true })} defaultValue={product.id}></input></span>
                  <span>Nombre: <input id="name" type="text" {...register('name', { required: true })} defaultValue={product.name}></input></span>
                  <span>Categoría: <input id="category" type="text" {...register('category', { required: true })} defaultValue={product.category}></input></span>
                  <span>Precio: <input id="price" type="number" {...register('price', { required: true })} defaultValue={product.price}></input></span>
                </div>
                <div className="li-product-cont-description">
                  <span>Descripción:</span>
                  <textarea id="description" {...register('description', { required: true })} defaultValue={product.description}></textarea>
                </div>
                <button type="submit" onClick={handleSubmit(onSubmitProductInfo)}>Guardar Información</button>
              </form>
            )}

            {isEditingImages && (
              <div>
                <div className="li-product-cont-info">
                  <span>ID: {product.id}</span>
                  <span>Nombre: {product.name}</span>
                </div>
                <FormImg productId={idEditingProduct} setData={setData} />
                <button type="button" onClick={() => onSubmitImages(data.images)}>Guardar Imágenes</button>
              </div>
            )}
            <div>
              <button type="button" onClick={closeEditProduct}>Volver</button>
            </div>
          </>
        )}
      </li>
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
  );
};

export default ItemListProduct;

