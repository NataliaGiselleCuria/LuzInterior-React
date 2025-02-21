
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

            <div className='row contact-cont'>
                <div className="contact-info col-md-5">
                    <span className='back'></span>
                    <div className="title-page">
                        <h1>Contactanos</h1>
                        <span className="line"></span>
                    </div>
                    <div className="info-item">
                        <h4>Email:</h4>
                        <a href={`mailto:${getCompanyInfoValue('email')}`}>
                            {getCompanyInfoValue('email')}
                        </a>
                    </div>
                    <div className="info-item">
                        <h4>Teléfono:</h4>
                        <a href={`https://wa.me/${getCompanyInfoValue('tel')?.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                            {getCompanyInfoValue('tel')}
                        </a>
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
                <div className="map-container col-md-6">
                    <div dangerouslySetInnerHTML={{ __html: mapIframe }} />
                </div>
            </div>

        </div>
    );
};



export default Contact
