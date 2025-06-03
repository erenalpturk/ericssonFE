import React, { useState } from 'react';

const InfodealerToSqlUpdate = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [dealerCode, setDealerCode] = useState('550005');
    const [isConverting, setIsConverting] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);

    function generateUpdateStatements(iccidString) {
        const mticidList = iccidString.trim().split('\n').filter(line => line.trim());
        const updateStatements = mticidList.map(mticid => {
            return `UPDATE dsfutil.geodis SET dealer_cod=${dealerCode} WHERE mticid='${mticid.trim()}'`;
        });
        const fullUpdateStatement = `${updateStatements.join(';\n')};`;
        setOutput(fullUpdateStatement);
    }

    const handleConvert = async () => {
        if (!input.trim()) return;
        
        setIsConverting(true);
        // Simulate processing time for better UX
        await new Promise(resolve => setTimeout(resolve, 500));
        
        generateUpdateStatements(input);
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
        setDealerCode('550005');
    };

    const handlePreset = (preset) => {
        switch(preset) {
            case 'infodealer':
                setDealerCode('550005');
                break;
            default:
                break;
        }
    };

    const inputCount = input.trim() ? input.trim().split('\n').filter(line => line.trim()).length : 0;

    return (
        <div className="modern-page">
            {/* Header Section */}
            <div className="page-header">
                <div className="header-content">
                    <div className="header-icon">
                        <i className="bi bi-arrow-repeat text-orange-500"></i>
                    </div>
                    <div className="header-text">
                        <h1>Dealer Code Update Tool</h1>
                        <p>ICCID listesi için dealer kodu güncelleme sorguları oluşturun</p>
                    </div>
                </div>
                <div className="stats-badge">
                    <i className="bi bi-list-ol"></i>
                    <span>{inputCount} ICCID</span>
                </div>
            </div>

            {/* Configuration Section */}
            <div className="config-card">
                <div className="card-header">
                    <div className="card-title">
                        <i className="bi bi-gear-fill text-purple-500"></i>
                        <span>Dealer Konfigürasyonu</span>
                    </div>
                    <div className="preset-buttons">
                        <button 
                            className="preset-btn"
                            onClick={() => handlePreset('infodealer')}
                            title="Infodealer - 550005"
                        >
                            Infodealer
                        </button>
                    </div>
                </div>
                <div className="card-body">
                    <div className="config-grid">
                        <div className="config-item">
                            <label className="config-label">
                                <i className="bi bi-building text-blue-500"></i>
                                Dealer Kodu
                            </label>
                            <input
                                type="text"
                                className="config-input"
                                value={dealerCode}
                                onChange={(e) => setDealerCode(e.target.value)}
                                placeholder="550005"
                            />
                        </div>
                    </div>
                    <div className="query-preview">
                        <span className="preview-label">Preview:</span>
                        <code className="preview-text">
                            UPDATE dsfutil.geodis SET dealer_cod={dealerCode} WHERE mticid='...'
                        </code>
                    </div>
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
                                disabled={!input.trim() && !output}
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
                                rows="14"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Her satıra bir ICCID gelecek şekilde yapıştırın...&#10;&#10;Örnek:&#10;8990011234567890123&#10;8990011234567890124&#10;8990011234567890125"
                            />
                        </div>
                        <button 
                            className={`convert-btn ${isConverting ? 'loading' : ''}`}
                            onClick={handleConvert}
                            disabled={!input.trim() || isConverting || !dealerCode.trim()}
                        >
                            {isConverting ? (
                                <>
                                    <i className="bi bi-arrow-repeat spin"></i>
                                    SQL Oluşturuluyor...
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-arrow-up-circle"></i>
                                    UPDATE Sorguları Oluştur
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
                            <span>UPDATE Sorguları</span>
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
                                rows="14"
                                value={output}
                                readOnly
                                placeholder="UPDATE sorguları burada görünecek..."
                            />
                        </div>
                        {output && (
                            <div className="output-info">
                                <div className="info-item">
                                    <i className="bi bi-info-circle text-cyan-500"></i>
                                    <span>Hedef: dsfutil.geodis | Dealer Kodu: {dealerCode}</span>
                                </div>
                                <div className="info-item">
                                    <i className="bi bi-arrow-repeat text-orange-500"></i>
                                    <span>{inputCount} ICCID için UPDATE sorgusu oluşturuldu</span>
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
                            <span>Dealer kodunu manuel olarak girin veya hazır presetlerden birini seçin</span>
                        </div>
                        <div className="help-step">
                            <span className="step-number">2</span>
                            <span>ICCID listesini sol tarafa yapıştırın (her satıra bir ICCID)</span>
                        </div>
                        <div className="help-step">
                            <span className="step-number">3</span>
                            <span>"UPDATE Sorguları Oluştur" butonuna tıklayın</span>
                        </div>
                        <div className="help-step">
                            <span className="step-number">4</span>
                            <span>Oluşan UPDATE sorgularını sağ taraftan kopyalayın</span>
                        </div>
                    </div>
                    <div className="help-note">
                        <div className="note-header">
                            <i className="bi bi-lightbulb text-yellow-500"></i>
                            <span>İpucu</span>
                        </div>
                        <p>Yaygın kullanılan operatör dealer kodları için hazır presetler mevcuttur. Her UPDATE sorgusu ayrı bir satırda oluşturulur ve noktalı virgülle ayrılır.</p>
                    </div>
                    <div className="help-warning">
                        <div className="warning-header">
                            <i className="bi bi-exclamation-triangle text-red-500"></i>
                            <span>Dikkat</span>
                        </div>
                        <p>Bu sorgular veritabanında değişiklik yapar. Çalıştırmadan önce mutlaka test ortamında deneyin ve yedek alın.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InfodealerToSqlUpdate; 