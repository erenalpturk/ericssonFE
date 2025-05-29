import { useState } from 'react';
import axios from 'axios';

function CudbFeed() {
    const [msisdn, setMsisdn] = useState('');
    const [coId, setCoId] = useState('');
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [env, setEnv] = useState('fonk'); // ortam seçimi için state

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const currentDate = new Date();
        const tid = `YukseLTEST0${currentDate.getFullYear()}${String(currentDate.getMonth() + 1).padStart(2, '0')}${String(currentDate.getDate()).padStart(2, '0')}${String(currentDate.getHours()).padStart(2, '0')}${String(currentDate.getMinutes()).padStart(2, '0')}${String(currentDate.getSeconds()).padStart(2, '0')}`;

        const xmlBody = `<?xml version="1.0" encoding="UTF-8"?>\n<IWIS_IN_DATA_UNIT>\n<IWIS_IN_HEADER version="1.0">\n<SYSTEM>BSCS</SYSTEM>\n<SERVICE>BPM_GNL_CUDB_FEED</SERVICE>\n<TID>${tid}</TID>\n</IWIS_IN_HEADER>\n<IWIS_SERVICE_PARAMS>\n<XML>\n<sch:CUDBFeedingProcessRequest xmlns:sch="avea/bpm/schemas">\n<TYPE>1</TYPE>\n<SYSTEM>BSCS</SYSTEM>\n<MSISDN>${msisdn}</MSISDN>\n<CO_ID>${coId}</CO_ID>\n</sch:CUDBFeedingProcessRequest>\n</XML>\n</IWIS_SERVICE_PARAMS>\n</IWIS_IN_DATA_UNIT>`;

        // Ortama göre URL seçimi
        const url = env === 'fonk'
            ? 'http://10.248.68.188/WEB/IWIS'
            : 'http://10.248.68.161/WEB/IWIS';

        try {
            const result = await axios.post(url, xmlBody, {
                headers: {
                    'Content-Type': 'application/xml'
                }
            });
            setResponse(result.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">CUDB Feed</h2>
            <div className="row">
                <div className="col-md-6">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="env" className="form-label">Ortam</label>
                            <select
                                id="env"
                                className="form-select"
                                value={env}
                                onChange={e => setEnv(e.target.value)}
                            >
                                <option value="fonk">FONK</option>
                                <option value="reg">REG</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="msisdn" className="form-label">MSISDN</label>
                            <input
                                type="text"
                                className="form-control"
                                id="msisdn"
                                value={msisdn}
                                onChange={(e) => setMsisdn(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="coId" className="form-label">CO ID</label>
                            <input
                                type="text"
                                className="form-control"
                                id="coId"
                                value={coId}
                                onChange={(e) => setCoId(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'İşlem Yapılıyor...' : 'Gönder'}
                        </button>
                    </form>
                </div>
                <div className="col-md-6">
                    {error && (
                        <div className="alert alert-danger">
                            Hata: {error}
                        </div>
                    )}
                    {response && (
                        <div className="alert alert-success">
                            <h5>Yanıt:</h5>
                            <pre className="mb-0">{JSON.stringify(response, null, 2)}</pre>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CudbFeed; 