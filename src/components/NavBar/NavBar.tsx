
import { Link, useNavigate } from 'react-router-dom'
import { useApi } from '../../context/ApiProvider'
import { useCart } from '../../context/CartProvider';
import { useUser } from '../../context/UserContext';
import SearchBar from '../Tools/SearchBar';
import logo from '../../assets/logo2.png'
import cartImg from '../../assets/cart.png'
import userImg from '../../assets/user.png'
import './navBar.css'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { useState } from 'react';

export interface NavBarProps {
    openCart: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ openCart }) => {

    const { products, categories } = useApi();
    const { isLogin, userLogout } = useUser();
    const { cart } = useCart();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const role = localStorage.getItem('role');

    const getDropdownContent = () => {
        if (!isLogin) {
            return (
                <Link to="/login" onClick={handleLinkClick}>
                    <LazyLoadImage className='h100' src={userImg} alt="usuario" />
                    <span className="button-text">Iniciar sesión</span>
                </Link>
            );
        }

        if (role === "user") {
            return (
                <li>
                    <LazyLoadImage className='h100' src={userImg} alt="usuario" />
                    <span className="nav-link dropdown-toggle" data-bs-toggle="dropdown"></span>
                    <ul className="dropdown-menu drop-user">
                        <li onClick={handleLinkClick}><Link to="/mi_cuenta" className="dropdown-item" >Mi cuenta</Link></li>
                        <li onClick={handleLinkClick}><Link to="/mis_pedidos" className="dropdown-item" >Mis pedidos</Link></li>
                        <li onClick={() => { userLogout(navigate); handleLinkClick(); }} className="dropdown-item" >Cerrar sesión</li>
                    </ul>
                </li>
            );
        }

        return (
            <li>
                <LazyLoadImage className='h100' src={userImg} alt="usuario" />
                <span className="nav-link dropdown-toggle" data-bs-toggle="dropdown"></span>
                <ul className="dropdown-menu drop-user">
                    <li onClick={handleLinkClick}><Link to="/admin" className="dropdown-item">Panel de Administración</Link></li>
                    <li onClick={() => { userLogout(navigate); handleLinkClick(); }} className="dropdown-item" >Cerrar sesión</li>
                </ul>
            </li>
        );
    };

    const handleLinkClick = () => {
        setIsMenuOpen(false);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <nav id='nav' className='navbar navbar-expand-md bg-body-tertiary' >
            <div className='container nav-cont'>
                <Link to='/' onClick={handleLinkClick}>
                    <LazyLoadImage className='nav-logo' src={logo} alt="Logo Luz Interior" />
                </Link>
                <span className='nav-links'>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded={isMenuOpen ? 'true' : 'false'} aria-label="Toggle navigation" onClick={toggleMenu}>
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarSupportedContent">
                        <ul className='navbar-nav me-auto mb-lg-0 container'>
                            <li className='nav-item dropdown'>
                                <Link to='/productos' className="nav-link dropdown-toggle" data-bs-toggle="dropdown">Productos</Link>
                                <ul className="dropdown-menu menu-prod">
                                    <li onClick={handleLinkClick}>
                                        <Link to='/productos' className="dropdown-item">Todos los productos</Link>
                                    </li>
                                    {categories.map((category) => (
                                        <li key={category} onClick={handleLinkClick}>
                                            <Link to={`/productos/categoria/${category}`} className="dropdown-item">{category}</Link>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                            <li className='nav-item'><Link to='/galeria' className="nav-link" onClick={handleLinkClick}>Galeria</Link></li>
                            {!isLogin ?
                                <></>
                                : <li className='nav-item'><Link to='/lista_de_precios' className="nav-link" onClick={handleLinkClick}>Lista de precios</Link></li>
                            }
                            <li className='nav-item'>
                                <Link to='/contacto' className="nav-link" onClick={handleLinkClick}>Contacto</Link>
                            </li>
                            <li>
                                <SearchBar data={products} handleLinkClick={handleLinkClick} />
                            </li>
                        </ul>
                    </div>
                </span>
                <span className='icons-navbar'>
                    <span className='cart-cont'>
                        <button className='button-cart' onClick={openCart}>
                            <LazyLoadImage className='h100' src={cartImg} alt="carrito"></LazyLoadImage>
                            <div className='cart-num'>{cart.length}</div>
                        </button>
                    </span>
                    <span className='user-cont'>
                        <button className="button-login">
                            {!isLogin ? (
                                <Link to="/login" onClick={handleLinkClick} >
                                    {getDropdownContent()}
                                </Link>
                            ) : (
                                <a>
                                    {getDropdownContent()}
                                </a>
                            )
                            }

                        </button>
                    </span>
                </span>
            </div>

        </nav>
    )
}

export default NavBar
