import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import NavBar from './components/NavBar/NavBar';
import PreviewCart from './components/Cart&Order/PreviewCart';
import Home from './components/Home/Home';
import ProductItem from './components/Products/ProductItem';
import ProductList from './components/Products/ProductList';
import Cart from './components/Cart&Order/Cart';
import Wholesalers from './components/UserPages/Wholesalers';
import PasswordRecover from './components/AdicionalPage/PasswordRecover';
import ErrorPage from './components/AdicionalPage/ErrorPage';
import Register from './components/UserPages/Register';
import PriceList from './components/PriceList/PriceList';
import SuccessRegister from './components/AdicionalPage/SuccessRegister';
import PasswordRegeneration from './components/AdicionalPage/PasswordRegeneration';
import AccountUser from './components/UserPages/AccountUser';
import OrdersUser from './components/UserPages/OrdersUser';
import CheckOut from './components/Cart&Order/CheckOut';
import AdminRoute from './components/Admin/AdminRoute';
import Footer from './components/Footer/Footer';

import { useUser } from './context/UserContext';
import { AdminPanel } from './components/Admin/AdminPanel';

import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import Gallery from './components/Galery/Gallery';
import Contact from './components/Contact/Contact';

function App() {
  const { checkToken, getUserActive } = useUser();
  const [loading, setLoading] = useState(true); 
  const [cartOpen, setCartOpen] = useState(false);
  const openCart = () => setCartOpen(true);
  const closeCart = () => setCartOpen(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');

    if (token && email) {
      checkToken(token, navigate).finally(() => setLoading(false)); 
      getUserActive(token, email)
      
    } else {
      setLoading(false);
    }
  }, [checkToken]);

  if (loading) {
    return <div>Loading...</div>;  // loading o spinner mientras se verifica el token
  }

  return (  
      <Routes>
        <Route
          path="/*"
          element={
            <AppWithNavBar openCart={openCart} cartOpen={cartOpen} closeCart={closeCart} />
          }
        />
      </Routes>  
  );
}

function AppWithNavBar({ openCart, cartOpen, closeCart }: any) {
  const location = useLocation();
  const hideNavBarRoutes = ['/registro', '/mayoristas', '/registro_finalizado', '/recuperar_contraseña', '/restablecer-contraseña' ];

  const showNavBar = !hideNavBarRoutes.includes(location.pathname);

  return (
    <>
      {showNavBar && <NavBar openCart={openCart} />}
      <PreviewCart cartOpen={cartOpen} onClose={closeCart} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/productos/categoria/:category" element={<ProductList />} />
        <Route path="/productos/id/:id" element={<ProductItem openCart={openCart} />} />
        <Route path="/productos" element={<ProductList />} />
        <Route path="/mayoristas" element={<Wholesalers />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/registro_finalizado" element={<SuccessRegister />} />
        <Route path="/recuperar_contraseña" element={<PasswordRecover />} />
        <Route path="/restablecer-contraseña" element={<PasswordRegeneration />} />
        <Route path="/lista_de_precios" element={<PriceList />} />
        <Route path="/mi_cuenta" element={<AccountUser />} />
        <Route path="/mis_pedidos" element={<OrdersUser />} />
        <Route path="/carrito" element={<Cart />} />
        <Route path="/checkout" element={<CheckOut />} />
        <Route path="/galeria" element={<Gallery />} />
        <Route path="/contacto" element={<Contact />}/>
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
      </Routes>
      {showNavBar && <Footer />} {/* Agregar el Footer solo si hay NavBar */}
    </>
  );
}

export default App;
