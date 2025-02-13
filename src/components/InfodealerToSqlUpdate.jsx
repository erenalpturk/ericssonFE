import React, { useState } from 'react';

const InfodealerToSqlUpdate = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');


    function generateInsertStatements(iccidString) {
        const mticidList = iccidString.trim().split('\n');
            const insertValues = mticidList.map(mticid => {
                return `update dsfutil.geodis set dealer_cod=550005 where mticid='${mticid}'`;
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
            <h2>Infodealer to Update Converter</h2>
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

export default InfodealerToSqlUpdate; 