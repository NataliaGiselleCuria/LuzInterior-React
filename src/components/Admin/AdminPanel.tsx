import { useState } from "react";
import { AdminProducts } from "./AdminProducts";
import AdminUsers from "./AdminUsers";
import AdminOrders from "./AdminOrders";
import AdminImages from "./AdminImages";
import AdminAccount from "./AdminAccount";
import AdminShipping from "./AdminShipping";
import AdminFrequentlyAskedQuestions from "./AdminFrequentlyAskedQuestions";
import './admin.css';



export const AdminPanel = () => {

    const [selectedOption, setSelectedOption] = useState<string>('pedidos');

    const renderOpc = (opc: string) => {

        switch (opc) {
            case 'pedidos':
                return <AdminOrders />;
            case 'usuarios':
                return <AdminUsers />;
            case 'productos':
                return <AdminProducts />;
            case 'imagenes':
                return <AdminImages />;
            case 'cuenta':
                return <AdminAccount />;
            case 'envios':
                return <AdminShipping />
            case 'preguntas-frecuentes':
                return <AdminFrequentlyAskedQuestions />
        }
    }

    return (
        <div className="cont container">
            <div className="row h-100">
                <div className="nav-opc col-md-3 col-lg-2">
                    <span className="back"></span>
                    <div className="title-page">
                        <h6>Panel de administrador</h6>
                        <span className="line"></span>
                    </div>
                    <ul className="ul-row-nopadding opc-adm">
                        {[
                            { id: 'pedidos', label: 'Pedidos' },
                            { id: 'usuarios', label: 'Usuarios' },
                            { id: 'productos', label: 'Productos' },
                            { id: 'envios', label: 'Envíos' },
                            { id: 'preguntas-frecuentes', label: 'Preguntas Frecuentes' },
                            { id: 'imagenes', label: 'Imágenes' },
                            { id: 'cuenta', label: 'Cuenta' }
                        ].map(({ id, label }) => (
                            <li key={id} className={selectedOption === id ? 'active' : ''}>
                                <button onClick={() => setSelectedOption(id)}>{label}</button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="opc-render col-md-9 col-lg-10">
                    <div className="opc-render-cont w-100">
                        {selectedOption && renderOpc(selectedOption)}
                    </div>
                </div>
            </div>
        </div>
    )
}
