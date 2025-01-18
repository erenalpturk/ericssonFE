import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import SmsDecrypt from './components/SmsDecrypt'
import PostpaidActivation from './components/DkIlerletme/PostpaidActivation'

function App() {
    return (
        <Router>
            <div className="min-vh-100 bg-light">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/sms-decrypt" element={<SmsDecrypt />} />
                    <Route path="/postpaid-activation" element={<PostpaidActivation environment="regresyon" />} />
                </Routes>
            </div>
        </Router>
    )
}

export default App