import React, { useState, useEffect } from 'react';
import '../styles/components/GetIccid.css';
import { useAuth } from '../contexts/AuthContext';
import MyIccidList from './MyIccidList';

const tabList = [
  { label: 'Iccid', key: 'iccid' },
  { label: 'Imei', key: 'imei' },
];
const envTabList = [
  { label: 'Fonk', key: 'fonk' },
  { label: 'Reg', key: 'reg' },
  { label: 'Hotfix', key: 'hotfix' },
];

const GetIccid = () => {
  const [tab, setTab] = useState('iccid');
  const [subTab, setSubTab] = useState('fonk');
  const [type, setType] = useState('post');
  const [count, setCount] = useState(1);
  const [output, setOutput] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { baseUrl, user } = useAuth();
  const [imeiParams, setImeiParams] = useState([]);
  const [iccidParams, setIccidParams] = useState([]);
  const [dealer, setDealer] = useState('7101717');
  const [dealerParams, setDealerParams] = useState([]);

  // const typeAndSubTabToOldType = (type, subTab) => {
  //   if (type === 'postpaid' && subTab === 'fonk') {
  //     return 'fonkpos';
  //   } else if (type === 'prepaid' && subTab === 'fonk') {
  //     return 'fonkpre';
  //   } else if (type === 'postpaid' && subTab === 'reg') {
  //     return 'regpos';
  //   } else if (type === 'prepaid' && subTab === 'reg') {
  //     return 'regpre';
  //   } else if (type === 'postpaid' && subTab === 'hotfix') {
  //     return 'hotfixpos';
  //   } else if (type === 'prepaid' && subTab === 'hotfix') {
  //     return 'hotfixpre';
  //   } else if (type === 'dkpostpaid' && subTab === 'fonk') {
  //     return 'fonkdkpos';
  //   } else if (type === 'dkprepaid' && subTab === 'fonk') {
  //     return 'fonkdkpre';
  //   } else if (type === 'dkpostpaid' && subTab === 'reg') {
  //     return 'regdkpos';
  //   } else if (type === 'dkprepaid' && subTab === 'reg') {
  //     return 'regdkpre';
  //   } else {
  //     return null;
  //   }
  // }

  const getDealerParams = async () => {
    try {
      const response = await fetch(`${baseUrl}/iccid/getParams/5`);
      const data = await response.json();
      if (!response.ok || data.error) {
        setError(data.error || 'Bir hata oluştu');
        setDealerParams([]);
      } else {
        setDealerParams(data);
      }
    } catch (err) {
      setError('Bir hata oluştu');
      setDealerParams([]);
    }
  }

  const getImeiParams = async () => {
    try {
      const response = await fetch(`${baseUrl}/iccid/getParams/3`);
      const data = await response.json();
    if (!response.ok || data.error) {
      setError(data.error || 'Bir hata oluştu');
      setOutput([]);
      } else {
        setImeiParams(data);
      }
    } catch (err) {
      setError('Bir hata oluştu');
      setOutput([]);
    }
  }

  const getIccidParams = async () => {
    try {
      const response = await fetch(`${baseUrl}/iccid/getParams/4`);
      const data = await response.json();
      if (!response.ok || data.error) {
        setError(data.error || 'Bir hata oluştu');
        setIccidParams([]);
      } else {
        setIccidParams(data);
      }
    } catch (err) {
      setError('Bir hata oluştu');
      setIccidParams([]);
    }
  }


  const getIccidCountByDealer = async () => {
    try {
      const response = await fetch(`${baseUrl}/iccid/iccidCountByDealer`);
      const data = await response.json();
      if (!response.ok || data.error) {
        setError(data.error || 'Bir hata oluştu');
        // setIccidParams([]);
      } else {
        console.log(data)
      }
    } catch (err) {
      setError('Bir hata oluştu');
      // setIccidParams([]);
    }
  }


  useEffect(() => {
    getImeiParams();
    getIccidParams();
    getDealerParams();
    getIccidCountByDealer();
  }, []);

  // const handleClaim = async () => {
  //   let oldType = typeAndSubTabToOldType(type, subTab);
  //   setLoading(true);
  //   setError('');
  //   setOutput([]);
  //   try {
  //     const response = await fetch(`${baseUrl}/iccid/getIccid/${oldType}/${user.sicil_no}/${count}`, {
  //       method: 'POST'
  //     });
  //     const data = await response.json();
  //     if (!response.ok || data.error) {
  //       setError(data.error || 'Bir hata oluştu');
  //       setOutput([]);
  //     } else {
  //       if (data.iccid) {
  //         setOutput([data.iccid]);
  //       } else if (Array.isArray(data)) {
  //         setOutput(data.map(d => d.iccid));
  //       } else {
  //         setOutput([]);
  //       }
  //     }
  //   } catch (err) {
  //     setError('Sunucu hatası');
  //     setOutput([]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleNewClaim = async () => {
    //console.log(subTab, type, dealer, user.sicil_no, count);
    if (dealer === '') {
      setError('Dealer seçilmedi');
      setOutput([]);
      return;
    } else if (type === '') {
      setError('Tip seçilmedi');
      setOutput([]);
      return;
    } else if (count === 0) {
      setError('Sayı seçilmedi');
      setOutput([]);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${baseUrl}/iccid/newgetIccid/${subTab}/${type}/${dealer}/${user.sicil_no}/${count}`, {
        method: 'POST'
      });
      const data = await response.json();
      if (!response.ok || data.error) {
        setError(data.error || 'Bir hata oluştu');
        setOutput([]);
      } else {
        setOutput(data.map(d => d.iccid));
        setError('');
      }
    } catch (err) {
      setError('Sunucu hatası');
      setOutput([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pageWrapper">
      <div className="card">
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
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start', marginBottom: '24px' }}>
          {envTabList.map(st => (
            <div key={st.key} style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '12px' }}>
              <button
                className={subTab === st.key ? "subTab selected" : "subTab"}
                onClick={() => {
                  setSubTab(st.key);
                }}
                type="button"
              >
                {st.label}
              </button>
              {subTab === st.key && (
                <div className="dealerRow">
                  {dealerParams
                    .filter(dl => dl.extra_field1 === subTab || dl.extra_field1 === 'all')
                    .map(dl => (
                      <button
                        key={dl.id}
                        className={dealer === dl.value ? "dealerBtn selected" : "dealerBtn"}
                        onClick={() => setDealer(dl.value)}
                        type="button"
                      >
                        {dl.name}
                      </button>
                    ))}
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="contentRow">
          {/* Type */}
          <div className="typeCol">
            <div className="typeList">
              {(tab === 'iccid' ? iccidParams : imeiParams).map(tp => (
                <button
                  key={tp.id}
                  className={type === tp.value ? "typeBtn selected" : "typeBtn"}
                  onClick={() => {
                    setType(tp.value);
                  }}
                  type="button"
                >
                  {tp.name}
                </button>
              ))}
            </div>
          </div>
          {/* Count */}
          <div className="countCol">
            <div className="countInputRow-modern">
              <button
                className="countStepBtn"
                type="button"
                onClick={() => setCount(prev => Math.max(1, prev - 1))}
                aria-label="Azalt"
                disabled={loading}
              >-</button>
              <input
                // type="number"
                min={1}
                max={10}
                value={count}
                onChange={e => {
                  const val = Number(e.target.value);
                  if (val >= 1 && val <= 10) setCount(val);
                }}
                className="countInput-modern"
                disabled={loading}
              />
              <button
                className="countStepBtn"
                type="button"
                onClick={() => setCount(prev => Math.min(10, prev + 1))}
                aria-label="Arttır"
                disabled={loading}
              >+</button>
            </div>
            {/* <button className="countBtn-modern" onClick={handleClaim} disabled={loading}>
              {loading ? 'Alınıyor...' : 'Claim'}
            </button> */}
            <button className="countBtn-modern" onClick={handleNewClaim} disabled={loading}>
              {loading ? 'Alınıyor...' : 'Claim'}
            </button>
            {error && <div style={{ color: '#e11d48', marginTop: 8, fontSize: '0.98rem' }}>{error}</div>}
          </div>
          {/* Output */}
          <div className="outputCol">
            <div className="outputBox-modern">
              {output.length === 0 ? (
                <div className="outputPlaceholder">Henüz bir çıktı yok.</div>
              ) : (
                output.map((o, i) => (
                  <div className="outputRow" key={i}>
                    <span>{o}</span>
                    <button
                      className="outputCopyBtn"
                      title="Kopyala"
                      onClick={() => navigator.clipboard.writeText(o)}
                      type="button"
                    >📋</button>
                  </div>
                ))
              )}
            </div>
            <div className="outputBtnRow-modern">
              <button
                className="actionBtn-modern"
                type="button"
                onClick={() => navigator.clipboard.writeText(output.join('\n'))}
              >
                Tümünü Kopyala
              </button>
            </div>
          </div>
        </div>
      </div>
      <MyIccidList output={output} />
    </div>
  );
};

export default GetIccid;
