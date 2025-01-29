import React, { useState } from 'react';

const IccidToSql = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');

    const handleConvert = () => {
        // Girdiyi satırlara böl ve boş satırları temizle
        const iccids = input
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);

        // SQL sorgusu formatına çevir
        const sqlQuery = `SELECT * FROM dsfutil.geodis WHERE mticid IN (${
            iccids
                .map(iccid => `'${iccid}'`)
                .join(',\n')
        })`;

        setOutput(sqlQuery);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(output);
    };

    return (
        <div className="container mt-4">
            <h2>ICCID to SQL Converter</h2>
            <div className="row">
                <div className="col-md-6">
                    <div className="form-group">
                        <label>ICCID Listesi:</label>
                        <textarea
                            className="form-control"
                            rows="10"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Her satıra bir ICCID gelecek şekilde yapıştırın..."
                        />
                    </div>
                    <button className="btn btn-primary mt-2" onClick={handleConvert}>
                        Dönüştür
                    </button>
                </div>
                <div className="col-md-6">
                    <div className="form-group">
                        <label>SQL Sorgusu:</label>
                        <textarea
                            className="form-control"
                            rows="10"
                            value={output}
                            readOnly
                        />
                    </div>
                    <button className="btn btn-secondary mt-2" onClick={handleCopy}>
                        Kopyala
                    </button>
                </div>
            </div>
        </div>
    );
};

export default IccidToSql; 