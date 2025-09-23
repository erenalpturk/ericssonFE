import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Layout from './components/Layout'
import Home from './components/Home'
import Login from './components/Login'
import SmsDecrypt from './components/SmsDecrypt'
import SqlCreate from './components/SqlCreate'
import InfodealerToSql from './components/InfodealerToSql'
import SelfybestInsertSql from './components/SelfybestInsertSql'
import InfodealerToSqlUpdate from './components/InfodealerToSqlUpdate'
import AddIccids from './components/AddIccids'
import CourierActions from './components/CourierActions'
import WorkflowBuilder from './components/automation/WorkflowBuilder'
import SingleApiTester from './components/automation/SingleApiTester'
import MyIccidList from './components/MyIccidList'
import SerialNumberManagement from './components/SerialNumberManagement'
import ActivationList from './components/ActivationList'
import ChangePassword from './components/ChangePassword'
import Stats from './components/Stats'
import UserFeedbackList from './components/UserFeedbackList'
import AdminFeedbackPanel from './components/AdminFeedbackPanel'
import NotificationCreator from './components/Admin/NotificationCreator'
import AdminPanel from './components/AdminPanel'
import Scriptler from './components/Scriptler'
import Contacts from './components/Contacts'

function PrivateRoute({ children }) {
    const { user, loading, needsPasswordChange } = useAuth();

    if (loading) {
        return <div>Yükleniyor...</div>;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (needsPasswordChange) {
        return <Navigate to="/change-password" />;
    }

    return children;
}

function AppRoutes() {
    const [apiLogs, setApiLogs] = useState([])

    const handleApiCall = (message) => {
        const timestamp = new Date().toLocaleTimeString()
        setApiLogs(prev => [...prev, { timestamp, message, type: 'info' }])
    }

    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/change-password" element={<ChangePassword />} />
                <Route
                    path="/"
                    element={
                        <PrivateRoute>
                            <Layout>
                                <Home />
                            </Layout>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/sms-decrypt"
                    element={
                        <PrivateRoute>
                            <Layout>
                                <SmsDecrypt />
                            </Layout>
                        </PrivateRoute>
                    }
                />
                {/* <Route
                    path="/postpaid-activation"
                    element={
                        <PrivateRoute>
                            <Layout>
                                <PostpaidActivation
                                    environment="regresyon"
                                    onApiCall={handleApiCall}
                                />
                            </Layout>
                        </PrivateRoute>
                    }
                /> */}
                <Route
                    path="/sql-create"
                    element={
                        <PrivateRoute>
                            <Layout>
                                <SqlCreate />
                            </Layout>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/infodealer-to-sql"
                    element={
                        <PrivateRoute>
                            <Layout>
                                <InfodealerToSql />
                            </Layout>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/infodealer-to-sql-update"
                    element={
                        <PrivateRoute>
                            <Layout>
                                <InfodealerToSqlUpdate />
                            </Layout>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/selfybest-insert-sql"
                    element={
                        <PrivateRoute>
                            <Layout>
                                <SelfybestInsertSql />
                            </Layout>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/iccid-management"
                    element={
                        <PrivateRoute>
                            <Layout>
                                <AddIccids />
                            </Layout>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/serial-number-management"
                    element={
                        <PrivateRoute>
                            <Layout>
                                <SerialNumberManagement />
                            </Layout>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/activation-list"
                    element={
                        <PrivateRoute>
                            <Layout>
                                <ActivationList />
                            </Layout>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/courier-actions"
                    element={
                        <PrivateRoute>
                            <Layout>
                                <CourierActions onApiCall={handleApiCall} />
                            </Layout>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/api-automation"
                    element={
                        <PrivateRoute>
                            <Layout>
                                <WorkflowBuilder />
                            </Layout>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/api-tester"
                    element={
                        <PrivateRoute>
                            <Layout>
                                <SingleApiTester />
                            </Layout>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/stats"
                    element={
                        <PrivateRoute>
                            <Layout>
                                <Stats />
                            </Layout>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/feedback"
                    element={
                        <PrivateRoute>
                            <Layout>
                                <UserFeedbackList />
                            </Layout>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/admin/feedback"
                    element={
                        <PrivateRoute>
                            <Layout>
                                <AdminFeedbackPanel />
                            </Layout>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/admin/notifications"
                    element={
                        <PrivateRoute>
                            <Layout>
                                <NotificationCreator />
                            </Layout>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/admin-panel"
                    element={
                        <PrivateRoute>
                            <Layout>
                                <AdminPanel />
                            </Layout>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/bilgi-merkezi/scriptler"
                    element={
                        <PrivateRoute>
                            <Layout>
                                <Scriptler />
                            </Layout>
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/bilgi-merkezi/kontak-bilgileri"
                    element={
                        <PrivateRoute>
                            <Layout>
                                <Contacts />
                            </Layout>
                        </PrivateRoute>
                    }
                />
            </Routes>
            {apiLogs.length > 0 && (
                <div className="position-fixed bottom-0 end-0 p-3" style={{maxHeight: '300px', overflowY: 'auto', width: '300px', zIndex: 1050}}>
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
        </Router>
    )
}

function App() {
    return (
        <AuthProvider>
            <AppRoutes />
            <Toaster
                position="bottom-right"
                toastOptions={{
                    duration: 2000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                        fontSize: '14px',
                        fontWeight: '500'
                    },
                    success: {
                        style: {
                            background: '#22c55e',
                        },
                    },
                    error: {
                        style: {
                            background: '#ef4444',
                        },
                    },
                    loading: {
                        style: {
                            background: '#3b82f6',
                        },
                    },
                }}
            />
        </AuthProvider>
    )
}

export default App