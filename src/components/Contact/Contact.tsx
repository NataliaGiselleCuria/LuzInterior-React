
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useApi } from '../../context/ApiProvider'
import 'react-lazy-load-image-component/src/effects/blur.css';

const Contact = () => {

    const { dev, companyInfo, social } = useApi()

    const getCompanyInfoValue = (key: string) => {
        const info = companyInfo.find(item => item.key === key);
        return info ? info.value : 'No disponible';
    };

    const mapIframe = companyInfo.find(info => info.key === 'map')?.value || '';

    return (
        <div className="cont container">
            <h2>Contacto</h2>
            <div className="contact-info">
                <div className="info-item">
                    <h4>Email:</h4>
                    <p>{getCompanyInfoValue('email')}</p>
                </div>
                <div className="info-item">
                    <h4>Teléfono:</h4>
                    <p>{getCompanyInfoValue('tel')}</p>
                </div>
                <div className="info-item">
                    <h4>Dirección:</h4>
                    <p>{getCompanyInfoValue('store_address')}</p>
                </div>
                <div className="info-item">
                   <h4>Nuestras Redes:</h4>
                   {social.map((item) => (
                    <a href={item.url} key={item.id}><LazyLoadImage src={`${dev}/${item.img_social}`} alt={item.id}></LazyLoadImage></a>
                   ))}
                </div>
            </div>
            <div className="map-container">
                <div dangerouslySetInnerHTML={{ __html: mapIframe }} />
            </div>
        </div>
    );
};



export default Contact
