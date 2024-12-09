import { useState } from "react";
import { AdminProducts } from "./AdminProducts";


export const AdminPanel = () => {

    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    const renderOpc = (opc:string) => {
       
        switch (opc) {
            case 'cuenta':
                return <></>;
            case 'usuarios':
                return <></>;
            case 'pedidos':
                return <></>;
            case 'productos':
                return <AdminProducts />;
        }
    }
    
    return (
        <>
            <h3>AdminPanel</h3>
            <div className="nav-opc">
                <ul>
                   <li><button onClick={() =>setSelectedOption('cuenta')}>Cuenta</button></li>
                   <li><button onClick={() =>setSelectedOption('usuarios')}>Usuarios</button></li>
                   <li><button onClick={() =>setSelectedOption('pedidos')}>Pedidos</button></li>
                   <li><button onClick={() =>setSelectedOption('productos')}>Productos</button></li>
                </ul>
            </div>
            <div className="opc-render">
            {selectedOption && renderOpc(selectedOption)} 
            </div>
        </>
    )
}
