import React, { useState } from 'react';
import '../styles/components/GetIccid.css';

const tabList = [
  { label: 'Iccid', key: 'iccid' },
  { label: 'Imei', key: 'imei' },
];
const subTabList = [
  { label: 'Fonk', key: 'fonk' },
  { label: 'Reg', key: 'reg' },
  { label: 'Hotfix', key: 'hotfix' },
];
const typeList = [
  { label: 'Postpaid', key: 'postpaid' },
  { label: 'Prepaid', key: 'prepaid' },
  { label: 'Dk Postpaid', key: 'dkpostpaid' },
  { label: 'DK Prepaid', key: 'dkprepaid' },
];

const GetIccid = () => {
  const [tab, setTab] = useState('iccid');
  const [subTab, setSubTab] = useState('');
  const [type, setType] = useState('');
  const [count, setCount] = useState(1);
  const [checked, setChecked] = useState(true);
  const [output, setOutput] = useState([1123123,1231232,322312]);

  return (
    <div className="pageWrapper">
      <div className="card">
        <h1 className="title">Seri No Al</h1>
        <div className="tabRow">
          {tabList.map(t => (
            <button
              key={t.key}
              className={tab === t.key ? "tab selected" : "tab"}
              onClick={() => setTab(t.key)}
              type="button"
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="subTabRow">
          {subTabList.map(st => (
            <button
              key={st.key}
              className={subTab === st.key ? "subTab selected" : "subTab"}
              onClick={() => setSubTab(st.key)}
              type="button"
            >
              {st.label}
            </button>
          ))}
        </div>
        <div className="contentRow">
          {/* Type */}
          <div className="typeCol">
            <div className="sectionTitle">Type</div>
            <div className="typeList">
              {typeList.map(tp => (
                <button
                  key={tp.key}
                  className={type === tp.key ? "typeBtn selected" : "typeBtn"}
                  onClick={() => setType(tp.key)}
                  type="button"
                >
                  {tp.label}
                </button>
              ))}
            </div>
          </div>
          {/* Count */}
          <div className="countCol">
            <div className="sectionTitle">Count</div>
            <div className="countInputRow">
              <input
                type="number"
                min={1}
                max={10}
                value={count}
                onChange={e => setCount(Number(e.target.value))}
                className="countInput"
              />
            </div>
          </div>
          <div className="countCol">
            <div className="countInputRow">
              <button className="countBtn">Claim</button>
            </div>
          </div>
          {/* Output */}
          <div className="outputCol">
            <div className="sectionTitle">Output</div>
            <div className="outputBox">
              {output.map((o, i) => (
                <div key={i}>{o}</div>
              ))}
            </div>
            <div className="outputBtnRow">
              <button className="actionBtn" type="button">iade et</button>
              <button className="actionBtn" type="button">Copy</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetIccid;
