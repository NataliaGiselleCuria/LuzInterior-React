import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react";
import { NavigateFunction } from 'react-router-dom';
import { FormRegister, Response, UserContextType } from "../Interfaces/interfaces";
import { useApi } from "./ApiProvider";

export const UserContext = createContext<UserContextType>({} as UserContextType);

interface Props {
    children: ReactNode;
}

export const UserProvider = ({ children }: Props) => {

    const { users, refreshUser, dev, getUserActive, setUserActive } = useApi();
    const [isLogin, setIsLogin] = useState(false);

    const userLogout = (navigate: NavigateFunction) => {
        localStorage.removeItem('user_token');
        setUserActive(null);
        setIsLogin(false);
        navigate('/');
    };

    const checkToken = useCallback(async (token: string, navigate: NavigateFunction): Promise<Response> => {
        try {
            if (!token) {
                userLogout(navigate);
                return { success: false, message: "Token no encontrado. La sesión ha expirado." };
            }

            const response = await fetch(`${dev}/index.php?action=verify-token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',

                },
                body: JSON.stringify({
                    token: token
                })
            });

            const result = await response.json();

            if (result.success) {
                const email = localStorage.getItem('email');
                if (!email) {
                    userLogout(navigate);
                    return { success: false, message: "No se encontró el email del usuario en el almacenamiento." };
                }

                setIsLogin(true);
                return { success: true, message: "Inicio de sesión exitoso" };
            } else {
                userLogout(navigate);
                return {
                    success: false,
                    message: result.message || "Su sesión expiró. Inicie sesión nuevamente"
                };
            }

        } catch (error) {
            console.error("Error en la verificación:", error);
            userLogout(navigate);
            const errorMessage = error instanceof TypeError
                ? "Error de conexión. Verifique su conexión a internet."
                : "Ocurrió un problema inesperado.";
            return { success: false, message: errorMessage };
        }
    }, []);

    const userLogin = async (email: string, password: string): Promise<Response> => {
        try {
            const response = await fetch(`${dev}/index.php?action=login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const result = await response.json();

            if (result.success) {

                const { token, role } = result;

                if (!token) return { success: false, message: "Token no recibido" };

                localStorage.setItem('user_token', token);
                localStorage.setItem('email', email);
                localStorage.setItem('role', role);

                await getUserActive(result.token, email);

                setIsLogin(true);
                return { success: true, message: "Inicio de sesión exitoso" };

            } else {
                return { success: false, message: result.message || "Credenciales incorrectas" };
            }


        } catch (error) {
            const errorMessage = error instanceof TypeError
                ? "Error de conexión. Verifique su conexión a internet."
                : "Ocurrió un problema inesperado.";

            return { success: false, message: errorMessage };
        }
    };

    const userRegister = async (data: FormRegister): Promise<Response> => {

        try {
            const response = await fetch(`${dev}/index.php?action=register-user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ data })
            });

            const result = await response.json();

            if (!response.ok || !result.success) {

                if (result.message) {
                    return {
                        success: false,
                        message: result.message
                    };
                }

                return {
                    success: false,
                    message: "Error en la validación de campos o datos incorrectos"
                };
            }

            return {
                success: result.success,
                message: result.message || "Usuario registrado exitosamente"
            };

        } catch (error) {
            const errorMessage = error instanceof TypeError
                ? "Error de conexión. Verifique su conexión a internet e intente nuevamente."
                : "Ocurrió un problema inesperado.";

            return { success: false, message: errorMessage };
        }
    };

    const recoverPassword = async (email: string): Promise<Response> => {
        try {
            const response = await fetch(`${dev}/index.php?action=recover`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const result = await response.json();
            return {
                success: result.success,
                message: result.success
                    ? "Se ha enviado un enlace para recuperar la contraseña a tu email."
                    : result.message || "Error en la recuperación de contraseña",
            };
        } catch (error) {
            return {
                success: false,
                message: "No se pudo conectar con el servidor.",
            };
        }
    };

    const updateUserInfo = async (
        data: Record<string, any>,
        id: number,
        endpoint: string
    ): Promise<Response> => {
        try {
            const token = localStorage.getItem('user_token')

            const response = await fetch(`${dev}/index.php?action=${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data, id, token }),
            });

            const result = await response.json();
            return {
                success: result.success,
                message: result.success
                    ? "Información actualizada."
                    : result.message || "Error en la actualización de la información",
            };
        } catch (error) {
            return {
                success: false,
                message: "No se pudo conectar con el servidor.",
            };
        }
    };

    const updateUserApproved = async (id: number): Promise<Response> => {
        try {
            const token = localStorage.getItem('user_token')

            const response = await fetch(`${dev}/index.php?action=change-approved`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, token }),
            });

            const result = await response.json();

            refreshUser();

            return {
                success: result.success,
                message: result.success
                    ? "Información actualizada."
                    : result.message || "Error en la actualización de la información",
            };

        } catch (error) {
            return {
                success: false,
                message: "No se pudo conectar con el servidor.",
            };
        }
    }

    const updateUserRole = async (id: number): Promise<Response> => {
        try {
            const token = localStorage.getItem('user_token')

            const response = await fetch(`${dev}/index.php?action=change-role`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, token }),
            });

            const result = await response.json();

            refreshUser();

            return {
                success: result.success,
                message: result.success
                    ? "Información actualizada."
                    : result.message || "Error en la actualización de la información",
            };

        } catch (error) {
            return {
                success: false,
                message: "No se pudo conectar con el servidor.",
            };
        }
    }

    const deletUser = async (id: number): Promise<Response> => {
        try {
            const token = localStorage.getItem('user_token')

            const response = await fetch(`${dev}/index.php?action=delete-user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',

                },
                body: JSON.stringify({ id, token }),
            });

            const result = await response.json();

            refreshUser();

            return {
                success: result.success,
                message: result.success
                    ? "Información actualizada."
                    : result.message || "Error en la actualización de la información",
            };

        } catch (error) {
            return {
                success: false,
                message: "No se pudo conectar con el servidor.",
            };
        }
    }

    const userValue = useMemo(() => ({
        isLogin,
        userLogout,
        checkToken,
        userLogin,
        userRegister,
        recoverPassword,
        updateUserInfo,
        updateUserApproved,
        updateUserRole,
        deletUser
    }),
        [
        isLogin,
        users,

        ]);

    return (
        <UserContext.Provider value={userValue}>
            {children}
        </UserContext.Provider>
    );
}

export const useUser = () => {
    return useContext(UserContext);
};