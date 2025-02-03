import React, { createContext, useContext, useMemo } from "react";
import { FormImgsProduct, FormProduct, ListPrice, ProductContextType, Response } from "../Interfaces/interfaces";
import { useApi } from "./ApiProvider";
import useVerifyToken from "../CustomHooks/verefyToken";


export const ProductContext = createContext<ProductContextType>({} as ProductContextType);

interface Props {
  children: React.ReactNode;
}

export const ProductProvider = ({ children }: Props) => {

  const { dev, refreshProducts, refreshListPrice } = useApi();
  const { validateToken } = useVerifyToken();

  const registerProduct = async (data: FormProduct): Promise<Response & { id?: string }> => {
    const isTokenValid = await validateToken();

    if (!isTokenValid) {
      return { success: false, message: "Token inválido." };
    }

    const token = localStorage.getItem('user_token')
    console.log(data)

    try {
      const response = await fetch(`${dev}/index.php?action=register-product`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({data, token}),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        const errorData = await response.json();
        return { success: false, message: errorData.message || "Error al registrar el producto." };
      }

      refreshProducts();

      return {
        success: result.success,
        message: result.message || "Producto registrado exitosamente.",
        id: result.id,
      };

    } catch (error) {
      const errorMessage =
        error instanceof TypeError
          ? "Error de conexión. Verifique su conexión a internet e intente nuevamente."
          : "Ocurrió un problema inesperado.";

      return { success: false, message: errorMessage };
    }
  };

  const updateProduct = async (productId: string, productData: FormProduct): Promise<Response> => {

    const isTokenValid = await validateToken();

    if (!isTokenValid) {
      return { success: false, message: "Token inválido." };
    }

    const token = localStorage.getItem('user_token')

    try {
      const response = await fetch(`${dev}/index.php?action=update-product`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          data: productData,
          token: token
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        return { success: false, message: result.message || "Error al actualizar el producto." };
      }

      refreshProducts();

      return { success: result.success, message: result.message || "Producto actualizado correctamente." };

    } catch (error) {
      const errorMessage =
        error instanceof TypeError
          ? "Error de conexión. Verifique su conexión a internet e intente nuevamente."
          : "Ocurrió un problema inesperado.";
      return { success: false, message: errorMessage };
    }

  };

  const deleteProduct = async (productId: string): Promise<Response> => {

    const isTokenValid = await validateToken();

    if (!isTokenValid) {
      return { success: false, message: "Token inválido." };
    }

    const token = localStorage.getItem('user_token')

    try {
      const response = await fetch(`${dev}/index.php?action=delete-product`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, token }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        const errorData = await response.json();
        return { success: false, message: errorData.message || "Error al eliminar el producto." };
      }

      refreshProducts();

      return {
        success: result.success,
        message: result.message || "Producto eliminado exitosamente.",
      };

    } catch (error) {
      const errorMessage =
        error instanceof TypeError
          ? "Error de conexión. Verifique su conexión a internet e intente nuevamente."
          : "Ocurrió un problema inesperado.";

      return { success: false, message: errorMessage };
    }
  }

  const uploadImages = async (productId: string, images: FormImgsProduct[], deletedImages: FormImgsProduct[]): Promise<Response> => {

    const isTokenValid = await validateToken();

    if (!isTokenValid) {
      return { success: false, message: "Token inválido." };
    }

    const formData = new FormData();
    formData.append("productId", productId);


    images.forEach((image, index) => {
      if (image.url instanceof File) {
        formData.append(`image${index}`, image.url);
      } else {
        formData.append(`existingImageId${index}`, image.id);
      }
      formData.append(`priority${index}`, image.priority.toString());
    });

    deletedImages.forEach((image, index) => {
      formData.append(`deletedImages[${index}]`, image.id.toString());
    });

    try {
      const token = localStorage.getItem('user_token')
      formData.append("token", token || '')

      const response = await fetch(`${dev}/index.php?action=upload-images-products`, {
        method: 'POST',
        headers: {
          
        },
        body: formData,

      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        const errorData = await response.json();
        return { success: false, message: errorData.message || "Error al subir imágenes." };
      }

      refreshProducts();

      return { success: result.success, message: result.message || "Imágenes subidas correctamente." };

    } catch (error) {
      const errorMessage = error instanceof TypeError
        ? "Error de conexión. Verifique su conexión a internet e intente nuevamente."
        : "Ocurrió un problema inesperado.";
      return { success: false, message: errorMessage };
    }
  };

  const saveProductAndImages = async (productData: FormProduct, images: FormImgsProduct[]): Promise<Response> => {
    const isTokenValid = await validateToken();

    if (!isTokenValid) {
      return { success: false, message: "Token inválido." };
    }

    console.log(productData)
    const formData = new FormData();

    formData.append("id", productData.id);
    formData.append("name", productData.name);
    formData.append("price", productData.price.toString());
    formData.append("category", productData.category);
    formData.append("description", productData.description);
    formData.append("novelty", productData.novelty ? "true" : "false");

    images.forEach((image, index) => {
      formData.append(`image${index}`, image.url); // `url` aquí representa el archivo
      formData.append(`priority${index}`, image.priority.toString());
    });

    try {
      const token = localStorage.getItem('user_token')

      formData.append("token", token || "")

      const response = await fetch(`${dev}/index.php?action=register-prod-and-img`, {
        method: "POST",
        headers: {
          
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        const errorData = await response.json();
        return {
          success: false,
          message: errorData.message || "Error al registrar el producto y las imágenes.",
        };
      }

      refreshProducts();

      return {
        success: result.success,
        message: result.message || "Producto e imágenes guardados exitosamente.",

      };

    } catch (error) {
      const errorMessage =
        error instanceof TypeError
          ? "Error de conexión. Verifique su conexión a internet e intente nuevamente."
          : "Ocurrió un problema inesperado.";
      return { success: false, message: errorMessage };
    }
  };

  const updateProductPrices = async (percentage: number, productIds: number[] = []): Promise<Response> => {
    const isTokenValid = await validateToken();

    if (!isTokenValid) {
      return { success: false, message: "Token inválido." };
    }

    try {
      const token = localStorage.getItem('user_token')

      const response = await fetch(`${dev}/index.php?action=update-price`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ percentage, productIds, token }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        const errorData = await response.json();
        return {
          success: false,
          message: errorData.message || "Error al actualizar los precios.",
        };
      }

      refreshProducts();

      return {
        success: result.success,
        message: result.message || "Precios actualizados exitosamente.",

      };
    } catch (error) {
      return { success: false, message: 'Error al actualizar los precios.' };
    }
  }



  const updateListPrice = async (data: ListPrice): Promise<Response> => {
    const isTokenValid = await validateToken();

    if (!isTokenValid) {
      return { success: false, message: "Token inválido." };
    }

    const token = localStorage.getItem('user_token')
    const date = new Date();

    try {
      const formData = new FormData();
      formData.append("date", date.toISOString());
      if (data.list_price[0]) {
        formData.append("list_price", data.list_price[0]);
      }
      formData.append("token", token || "");

      const response = await fetch(`${dev}/index.php?action=update-list-price`, {
        method: "POST",
        headers: {
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        return { success: false, message: result.message || `Error al actualizar la lista ded precios: ${result.mesagge}` };
      }

      refreshListPrice();

      return {
        success: result.success,
        message: result.message || "Lista de precios actualizada exitosamente.",
      };

    } catch (error) {
      const errorMessage =
        error instanceof TypeError
          ? `Error de conexión: ${error.message}`
          : `Ocurrió un problema inesperado: ${error}`;

      return { success: false, message: errorMessage };
    }
  };

  const deleteListPrice = async (): Promise<Response> => {
    const isTokenValid = await validateToken();

    if (!isTokenValid) {
      return { success: false, message: "Token inválido." };
    }

    const token = localStorage.getItem('user_token')

    try {
      const response = await fetch(`${dev}/index.php?action=delete-list-price`, {
        method: "POST",
        headers: {

        },
        body: JSON.stringify({ token }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        return { success: false, message: result.message || `Error al eliminar la lista ded precios: ${result.mesagge}` };
      }

      refreshListPrice();

      return {
        success: result.success,
        message: result.message || "Lista de precios eliminada exitosamente.",
      };

    } catch (error) {
      const errorMessage =
        error instanceof TypeError
          ? `Error de conexión: ${error.message}`
          : `Ocurrió un problema inesperado: ${error}`;

      return { success: false, message: errorMessage };
    }
  }

  const value = useMemo(() => ({
    registerProduct,
    deleteProduct,
    updateProduct,
    uploadImages,
    saveProductAndImages,
    updateProductPrices,
    updateListPrice,
    deleteListPrice,
  }), []);

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

export const useProduct = () => {
  return useContext(ProductContext);
};

