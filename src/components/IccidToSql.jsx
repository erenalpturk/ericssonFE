import React, { useState } from 'react';

const IccidToSql = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [table, setTable] = useState('geodis');
    const [column, setColumn] = useState('mticid');
    const [schema, setSchema] = useState('dsfutil');
    const [isConverting, setIsConverting] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);

    const handleConvert = async () => {
        if (!input.trim()) return;
        
        setIsConverting(true);
        // Simulate processing time for better UX
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Girdiyi satırlara böl ve boş satırları temizle
        const iccids = input
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);

        const sqlQuery = `SELECT * FROM ${schema}.${table} WHERE ${column} IN (${
            iccids
                .map(iccid => `'${iccid}'`)
                .join(',\n')
        })`;

        setOutput(sqlQuery);
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
        setSchema('dsfutil');
        setTable('geodis');
        setColumn('mticid');
    };

    const handlePreset = (presetName) => {
        switch(presetName) {
            case 'geodis':
                setSchema('dsfutil');
                setTable('geodis');
                setColumn('mticid');
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
                        <i className="bi bi-database-fill text-emerald-500"></i>
                    </div>
                    <div className="header-text">
                        <h1>ICCID to SQL Query</h1>
                        <p>ICCID listesini SQL SELECT sorgusuna dönüştürün</p>
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
                        <span>SQL Konfigürasyonu</span>
                    </div>
                    <div className="preset-buttons">
                        <button 
                            className="preset-btn"
                            onClick={() => handlePreset('geodis')}
                            title="dsfutil.geodis.mticid"
                        >
                            Geodis
                        </button>
                    </div>
                </div>
                <div className="card-body">
                    <div className="config-grid">
                        <div className="config-item">
                            <label className="config-label">
                                <i className="bi bi-hdd text-blue-500"></i>
                                Schema
                            </label>
                            <input
                                type="text"
                                className="config-input"
                                value={schema}
                                onChange={(e) => setSchema(e.target.value)}
                                placeholder="dsfutil"
                            />
                        </div>
                        <div className="config-item">
                            <label className="config-label">
                                <i className="bi bi-table text-green-500"></i>
                                Table
                            </label>
                            <input
                                type="text"
                                className="config-input"
                                value={table}
                                onChange={(e) => setTable(e.target.value)}
                                placeholder="geodis"
                            />
                        </div>
                        <div className="config-item">
                            <label className="config-label">
                                <i className="bi bi-columns text-orange-500"></i>
                                Column
                            </label>
                            <input
                                type="text"
                                className="config-input"
                                value={column}
                                onChange={(e) => setColumn(e.target.value)}
                                placeholder="mticid"
                            />
                        </div>
                    </div>
                    <div className="query-preview">
                        <span className="preview-label">Preview:</span>
                        <code className="preview-text">
                            SELECT * FROM {schema}.{table} WHERE {column} IN (...)
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
                            disabled={!input.trim() || isConverting || !schema || !table || !column}
                        >
                            {isConverting ? (
                                <>
                                    <i className="bi bi-arrow-repeat spin"></i>
                                    SQL Oluşturuluyor...
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-arrow-right-circle"></i>
                                    SQL Oluştur
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
                            <span>SQL Sorgusu</span>
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
                                placeholder="SQL sorgusu burada görünecek..."
                            />
                        </div>
                        {output && (
                            <div className="output-info">
                                <div className="info-item">
                                    <i className="bi bi-info-circle text-cyan-500"></i>
                                    <span>Schema: {schema} | Table: {table} | Column: {column}</span>
                                </div>
                                <div className="info-item">
                                    <i className="bi bi-search text-green-500"></i>
                                    <span>{inputCount} ICCID için sorgu oluşturuldu</span>
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
                            <span>Schema, Table ve Column değerlerini ayarlayın veya hazır presetlerden birini seçin</span>
                        </div>
                        <div className="help-step">
                            <span className="step-number">2</span>
                            <span>ICCID listesini sol tarafa yapıştırın (her satıra bir ICCID)</span>
                        </div>
                        <div className="help-step">
                            <span className="step-number">3</span>
                            <span>"SQL Oluştur" butonuna tıklayın</span>
                        </div>
                        <div className="help-step">
                            <span className="step-number">4</span>
                            <span>Oluşan SQL sorgusunu sağ taraftan kopyalayın</span>
                        </div>
                    </div>
                    <div className="help-note">
                        <div className="note-header">
                            <i className="bi bi-lightbulb text-yellow-500"></i>
                            <span>İpucu</span>
                        </div>
                        <p>Hazır presetler ile yaygın kullanılan tablo konfigürasyonlarına hızlıca geçiş yapabilirsiniz.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IccidToSql; 