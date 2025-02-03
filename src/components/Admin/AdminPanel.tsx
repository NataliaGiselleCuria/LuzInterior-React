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
                return <AdminAccount/>;
            case 'envios': 
                return <AdminShipping/>
            case 'preguntas-frecuentes':
                return <AdminFrequentlyAskedQuestions/>
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
                    <li><button onClick={() => setSelectedOption('envios')}>Envios</button></li>
                    <li><button onClick={() => setSelectedOption('preguntas-frecuentes')}>Preguntas Frecuentes</button></li>
                    <li><button onClick={() => setSelectedOption('imagenes')}>Imágenes</button></li>                                      
                    <li><button onClick={() => setSelectedOption('cuenta')}>Cuenta</button></li>
                </ul>
            </div>
            <div className="opc-render">
                {selectedOption && renderOpc(selectedOption)}
            </div>
        </div>
    )
}
