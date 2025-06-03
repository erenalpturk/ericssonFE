import React, { useState } from 'react';

const SelfybestInsertSql = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [tcId, setTcId] = useState('12345678901');
    const [technoportId, setTechnoportId] = useState('184124');
    const [id, setId] = useState('6007250');
    const [status, setStatus] = useState('5');
    const [isConverting, setIsConverting] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);

    //  INSERT INTO unicorn.YOUTH_TARIFF_INFO (TC_ID, MSISDN, TECHNOPORT_ID, ID, STATUS, CR_DATE, CR_USER, UPD_DATE, UPD_USER, BIRTH_DATE, AGE, LINE_TYPE, TID) 
    //  VALUES ('12345678901', '5052389924', 184124, 6007250, 5, SYSDATE, 'DSFBPM', SYSDATE, 'DATA_FIX', null, null, null, null);

    function generateInsertStatements(msisdnString) {
        const msisdnList = msisdnString.trim().split('\n').filter(line => line.trim());
        const insertStatements = msisdnList.map(msisdn => {
            return `INSERT INTO unicorn.YOUTH_TARIFF_INFO (TC_ID, MSISDN, TECHNOPORT_ID, ID, STATUS, CR_DATE, CR_USER, UPD_DATE, UPD_USER, BIRTH_DATE, AGE, LINE_TYPE, TID) VALUES ('${tcId}', '${msisdn.trim()}', ${technoportId}, ${id}, ${status}, SYSDATE, 'DSFBPM', SYSDATE, 'DATA_FIX', null, null, null, null)`;
        });
        const fullInsertStatement = `${insertStatements.join(';\n')};`;
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
        setTcId('12345678901');
        setTechnoportId('184124');
        setId('6007250');
        setStatus('5');
    };

    const handlePreset = (preset) => {
        switch(preset) {
            case 'youth_default':
                setTcId('12345678901');
                setTechnoportId('184124');
                setId('6007250');
                setStatus('5');
                break;
            case 'youth_active':
                setTcId('12345678901');
                setTechnoportId('184124');
                setId('6007251');
                setStatus('1');
                break;
            case 'youth_inactive':
                setTcId('12345678901');
                setTechnoportId('184124');
                setId('6007252');
                setStatus('0');
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
                        <i className="bi bi-plus-circle-fill text-cyan-500"></i>
                    </div>
                    <div className="header-text">
                        <h1>Selfybest INSERT Tool</h1>
                        <p>MSISDN listesi için youth tariff bilgileri oluşturun</p>
                    </div>
                </div>
                <div className="stats-badge">
                    <i className="bi bi-telephone-fill"></i>
                    <span>{inputCount} MSISDN</span>
                </div>
            </div>

            {/* Main Content */}
            <div className="content-grid">
                {/* Input Section */}
                <div className="input-card">
                    <div className="card-header">
                        <div className="card-title">
                            <i className="bi bi-telephone text-blue-500"></i>
                            <span>MSISDN Listesi</span>
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
                                placeholder="Her satıra bir MSISDN gelecek şekilde yapıştırın...&#10;&#10;Örnek:&#10;5052389924&#10;5052389925&#10;5052389926"
                            />
                        </div>
                        <button 
                            className={`convert-btn ${isConverting ? 'loading' : ''}`}
                            onClick={handleConvert}
                            disabled={!input.trim() || isConverting || !tcId.trim() || !technoportId.trim() || !id.trim() || !status.trim()}
                        >
                            {isConverting ? (
                                <>
                                    <i className="bi bi-arrow-repeat spin"></i>
                                    SQL Oluşturuluyor...
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-plus-circle"></i>
                                    INSERT Sorguları Oluştur
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
                            <span>INSERT Sorguları</span>
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
                                placeholder="INSERT sorguları burada görünecek..."
                            />
                        </div>
                        {output && (
                            <div className="output-info">
                                <div className="info-item">
                                    <i className="bi bi-info-circle text-cyan-500"></i>
                                    <span>Hedef: unicorn.YOUTH_TARIFF_INFO | TC ID: {tcId}</span>
                                </div>
                                <div className="info-item">
                                    <i className="bi bi-plus-circle text-green-500"></i>
                                    <span>{inputCount} MSISDN için INSERT sorgusu oluşturuldu</span>
                                </div>
                                <div className="info-item">
                                    <i className="bi bi-gear text-purple-500"></i>
                                    <span>Status: {status} | Technoport: {technoportId} | ID: {id}</span>
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
                            <span>Youth tariff parametrelerini ayarlayın veya hazır presetlerden birini seçin</span>
                        </div>
                        <div className="help-step">
                            <span className="step-number">2</span>
                            <span>MSISDN listesini sol tarafa yapıştırın (her satıra bir MSISDN)</span>
                        </div>
                        <div className="help-step">
                            <span className="step-number">3</span>
                            <span>"INSERT Sorguları Oluştur" butonuna tıklayın</span>
                        </div>
                        <div className="help-step">
                            <span className="step-number">4</span>
                            <span>Oluşan INSERT sorgularını sağ taraftan kopyalayın</span>
                        </div>
                    </div>
                    <div className="help-note">
                        <div className="note-header">
                            <i className="bi bi-lightbulb text-yellow-500"></i>
                            <span>İpucu</span>
                        </div>
                        <p>Youth tariff bilgileri için yaygın kullanılan konfigürasyonlar hazır presetler olarak sunulmuştur. Otomatik olarak SYSDATE ve sabit değerler atanır.</p>
                    </div>
                    <div className="help-warning">
                        <div className="warning-header">
                            <i className="bi bi-exclamation-triangle text-red-500"></i>
                            <span>Dikkat</span>
                        </div>
                        <p>Bu sorgular unicorn.YOUTH_TARIFF_INFO tablosuna yeni kayıtlar ekler. Çalıştırmadan önce mutlaka test ortamında deneyin ve duplicate key kontrolü yapın.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SelfybestInsertSql; 