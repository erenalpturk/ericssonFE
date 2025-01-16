import { useState } from 'react'

function EsimDk({ environment }) {
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState(null)
    const [error, setError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        // API işlemleri burada yapılacak
        // environment değişkeni kullanılabilir
        console.log('Seçili ortam:', environment)
    }

    return (
        <div>
            <h5 className="mb-3">Esim DK ile Teslim</h5>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="tid" className="form-label">TID:</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="tid" 
                        name="tid"
                        placeholder="TID giriniz"
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="customerOrder" className="form-label">Customer Order:</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="customerOrder" 
                        name="customerOrder"
                        placeholder="Customer Order giriniz"
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
                        'İlerlet'
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

export default EsimDk 