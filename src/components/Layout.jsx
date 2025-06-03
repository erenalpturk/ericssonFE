import { useState } from 'react'
import Sidebar from './Sidebar'

function Layout({ children }) {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

    return (
        <div className="h-screen relative">
            <Sidebar 
                isCollapsed={isSidebarCollapsed} 
                onToggle={setIsSidebarCollapsed} 
            />
            <div className={`main-content ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
                {children}
            </div>
        </div>
    )
}

export default Layout 