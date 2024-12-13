
import { Link, useNavigate } from 'react-router-dom'
import { useApi } from '../../context/ApiProvider'
import { useCart } from '../../context/CartProvider';
import { useUser } from '../../context/UserContext';
import SearchBar from '../Tools/SearchBar';
// import logo from '../../assets/logo.png' // reemplazar cuando tengas el png original
import cartImg from '../../assets/cart2.png'
import userImg from '../../assets/user.png'
import './navBar.css'

export interface NavBarProps {
    openCart: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ openCart }) => {

    const { products, categories } = useApi();
    const { isLogin, userLogout } = useUser();
    const { cart } = useCart();
    const navigate = useNavigate();

    const role = localStorage.getItem('role');

    //Drop user - admin
    const getDropdownContent = () => {
        if (!isLogin) {
            return (
                <Link to="/mayoristas">
                    <span className="button-text">Iniciar sesión</span>
                </Link>
            );
        }

        if (role === "user") {
            return (
                <li>
                    <span className="nav-link dropdown-toggle" data-bs-toggle="dropdown"></span>
                    <ul className="dropdown-menu drop-user">
                        <li><Link to="/mi_cuenta" className="dropdown-item">Mi cuenta</Link></li>
                        <li><Link to="/mis_pedidos" className="dropdown-item">Mis pedidos</Link></li>
                        <li onClick={() => userLogout(navigate)} className="dropdown-item">Cerrar sesión</li>
                    </ul>
                </li>
            );
        }

        return (
            <li>
                <span className="nav-link dropdown-toggle" data-bs-toggle="dropdown"></span>
                <ul className="dropdown-menu drop-user">
                    <li><Link to="/admin" className="dropdown-item">Panel de Administración</Link></li>
                    <li onClick={() => userLogout(navigate)} className="dropdown-item">Cerrar sesión</li>
                </ul>
            </li>
        );
    };

    return (
        <nav id='nav' className='navbar navbar-expand-md bg-body-tertiary' >
            <div className='container nav-cont'>
                <Link to='/'>
                    <img className='logo' src="https://static.wixstatic.com/media/68801d_f296e78e486a4e64a8224a9a5cb0a1af~mv2.png/v1/fill/w_100,h_55,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/LOGO%20LUZ%20INTERIOR%20SRL%20MAYORISTAS.png" alt="Logo Luz Interior" />
                </Link>
                <span className='nav-links'>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className='navbar-nav me-auto mb-2 mb-lg-0 container'>
                            <li className='nav-item dropdown'>
                                <Link to='/productos' className="nav-link dropdown-toggle" data-bs-toggle="dropdown">Productos</Link>
                                <ul className="dropdown-menu">
                                    <li>
                                        <Link to='/productos' className="dropdown-item">Todos los productos</Link>
                                    </li>
                                    {categories.map((category) => (
                                        <li key={category}>
                                            <Link to={`/productos/categoria/${category}`} className="dropdown-item">{category}</Link>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                            <li className='nav-item'><Link to='/galeria' className="nav-link">Galeria</Link></li>
                            {!isLogin ?
                                <li className='nav-item'><Link to='/mayoristas' className="nav-link" >Mayoristas</Link></li>
                                : <li className='nav-item'><Link to='/lista_de_precios' className="nav-link" >Lista de precios</Link></li>
                            }
                            <li className='nav-item'>
                                <Link to='/contacto' className="nav-link">Contato</Link>
                            </li>
                            <li>
                                <SearchBar products={products}/>
                            </li>
                        </ul>
                    </div>
                </span>
                <span className='icons-navbar'>
                    <span className='cart-cont'>
                        <button className='button-cart' onClick={openCart}>
                            <img src={cartImg} alt="carrito"></img>
                            <div className='cart-num'>{cart.length}</div>
                        </button>
                    </span>
                    <span className='user-cont'>
                        <button className="button-login">
                            <img src={userImg} alt="usuario" />
                            {getDropdownContent()}
                        </button>
                    </span>
                </span>
            </div>

        </nav>
    )
}

export default NavBar
