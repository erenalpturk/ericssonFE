import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import Home from './components/Home'
import SmsDecrypt from './components/SmsDecrypt'
import PostpaidActivation from './components/DkIlerletme/PostpaidActivation'
import IccidToSql from './components/IccidToSql'
import InfodealerToSql from './components/InfodealerToSql'
import SelfybestInsertSql from './components/SelfybestInsertSql'
import InfodealerToSqlUpdate from './components/InfodealerToSqlUpdate'
import CudbFeed from './components/CudbFeed'
import IccidManagement from './components/IccidManagement';
import CourierActions from './components/CourierActions';


function App() {
    const [apiLogs, setApiLogs] = useState([])

    const handleApiCall = (message) => {
        const timestamp = new Date().toLocaleTimeString()
        setApiLogs(prev => [...prev, { timestamp, message, type: 'info' }])
    }

    return (
        <Router>
            <div className="min-vh-100 bg-light">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/sms-decrypt" element={<SmsDecrypt />} />
                    <Route 
                        path="/postpaid-activation" 
                        element={
                            <PostpaidActivation 
                                environment="regresyon" 
                                onApiCall={handleApiCall}
                            />
                        } 
                    />
                    <Route path="/iccid-to-sql" element={<IccidToSql />} />
                    <Route path="/infodealer-to-sql" element={<InfodealerToSql />} />
                    <Route path="/infodealer-to-sql-update" element={<InfodealerToSqlUpdate />} />
                    <Route path="/selfybest-insert-sql" element={<SelfybestInsertSql />} />
                    <Route path="/cudb-feed" element={<CudbFeed />} />
                    <Route path="/iccid-management" element={<IccidManagement />} />
                    <Route path="/courier-actions" element={<CourierActions onApiCall={handleApiCall} />} />
                </Routes>
                {apiLogs.length > 0 && (
                    <div className="position-fixed bottom-0 end-0 p-3" style={{maxHeight: '300px', overflowY: 'auto', width: '300px'}}>
                        <div className="card">
                            <div className="card-header d-flex justify-content-between align-items-center">
                                <h6 className="mb-0">API Çağrıları</h6>
                                <button 
                                    className="btn btn-sm btn-outline-secondary"
                                    onClick={() => setApiLogs([])}
                                >
                                    <i className="bi bi-trash"></i>
                                </button>
                            </div>
                            <div className="card-body">
                                {apiLogs.map((log, index) => (
                                    <div key={index} className="mb-2 small">
                                        <span className="text-muted">{log.timestamp}</span>
                                        <br />
                                        {log.message}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Router>
    )
}

export default App