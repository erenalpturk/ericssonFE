import { Link } from 'react-router-dom'

function Home() {
    return (
        <div className="container min-vh-100 d-flex flex-column justify-content-center align-items-center">
            <div className="text-center mb-5">
                <h1 className="display-4 mb-3">Hoş Geldiniz!</h1>
                <p className="lead text-muted">OMNI Test Team Otomasyon Araçları</p>
            </div>
            
            <div className="row g-4 justify-content-center" style={{ maxWidth: '900px' }}>
                <div className="col-12 col-md-4">
                    <Link to="/sms-decrypt" className="text-decoration-none">
                        <div className="card h-100 shadow-sm hover-shadow transition">
                            <div className="card-body text-center p-5">
                                <i className="bi bi-shield-lock-fill display-1 mb-3 text-primary"></i>
                                <h3 className="card-title">SMS Decrypt</h3>
                                <p className="card-text text-muted">
                                    SMS şifre çözme aracı
                                </p>
                            </div>
                        </div>
                    </Link>
                </div>
                
                <div className="col-12 col-md-4">
                    <div className="card h-100 shadow-sm bg-light">
                        <div className="card-body text-center p-5 position-relative">
                            <div className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" 
                                 style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}>
                                <span className="badge bg-warning px-3 py-2">
                                    <i className="bi bi-gear-fill me-2"></i>
                                    Yapım Aşamasında
                                </span>
                            </div>
                            <i className="bi bi-phone-fill display-1 mb-3 text-secondary"></i>
                            <h3 className="card-title">Postpaid Activation</h3>
                            <p className="card-text text-muted">
                                Hat aktivasyon otomasyonu
                            </p>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-md-4">
                    <Link to="/iccid-to-sql" className="text-decoration-none">
                        <div className="card h-100 shadow-sm hover-shadow transition">
                            <div className="card-body text-center p-5">
                                <i className="bi bi-database-fill display-1 mb-3 text-success"></i>
                                <h3 className="card-title">ICCID to SQL</h3>
                                <p className="card-text text-muted">
                                    ICCID listesini SQL sorgusuna dönüştürür
                                </p>
                            </div>
                        </div>
                    </Link>
                </div>
                <div className="col-12 col-md-4">
                    <Link to="/infodealer-to-sql" className="text-decoration-none">
                        <div className="card h-100 shadow-sm hover-shadow transition">
                            <div className="card-body text-center p-5">
                                <i className="bi bi-database-fill display-1 mb-3 text-success"></i>
                                <h3 className="card-title">Infodealer Insert</h3>
                                <p className="card-text text-muted">
                                    Infodealer için toplu INSERT sorgusu oluşturur
                                </p>
                            </div>
                        </div>
                    </Link>
                </div>
                <div className="col-12 col-md-4">
                    <Link to="/infodealer-to-sql-update" className="text-decoration-none">
                        <div className="card h-100 shadow-sm hover-shadow transition">
                            <div className="card-body text-center p-5">
                                <i className="bi bi-database-fill display-1 mb-3 text-success"></i>
                                <h3 className="card-title">Infodealer Update</h3>
                                <p className="card-text text-muted">
                                    Infodealer için toplu UPDATE sorgusu oluşturur
                                </p>
                            </div>
                        </div>
                    </Link>
                </div>
                <div className="col-12 col-md-4">
                    <Link to="/selfybest-insert-sql" className="text-decoration-none">
                        <div className="card h-100 shadow-sm hover-shadow transition">
                            <div className="card-body text-center p-5">
                                <i className="bi bi-database-fill display-1 mb-3 text-success"></i>
                                <h3 className="card-title">Selfybest Insert</h3>
                                <p className="card-text text-muted">
                                    Selfybest için toplu INSERT sorgusu oluşturur
                                </p>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Home