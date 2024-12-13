import React, { createContext, useContext, useMemo } from "react";
import { FormImgsProduct, FormProduct, ProductContextType, Response } from "../Interfaces/interfaces";
import { useApi } from "./ApiProvider";
import useVerifyToken from "../components/CustomHooks/verefyToken";


export const ProductContext = createContext<ProductContextType>({} as ProductContextType);

interface Props {
  children: React.ReactNode;
}

export const ProductProvider = ({ children }: Props) => {

  const { dev, setProducts } = useApi();
  const { validateToken } = useVerifyToken();

  const refreshProducts = async() => {
    const updateProducts = await fetch(`${dev}/index.php?action=products`);
    const data = await updateProducts.json();
    setProducts(data);
  }

  const registerProduct = async (data: FormProduct): Promise<Response & { id?: string }> => {
    const isTokenValid = await validateToken();

    if (!isTokenValid) {
      return { success: false, message: "Token inválido." };
    }

    const token = localStorage.getItem('token')

    try {
      const response = await fetch(`${dev}/index.php?action=register-product`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, message: errorData.message || "Error al registrar el producto." };
      }

      refreshProducts();

      const result = await response.json();
      
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

    const token = localStorage.getItem('token')

    try {
      const response = await fetch(`${dev}/index.php?action=update-product`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId,
          data: productData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, message: errorData.message || "Error al actualizar el producto." };
      }

      refreshProducts();

      const result = await response.json();
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

    const token = localStorage.getItem('token')

    try {
      const response = await fetch(`${dev}/index.php?action=delete-product`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, message: errorData.message || "Error al eliminar el producto." };
      }

      refreshProducts();

      const result = await response.json();
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
      const token = localStorage.getItem('token')

      const response = await fetch(`${dev}/index.php?action=upload-images-products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, message: errorData.message || "Error al subir imágenes." };
      }

      const result = await response.json();

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

    const formData = new FormData();

    formData.append("id", productData.id);
    formData.append("name", productData.name);
    formData.append("price", productData.price.toString());
    formData.append("category", productData.category);
    formData.append("description", productData.description);

    images.forEach((image, index) => {
      formData.append(`image${index}`, image.url); // `url` aquí representa el archivo
      formData.append(`priority${index}`, image.priority.toString());
    });

    try {
      const token = localStorage.getItem('token')

      const response = await fetch(`${dev}/index.php?action=register-prod-and-img`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          message: errorData.message || "Error al registrar el producto y las imágenes.",
        };
      }

      refreshProducts();

      const result = await response.json();

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

  const value = useMemo(() => ({
    registerProduct,
    deleteProduct,
    updateProduct,
    uploadImages,
    saveProductAndImages
  }), []);

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

export const useProduct = () => {
  return useContext(ProductContext);
};

