import React, { useState } from 'react';

const SelfybestInsertSql = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');

    //  INSERT INTO unicorn.YOUTH_TARIFF_INFO (TC_ID, MSISDN, TECHNOPORT_ID, ID, STATUS, CR_DATE, CR_USER, UPD_DATE, UPD_USER, BIRTH_DATE, AGE, LINE_TYPE, TID) 
    //  VALUES ('12345678901', '5052389924', 184124, 6007250, 5, SYSDATE, 'DSFBPM', SYSDATE, 'DATA_FIX', null, null, null, null);

    function generateInsertStatements(iccidString) {
        const mticidList = iccidString.trim().split('\n');
        const insertValues = mticidList.map(mticid => {
            return `INSERT INTO unicorn.YOUTH_TARIFF_INFO (TC_ID, MSISDN, TECHNOPORT_ID, ID, STATUS, CR_DATE, CR_USER, UPD_DATE, UPD_USER, BIRTH_DATE, AGE, LINE_TYPE, TID) VALUES ('12345678901', '${mticid}', 184124, 6007250, 5, SYSDATE, 'DSFBPM', SYSDATE, 'DATA_FIX', null, null, null, null)`;
        });
        const fullInsertStatement = `${insertValues.join(';\n')};`;
        setOutput(fullInsertStatement);
    }

    const handleConvert = () => {
        generateInsertStatements(input);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(output);
    };

    return (
        <div className="container mt-4">
            <h2>Selfybest Insert Converter</h2>
            <div className="row">
                <div className="col-md-6">
                    <div className="form-group">
                        <label>Msisdn Listesi:</label>
                        <textarea
                            className="form-control"
                            rows="10"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Her satıra bir msisdn gelecek şekilde yapıştırın..."
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

export default SelfybestInsertSql; 