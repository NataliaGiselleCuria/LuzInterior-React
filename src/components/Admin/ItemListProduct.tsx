import { useEffect, useState } from "react";
import { useApi } from "../../context/ApiProvider";
import { useProduct } from "../../context/ProductProvider";
import { FormImgsProduct, FormProduct, Product } from "../../Interfaces/interfaces"
import { useForm } from "react-hook-form";
import FormImg from "../Tools/FormImg";
import useVerifyToken from "../CustomHooks/verefyToken";
import useModal from "../CustomHooks/modal";
import ModalMesagge from "../Tools/ModalMesagge";

export interface ItemListProductProps {
  product: Product;
}

const ItemListProduct = ({ product }: ItemListProductProps) => {
  const { dev, prod, products } = useApi();
  const { deleteProduct, updateProduct, uploadImages } = useProduct();
  const { modalConfig, openModal, closeModal } = useModal();
  const { validateToken } = useVerifyToken();
  const [data, setData] = useState<{ productDetails: FormProduct | null; images: FormImgsProduct[]; }>({ productDetails: null, images: [] });
  const [isEditingProduct, setIsEditingProducts] = useState(false);
  const [isEditingImages, setIsEditingImages] = useState(false);
  const [idEditingProduct, setIdEditingProducts] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const { register, handleSubmit } = useForm<Product>({});

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
    console.log("Imágenes para guardar:", images);

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

      console.log(deletedImages)

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
      openModal("Error", "Error inesperado al actualizar el producto.", closeModal);
    }
  };

  const editProductInfo = async (id: string) => {
    const isTokenValid = await validateToken();
    if (!isTokenValid) {
      return false;
    }
    setIdEditingProducts(id);
    setIsEditingProducts(true);
    setIsEditingImages(false); // Cerrar la edición de imágenes si se abre la edición de información
  };

  const editProductImages = async (id: string) => {
    const isTokenValid = await validateToken();
    if (!isTokenValid) {
      return false;
    }
    setIdEditingProducts(id);
    setIsEditingImages(true);
    setIsEditingProducts(false);
  };

  const closeEditProduct = () => {
    setIsEditingProducts(false);
    setIsEditingImages(false);
  };

  return (
    <>
      <li>
        {!isEditingProduct && !isEditingImages ? (
          <>
            <div>
              <div>
                <span>{product.id}</span>
                <span>{product.name}</span>
                <span>{product.category}</span>
                <span>{product.price}</span>
              </div>
              <div>
                <span>{product.description}</span>
              </div>
              <div>
                <ul>
                  {product.img_url.map((img, index) => (
                    <li key={`${product.name} - ${index}`}>
                      <img id={img.id_img} src={`${dev}${img.url}`} alt={`${product.name} - ${img.id_img}`} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div>
              <button onClick={() => deleteProduct(product.id)}>Eliminar</button>
              <button onClick={() => editProductInfo(product.id)}>Editar Información</button>
              <button onClick={() => editProductImages(product.id)}>Editar Imágenes</button>
            </div>
          </>
        ) : (
          <>
            {isEditingProduct && (
              <form>
                <div>
                  <input id="id" type="text" {...register('id', { required: true })} defaultValue={product.id}></input>
                  <input id="name" type="text" {...register('name', { required: true })} defaultValue={product.name}></input>
                  <input id="category" type="text" {...register('category', { required: true })} defaultValue={product.category}></input>
                  <input id="price" type="number" {...register('price', { required: true })} defaultValue={product.price}></input>
                </div>
                <div>
                  <input id="description" type="text" {...register('description', { required: true })} defaultValue={product.description}></input>
                </div>
                <button type="submit" onClick={handleSubmit(onSubmitProductInfo)}>Guardar Información</button>
              </form>
            )}

            {isEditingImages && (
              <div>
                <div>
                  <span>{product.id}</span>
                  <span>{product.name}</span>
                </div>
                <ul>
                  <FormImg productId={idEditingProduct} setData={setData} />
                </ul>
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
