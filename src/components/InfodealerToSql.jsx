import React, { useState } from 'react';

const InfodealerToSql = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [isConverting, setIsConverting] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);

    function generateInsertStatements(iccidString) {
        const mticidList = iccidString.trim().split('\n');
        const insertValues = mticidList.map(mticid => {
            return `INSERT INTO dsfutil.geodis (MTDTMU, C1NLIV, MTART, MTSN, MTICID, MTNTEL, REC_DATE, GE_RO, DEALER_COD, INSERT_COD) VALUES
        ('23.03.10', '0080278379', '113864', null, '${mticid}', null, TO_DATE('24-MAR-10 00:00:00', 'DD-MON-RR HH24:MI:SS'), 'GE', '550005', '51712')`;
        });
        const fullInsertStatement = `${insertValues.join(';\n')};`;
        setOutput(fullInsertStatement);
    }

    const handleConvert = async () => {
        if (!input.trim()) return;
        
        setIsConverting(true);
        // Simulate processing time for better UX
        await new Promise(resolve => setTimeout(resolve, 500));
        generateInsertStatements(input);
        setIsConverting(false);
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(output);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
            console.error('Kopyalama başarısız:', err);
        }
    };

    const handleClear = () => {
        setInput('');
        setOutput('');
    };

    const inputCount = input.trim() ? input.trim().split('\n').filter(line => line.trim()).length : 0;

    return (
        <div className="modern-page">
            {/* Header Section */}
            <div className="page-header">
                <div className="header-content">
                    <div className="header-icon">
                        <i className="bi bi-database-add text-emerald-500"></i>
                    </div>
                    <div className="header-text">
                        <h1>Infodealer Insert Generator</h1>
                        <p>ICCID listesini SQL insert sorgularına dönüştürün</p>
                    </div>
                </div>
                <div className="stats-badge">
                    <i className="bi bi-list-ol"></i>
                    <span>{inputCount} ICCID</span>
                </div>
            </div>

            {/* Main Content */}
            <div className="content-grid">
                {/* Input Section */}
                <div className="input-card">
                    <div className="card-header">
                        <div className="card-title">
                            <i className="bi bi-card-list text-blue-500"></i>
                            <span>ICCID Listesi</span>
                        </div>
                        <div className="card-actions">
                            <button 
                                className="action-btn secondary"
                                onClick={handleClear}
                                disabled={!input.trim()}
                            >
                                <i className="bi bi-trash"></i>
                                Temizle
                            </button>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="form-group">
                            <textarea
                                className="modern-textarea"
                                rows="12"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Her satıra bir ICCID gelecek şekilde yapıştırın...&#10;&#10;Örnek:&#10;1234567890123456789&#10;9876543210987654321&#10;5555555555555555555"
                            />
                        </div>
                        <button 
                            className={`convert-btn ${isConverting ? 'loading' : ''}`}
                            onClick={handleConvert}
                            disabled={!input.trim() || isConverting}
                        >
                            {isConverting ? (
                                <>
                                    <i className="bi bi-arrow-repeat spin"></i>
                                    Dönüştürülüyor...
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-arrow-right-circle"></i>
                                    SQL'e Dönüştür
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Output Section */}
                <div className="output-card">
                    <div className="card-header">
                        <div className="card-title">
                            <i className="bi bi-code-square text-purple-500"></i>
                            <span>SQL Sorguları</span>
                        </div>
                        <div className="card-actions">
                            <button 
                                className={`action-btn ${copySuccess ? 'success' : 'primary'}`}
                                onClick={handleCopy}
                                disabled={!output.trim()}
                            >
                                {copySuccess ? (
                                    <>
                                        <i className="bi bi-check-circle"></i>
                                        Kopyalandı!
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-clipboard"></i>
                                        Kopyala
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="form-group">
                            <textarea
                                className="modern-textarea output"
                                rows="12"
                                value={output}
                                readOnly
                                placeholder="SQL sorguları burada görünecek..."
                            />
                        </div>
                        {output && (
                            <div className="output-info">
                                <div className="info-item">
                                    <i className="bi bi-info-circle text-cyan-500"></i>
                                    <span>{output.split(';').length - 1} adet INSERT sorgusu oluşturuldu</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Help Section */}
            <div className="help-card">
                <div className="help-header">
                    <i className="bi bi-question-circle text-orange-500"></i>
                    <span>Nasıl Kullanılır?</span>
                </div>
                <div className="help-content">
                    <div className="help-steps">
                        <div className="help-step">
                            <span className="step-number">1</span>
                            <span>ICCID listesini sol tarafa yapıştırın (her satıra bir ICCID)</span>
                        </div>
                        <div className="help-step">
                            <span className="step-number">2</span>
                            <span>"SQL'e Dönüştür" butonuna tıklayın</span>
                        </div>
                        <div className="help-step">
                            <span className="step-number">3</span>
                            <span>Oluşan SQL sorgularını sağ taraftan kopyalayın</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InfodealerToSql; 