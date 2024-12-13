import { useState } from "react";
import { useUser } from "../../context/UserContext";
import { Address } from "../../Interfaces/interfaces";
import useVerifyToken from "./verefyToken";


interface UseUpdateUserInfoReturn {
  handleUpdateInformation: (
    data: any,
    id: number,
    endpoint: string,
  ) => Promise<boolean>;
  openModalAddress: (address?: Address | null) => void;
  closeModalAddress: () => void;
  isModalOpen: boolean;
  selectedAddress: Address | null;
}

export const useUpdateUserInfo = (openModal: (title: string, content: string) => void): UseUpdateUserInfoReturn => {

  const { getUserActive, updateUserInfo, userActive } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const { validateToken } = useVerifyToken();

  const openModalAddress = (address?: Address | null) => {
    setSelectedAddress(address || null);
    setIsModalOpen(true);
  };

  const closeModalAddress = () => {
    setIsModalOpen(false);
    setSelectedAddress(null);
  };

  const handleUpdateInformation = async (
    data: any,
    id: number,
    endpoint: string,
  ): Promise<boolean> => {
    if (!id) {
      openModal("Error", "El ID del usuario no está definido.");
      return false;
    }

    const isTokenValid = await validateToken();
    
    if (!isTokenValid) {
      return false;
    }

    const token = localStorage.getItem('token');
    const updateResult = await updateUserInfo(data, id, endpoint);

    if (updateResult.success && token) {
      await getUserActive(token, userActive?.email ?? "");
      openModal("Éxito", updateResult.message);
      return true;
    } else {
      openModal("Error", updateResult.message);
      return false;
    }

  };

  return { handleUpdateInformation, selectedAddress, isModalOpen, openModalAddress, closeModalAddress };
};