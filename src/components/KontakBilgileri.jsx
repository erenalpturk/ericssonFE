import React from 'react';

const KontakBilgileri = () => {
    return (
        <div className="container-fluid py-4">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow-lg border-0">
                        <div className="card-header bg-primary text-white text-center py-4">
                            <h2 className="mb-0">
                                <i className="bi bi-person-lines-fill me-2"></i>
                                Kontak Bilgileri
                            </h2>
                        </div>
                        <div className="card-body p-5">
                            <div className="text-center text-muted">
                                <i className="bi bi-tools display-1 mb-3"></i>
                                <h4>Bu sayfa henüz geliştirilme aşamasında</h4>
                                <p className="lead">
                                    Kontak bilgileri yakında burada görüntülenecek.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KontakBilgileri; 