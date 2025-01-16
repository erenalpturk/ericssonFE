function ApiLogger({ logs }) {
    return (
        <div className="api-logger mt-4">
            <h6 className="mb-3">API İşlem Sırası:</h6>
            <div className="border rounded p-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {logs.map((log, index) => (
                    <div key={index} className="mb-2 d-flex align-items-center">
                        <span className="badge bg-secondary me-2">{index + 1}</span>
                        <span>{log}</span>
                    </div>
                ))}
                {logs.length === 0 && (
                    <div className="text-muted text-center">
                        Henüz API isteği yapılmadı
                    </div>
                )}
            </div>
        </div>
    )
}

export default ApiLogger 