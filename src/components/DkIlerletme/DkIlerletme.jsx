import { useState } from 'react'
import EsimDk from './EsimDk'
import FizikselDk from './FizikselDk'
import EsimKimlik from './FizikselKimlik'
import ApiLogger from './ApiLogger'

function DkIlerletme() {
    const [activeTab, setActiveTab] = useState('esimDk')
    const [environment, setEnvironment] = useState('regresyon')
    const [apiLogs, setApiLogs] = useState([])

    const addApiLog = (logMessage) => {
        setApiLogs(prev => [...prev, logMessage])
    }

    return (
        <div className="container">
            <div className="card">
                <div className="card-header text-center">
                    <h3 className="mb-0">DK İlerletme</h3>
                </div>
                <div className="card-body">
                    <div className="environment-selector mb-4">
                        <label className="form-label">Ortam Seçimi:</label>
                        <div className="d-flex gap-4">
                            <div className="form-check">
                                <input
                                    type="radio"
                                    className="form-check-input"
                                    id="regresyon"
                                    name="environment"
                                    value="regresyon"
                                    checked={environment === 'regresyon'}
                                    onChange={(e) => setEnvironment(e.target.value)}
                                />
                                <label className="form-check-label" htmlFor="regresyon">
                                    Regresyon
                                </label>
                            </div>
                            <div className="form-check">
                                <input
                                    type="radio"
                                    className="form-check-input"
                                    id="fonksiyonel"
                                    name="environment"
                                    value="fonksiyonel"
                                    checked={environment === 'fonksiyonel'}
                                    onChange={(e) => setEnvironment(e.target.value)}
                                />
                                <label className="form-check-label" htmlFor="fonksiyonel">
                                    Fonksiyonel
                                </label>
                            </div>
                        </div>
                    </div>

                    <ul className="nav nav-tabs mb-4">
                        <li className="nav-item">
                            <button 
                                className={`nav-link ${activeTab === 'esimDk' ? 'active' : ''}`}
                                onClick={() => setActiveTab('esimDk')}
                            >
                                Esim DK ile Teslim
                            </button>
                        </li>
                        <li className="nav-item">
                            <button 
                                className={`nav-link ${activeTab === 'fizikselDk' ? 'active' : ''}`}
                                onClick={() => setActiveTab('fizikselDk')}
                            >
                                Fiziksel Sim DK ile Teslim
                            </button>
                        </li>
                        <li className="nav-item">
                            <button 
                                className={`nav-link ${activeTab === 'esimKimlik' ? 'active' : ''}`}
                                onClick={() => setActiveTab('esimKimlik')}
                            >
                                Fiziksel Sim ile Kimlik Doğrulama
                            </button>
                        </li>
                    </ul>

                    {activeTab === 'esimDk' && <EsimDk environment={environment} onApiCall={addApiLog} />}
                    {activeTab === 'fizikselDk' && <FizikselDk environment={environment} onApiCall={addApiLog} />}
                    {activeTab === 'esimKimlik' && <EsimKimlik environment={environment} onApiCall={addApiLog} />}

                    <ApiLogger logs={apiLogs} />
                </div>
            </div>
        </div>
    )
}

export default DkIlerletme 