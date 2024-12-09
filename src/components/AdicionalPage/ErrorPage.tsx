import { Link, useLocation } from "react-router-dom"


const ErrorPage = () => {

    const location = useLocation();
    const message = location.state?.message || 'Algo salió mal';

  return (
    <div>
      <h1>ERROR</h1>
      <h2>{message}</h2>
      <p>Lo sentimos, no pudimos encontrar lo que buscabas.</p>
      <Link to="/">Volver al inicio</Link>
    </div>
  )
}

export default ErrorPage
