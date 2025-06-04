import React, { useState } from 'react';
import '../styles/components/IccidToSql.css';
const IccidToSql = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [table, setTable] = useState('geodis');
    const [column, setColumn] = useState('mticid');
    const [schema, setSchema] = useState('dsfutil');
    const [queryType, setQueryType] = useState('SELECT');
    const [isConverting, setIsConverting] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);
    const [updateValues, setUpdateValues] = useState('');
    const [insertColumns, setInsertColumns] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState('');

    const templates = {
        infodealer_insert: {
            name: 'Infodealer Insert',
            description: 'Infodealer için geodis tablosuna insert sorgusu',
            queryType: 'INSERT',
            schema: 'dsfutil',
            table: 'geodis',
            insertColumns: 'MTDTMU, C1NLIV, MTART, MTSN, MTICID, MTNTEL, REC_DATE, GE_RO, DEALER_COD, INSERT_COD',
            values: (value) => `('23.03.10', '0080278379', '113864', null, '${value}', null, TO_DATE('24-MAR-10 00:00:00', 'DD-MON-RR HH24:MI:SS'), 'GE', '550005', '51712')`
        },
        infodealer_update: {
            name: 'Infodealer Update',
            description: 'Infodealer dealer kodu güncelleme sorgusu',
            queryType: 'UPDATE',
            schema: 'dsfutil',
            table: 'geodis',
            column: 'mticid',
            updateValues: 'dealer_cod=550005'
        },
        youth_tariff_insert: {
            name: 'Youth Tariff Insert',
            description: 'Selfybest youth tariff bilgileri için insert sorgusu',
            queryType: 'INSERT',
            schema: 'unicorn',
            table: 'YOUTH_TARIFF_INFO',
            insertColumns: 'TC_ID, MSISDN, TECHNOPORT_ID, ID, STATUS, CR_DATE, CR_USER, UPD_DATE, UPD_USER, BIRTH_DATE, AGE, LINE_TYPE, TID',
            values: (value) => `('12345678901', '${value}', 184124, 6007250, 5, SYSDATE, 'DSFBPM', SYSDATE, 'DATA_FIX', null, null, null, null)`
        }
    };

    const handleTemplateSelect = (templateKey) => {
        const template = templates[templateKey];
        if (template) {
            setSelectedTemplate(templateKey);
            setQueryType(template.queryType);
            setSchema(template.schema);
            setTable(template.table);
            if (template.column) setColumn(template.column);
            if (template.insertColumns) setInsertColumns(template.insertColumns);
            if (template.updateValues) setUpdateValues(template.updateValues);
        }
    };

    const handleConvert = async () => {
        if (!input.trim()) return;
        
        setIsConverting(true);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const values = input
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);

        let sqlQuery = '';
        
        if (selectedTemplate && templates[selectedTemplate]) {
            const template = templates[selectedTemplate];
            if (template.queryType === 'INSERT') {
                sqlQuery = values.map(value => 
                    `INSERT INTO ${template.schema}.${template.table} (${template.insertColumns}) VALUES ${template.values(value)}`
                ).join(';\n') + ';';
            } else {
                sqlQuery = values.map(value => 
                    `UPDATE ${template.schema}.${template.table} SET ${template.updateValues} WHERE ${template.column}='${value}'`
                ).join(';\n') + ';';
            }
        } else {
            switch(queryType) {
                case 'SELECT':
                    sqlQuery = `SELECT * FROM ${schema}.${table} WHERE ${column} IN (${
                        values.map(value => `'${value}'`).join(',\n')
                    })`;
                    break;
                case 'DELETE':
                    sqlQuery = `DELETE FROM ${schema}.${table} WHERE ${column} IN (${
                        values.map(value => `'${value}'`).join(',\n')
                    })`;
                    break;
                case 'UPDATE':
                    if (!updateValues.trim()) {
                        alert('Lütfen güncellenecek değerleri girin');
                        setIsConverting(false);
                        return;
                    }
                    sqlQuery = `UPDATE ${schema}.${table} SET ${updateValues} WHERE ${column} IN (${
                        values.map(value => `'${value}'`).join(',\n')
                    })`;
                    break;
                case 'INSERT':
                    if (!insertColumns.trim()) {
                        alert('Lütfen eklenecek kolonları girin');
                        setIsConverting(false);
                        return;
                    }
                    const columns = insertColumns.split(',').map(col => col.trim());
                    sqlQuery = `INSERT INTO ${schema}.${table} (${columns.join(', ')}) VALUES\n${
                        values.map(value => `('${value}')`).join(',\n')
                    }`;
                    break;
                default:
                    sqlQuery = '';
            }
        }

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
        setQueryType('SELECT');
        setUpdateValues('');
        setInsertColumns('');
        setSelectedTemplate('');
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
                            {table}
                        </button>
                    </div>
                </div>
                <div className="card-body">
                    <div className="template-section">
                        <label className="config-label">
                            <i className="bi bi-file-earmark-text text-indigo-500"></i>
                            Hazır Şablonlar
                        </label>
                        <div className="template-grid">
                            {Object.entries(templates).map(([key, template]) => (
                                <button
                                    key={key}
                                    className={`template-btn ${selectedTemplate === key ? 'active' : ''}`}
                                    onClick={() => handleTemplateSelect(key)}
                                    title={template.description}
                                >
                                    <i className="bi bi-file-earmark-text"></i>
                                    {template.name}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="config-grid">
                        <div className="config-item">
                            <label className="config-label">
                                <i className="bi bi-code-square text-red-500"></i>
                                Sorgu Tipi
                            </label>
                            <select
                                className="config-input"
                                value={queryType}
                                onChange={(e) => setQueryType(e.target.value)}
                            >
                                <option value="SELECT">SELECT</option>
                                <option value="INSERT">INSERT</option>
                                <option value="UPDATE">UPDATE</option>
                                <option value="DELETE">DELETE</option>
                            </select>
                        </div>
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
                        {queryType === 'UPDATE' && (
                            <div className="config-item full-width">
                                <label className="config-label">
                                    <i className="bi bi-pencil-square text-yellow-500"></i>
                                    Güncellenecek Değerler
                                </label>
                                <input
                                    type="text"
                                    className="config-input"
                                    value={updateValues}
                                    onChange={(e) => setUpdateValues(e.target.value)}
                                    placeholder="column1 = 'value1', column2 = 'value2'"
                                />
                            </div>
                        )}
                        {queryType === 'INSERT' && (
                            <div className="config-item full-width">
                                <label className="config-label">
                                    <i className="bi bi-list-columns text-cyan-500"></i>
                                    Eklenecek Kolonlar
                                </label>
                                <input
                                    type="text"
                                    className="config-input"
                                    value={insertColumns}
                                    onChange={(e) => setInsertColumns(e.target.value)}
                                    placeholder="column1, column2, column3"
                                />
                            </div>
                        )}
                    </div>
                    <div className="query-preview">
                        <span className="preview-label">Preview:</span>
                        <code className="preview-text">
                            {selectedTemplate ? 
                                `${templates[selectedTemplate].queryType} ${templates[selectedTemplate].queryType === 'SELECT' ? '*' : ''} FROM ${templates[selectedTemplate].schema}.${templates[selectedTemplate].table} ${templates[selectedTemplate].queryType === 'INSERT' ? `(${templates[selectedTemplate].insertColumns}) VALUES (...)` : `SET ${templates[selectedTemplate].updateValues} WHERE ${templates[selectedTemplate].column}='...'`}` :
                                `${queryType} ${queryType === 'SELECT' ? '*' : ''} FROM ${schema}.${table} ${queryType === 'SELECT' || queryType === 'DELETE' || queryType === 'UPDATE' ? ` WHERE ${column} IN (...)` : queryType === 'INSERT' ? ` (${insertColumns || '...'}) VALUES (...)` : ''}`
                            }
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