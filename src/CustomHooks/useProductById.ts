import { useMemo } from "react";
import { useApi } from "../context/ApiProvider"; // Ajusta la ruta según tu estructura

const useProductById = (id: string) => {
  const { products, dev } = useApi();

  return useMemo(() => {
    const prodResult = products.find(prod => prod.id === id);

    if (!prodResult) {
      return {
        exists: false,
        message: `El producto con ID ${id} ya no se encuentra en el sistema`,
      };
    }

    const mainImage =
      prodResult.img_url?.sort((a, b) => a.priority - b.priority)?.[0]?.url ||
      "ruta/a/imagen/default.png";

    return {
      exists: true,
      product: prodResult,
      imageUrl: `${dev}/${mainImage}`,
    };
  }, [id, products, dev]); // Se agregan dependencias
};

export default useProductById;