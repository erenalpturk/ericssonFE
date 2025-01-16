import { Link } from 'react-router-dom'

function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <Link className="navbar-brand" to="/">Araçlar</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="nav-link" to="/sms-decrypt">SMS Decrypt</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/dk-ilerletme">DK İlerletme</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/postpaid-activation">Postpaid Activation</Link>
                            
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Navbar 