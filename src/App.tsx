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
import ErrorPage from './components/ErrorPage/ErrorPage';
import PriceList from './components/PriceList/PriceList';
import PasswordRegeneration from './components/UserPages/PasswordRegeneration';
import AccountUser from './components/UserPages/AccountUser';
import OrdersUser from './components/UserPages/OrdersUser';
import CheckOut from './components/Cart&Order/CheckOut';
import AdminRoute from './components/Admin/AdminRoute';
import Gallery from './components/Galery/Gallery';
import Contact from './components/Contact/Contact';
import Footer from './components/Footer/Footer';
import { useUser } from './context/UserContext';
import { AdminPanel } from './components/Admin/AdminPanel';
import SpinnerLoading from './components/Tools/SpinnerLoading';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import ConfirmationOrder from './components/Cart&Order/ConfirmationOrder';
import { useApi } from './context/ApiProvider';


function App() {
  const {getUserActive} = useApi();
  const { checkToken } = useUser();
  const [loading, setLoading] = useState(true); 
  const [cartOpen, setCartOpen] = useState(false);
  const openCart = () => setCartOpen(true);
  const closeCart = () => setCartOpen(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('user_token');
    const email = localStorage.getItem('email');

    if (token && email) {
      checkToken(token, navigate).finally(() => setLoading(false)); 
      getUserActive(token, email)
      
    } else {
      setLoading(false);
    }
  }, [checkToken]);

  if (loading) {
    return <SpinnerLoading/>;
  }

  return (  
      <Routes>
        <Route
          path="/*"
          element={
            <AppWithNavBar openCart={openCart} cartOpen={cartOpen} closeCart={closeCart} setLoading={setLoading} />
          }
        />
      </Routes>  
  );
}

function AppWithNavBar({ openCart, cartOpen, closeCart, setLoading}: any) {
  const location = useLocation();
  const hideNavBarRoutes = [
    '/registro', 
    '/login', 
    '/registro_finalizado', 
    '/recuperar_contrasea', 
    '/restablecer_contrasenia', 
    '/checkout' ,
    '/confirmacion'
  ];

  const showNavBar = !hideNavBarRoutes.includes(location.pathname);

  return (
    <>
      {showNavBar && <NavBar openCart={openCart} />}
      <PreviewCart cartOpen={cartOpen} onClose={closeCart} />
      <Routes>
        <Route path="/" element={<Home setLoading={setLoading}/>} />
        <Route path="/productos/categoria/:category" element={<ProductList openCart={openCart}/>} />
        <Route path="/productos/id/:id" element={<ProductItem openCart={openCart} />} />
        <Route path="/productos" element={<ProductList openCart={openCart}/>} />
        <Route path="/login" element={<Wholesalers />} />
        <Route path="/restablecer_contrasenia" element={<PasswordRegeneration />} />
        <Route path="/lista_de_precios" element={<PriceList />} />
        <Route path="/mi_cuenta" element={<AccountUser />} />
        <Route path="/mis_pedidos" element={<OrdersUser />} />
        <Route path="/carrito" element={<Cart />} />
        <Route path="/checkout" element={<CheckOut />} />
        <Route path='/confirmacion' element={<ConfirmationOrder />} />
        <Route path="/galeria" element={<Gallery />} />
        <Route path="/contacto" element={<Contact />}/>
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
        <Route path="*" element={<ErrorPage />} />

      </Routes>
      {showNavBar && <Footer />} {/* Agregar el Footer solo si hay NavBar */}
    </>
  );
}

export default App;
