import { LazyLoadImage } from "react-lazy-load-image-component";
import { useApi } from "../../context/ApiProvider";
import { Link } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import logo from "../../assets/alt_logo.png"
import watsapp from "../../assets/whatsapp.png"
import email from "../../assets/email.png"
import location from "../../assets/location.png"

const Footer = () => {

  const { dev, social, companyInfo } = useApi();
  const { isLogin } = useUser();

  const getCompanyInfoValue = (key: string) => {
    const info = companyInfo.find(item => item.key === key);
    return info ? info.value : 'No disponible';
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="row justify-content-between">
          <div className="col-lg d-flex justify-content-center">
            <div className="item-cont nav">
              <Link to="/">Inicio</Link>
              <Link to="/productos">Productos</Link>
              <Link to="/galeria">Galería</Link>
              <Link to="/contacto">Contacto</Link>
              {isLogin && <Link to="/lista_de_precios">Lista de precios</Link>}
            </div>
          </div>
          <div className="col-lg d-flex justify-content-center">
            <div className="item-cont info-company">
              <span>
                <img src={email} alt="email icono"></img>
                <a href={`mailto:${getCompanyInfoValue('email')}`} aria-label='Enviar un email a Luz interior'>
                  {getCompanyInfoValue('email')}
                </a>
              </span>
              <span>
                <img src={watsapp} alt="watsapp icono"></img>
                <a href={`https://wa.me/${getCompanyInfoValue('tel')?.replace(/\D/g, '')}`} aria-label='Enviar un whatsapp a Luz interior' target="_blank" rel="noopener noreferrer">
                  {getCompanyInfoValue('tel')}
                </a>
              </span>
              <span>
                <img src={location} alt="locación icono"></img>
                <p>{getCompanyInfoValue('store_address')}</p>
              </span>
            </div>
          </div>
          <div className="col-lg d-flex">
            <div className="item-cont social">
              {social.map((item) => (
                <a href={item.url} key={item.id} aria-label={`Visitar la red social ${item.id} de Luz interior`}><LazyLoadImage src={`${dev}/${item.img_social}`} alt={item.id}></LazyLoadImage></a>
              ))}
            </div>
          </div>
        </div>
        <div className="footer-copy">
                <span>
                  <img src={logo} alt="logo"></img>
                </span>
                <span>
                  <p>Copyright © 2025 <span className="fw-medium">Luz Interior</span>.</p>
                  <p><span className="fw-medium"><a href="https://nataliacuria-dev.netlify.app/" aria-label="Pagina personal de Natalia Curia - Desarrollo web">Natalia Curia</a></span> | Desarrollo Web</p>
                </span>
              </div>
      </div>
    </footer>
  );
};

export default Footer;