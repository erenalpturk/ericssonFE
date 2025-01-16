import { Link } from 'react-router-dom'

function Home() {
    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Hoş Geldiniz</h2>
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="list-group">
                        <Link to="/sms-decrypt" className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                            SMS Decrypt
                            <span className="badge bg-primary rounded-pill">→</span>
                        </Link>
                        {/* Diğer sayfalar için linkler buraya eklenecek */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home 