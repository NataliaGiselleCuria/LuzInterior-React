import logo from "../../assets/alt_logo.png"

const SpinnerLoading = () => {
    return (
        <div className='loading'>
            <div className='spinner-cont'>
                <div className='spinner'>                   
                </div>
                <img src={logo} alt="logo luz interior" className="spinner-img"></img>
            </div>
        </div>
    )
}

export default SpinnerLoading;