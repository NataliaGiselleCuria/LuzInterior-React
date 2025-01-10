import { useState } from "react";
import { AdminProducts } from "./AdminProducts";
import AdminUsers from "./AdminUsers";
import AdminOrders from "./AdminOrders";
import AdminGallery from "./AdminGallery";
import './admin.css';
import AdminAccount from "./AdminAccount";
import AdminShipping from "./AdminShipping";

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
            case 'galeria':
                return <AdminGallery />;
            case 'cuenta':
                return <AdminAccount/>;
            case 'envios': 
                return <AdminShipping/>
        }
    }

    return (
        <div className="cont container">
            <h4>AdminPanel</h4>
            <div className="nav-opc">
                <ul className="ul-row-nopadding">
                    <li><button onClick={() => setSelectedOption('pedidos')}>Pedidos</button></li>
                    <li><button onClick={() => setSelectedOption('usuarios')}>Usuarios</button></li>
                    <li><button onClick={() => setSelectedOption('productos')}>Productos</button></li>
                    <li><button onClick={() => setSelectedOption('galeria')}>Galería</button></li>
                    <li><button onClick={() => setSelectedOption('cuenta')}>Cuenta</button></li>
                    <li><button onClick={() => setSelectedOption('envios')}>Envios</button></li>
                </ul>
            </div>
            <div className="opc-render">
                {selectedOption && renderOpc(selectedOption)}
            </div>
        </div>
    )
}
