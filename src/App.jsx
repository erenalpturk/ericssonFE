import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './components/Home'
import SmsDecrypt from './components/SmsDecrypt'
import DkIlerletme from './components/DkIlerletme/DkIlerletme'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './style.css'

function App() {
    return (
        <Router>
            <div>
                <Navbar />
                <main className="py-4">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/sms-decrypt" element={<SmsDecrypt />} />
                        <Route path="/dk-ilerletme" element={<DkIlerletme />} />
                    </Routes>
                </main>
            </div>
        </Router>
    )
}

export default App 