import { useState } from 'react'

function EsimKimlik() {
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState(null)
    const [error, setError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        // API işlemleri burada yapılacak
    }

    return (
        <div>
            <h5 className="mb-3">Esim Kimlik Doğrulama</h5>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="msisdn" className="form-label">MSISDN:</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="msisdn" 
                        placeholder="5XX XXX XX XX"
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="tcKimlik" className="form-label">TC Kimlik No:</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="tcKimlik" 
                        placeholder="TC Kimlik numarasını giriniz"
                    />
                </div>
                <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" /> 
                            İşleniyor...
                        </>
                    ) : (
                        'Doğrula'
                    )}
                </button>
            </form>
            
            {error && (
                <div className="alert alert-danger mt-3">
                    <strong>Hata:</strong> {error}
                </div>
            )}
            
            {result && (
                <div className="alert alert-success mt-3">
                    <strong>Başarılı:</strong> {result}
                </div>
            )}
        </div>
    )
}

export default EsimKimlik 