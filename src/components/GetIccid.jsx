import React, { useState, useEffect } from 'react';
import '../styles/components/GetIccid.css';
import { useAuth } from '../contexts/AuthContext';
import MyIccidList from './MyIccidList';

const tabList = [
  { label: 'Iccid', key: 'iccid', icon: 'bi-credit-card-2-front', isActive: true },
  { label: 'Imei', key: 'imei', icon: 'bi-phone', isActive: false },
];
const envTabList = [
  { label: 'Fonk', key: 'fonk', icon: 'bi-gear' },
  { label: 'Reg', key: 'reg', icon: 'bi-server' },
  { label: 'Hotfix', key: 'hotfix', icon: 'bi-lightning' },
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
  const [dealer, setDealer] = useState('');
  const [dealerName, setDealerName] = useState('');
  const [dealerParams, setDealerParams] = useState([]);
  const [dealerCounts, setDealerCounts] = useState([]); // { dealer, pre, post, total }
  const [typeCounts, setTypeCounts] = useState({ pre: 0, post: 0 });

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
      } else {
        setDealerCounts(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      setError('Bir hata oluştu');
    }
  }

  useEffect(() => {
    getImeiParams();
    getIccidParams();
    getDealerParams();
    getIccidCountByDealer();
  }, []);

  // Dealer veya sayımlar değiştiğinde typeCounts'ı güncelle
  useEffect(() => {
    if (dealer) {
      const item = dealerCounts.find(d => String(d.dealer) === String(dealer));
      setTypeCounts({ pre: item?.pre || 0, post: item?.post || 0 });
    } else {
      const pre = dealerCounts.reduce((sum, d) => sum + (d.pre || 0), 0);
      const post = dealerCounts.reduce((sum, d) => sum + (d.post || 0), 0);
      setTypeCounts({ pre, post });
    }
  }, [dealer, dealerCounts]);

  const handleNewClaim = async () => {
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
        // Başarılı claim sonrası sayımları tazele
        getIccidCountByDealer();
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
              disabled={!t.isActive}
              style={{ opacity: t.isActive ? 1 : 0.5, cursor: t.isActive ? 'pointer' : 'not-allowed' }}
            >
              <i className={`bi ${t.icon}`}></i>
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
                  setDealerName('');
                  setDealer('');
                }}
                type="button"
              >
                <i className={`bi ${st.icon}`}></i>
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
                        onClick={() => {setDealer(dl.value); setDealerName(dl.name)}}
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
            <div className="infoBar">
              <div className="infoItem">
                <i className="bi bi-building"></i>
                <span className="infoValue">{dealerName || 'Seçilmedi'}</span>
              </div>
              <div className="divider"></div>
              <div className="infoItem">
                <i className="bi bi-layers"></i>
                <span className="infoValue">{subTab}</span>
              </div>
              <div className="divider"></div>
              <div className="infoItem">
                <i className="bi bi-sim"></i>
                <span className={`infoBadge ${type === 'post' ? 'post' : 'pre'}`}>{type === 'post' ? 'Postpaid' : 'Prepaid'}</span>
              </div>
            </div>
            <div className="typeList">
              {(tab === 'iccid' ? iccidParams : imeiParams).map(tp => (
                <button
                  key={tp.id}
                  className={type === tp.value ? "typeBtn selected" : "typeBtn"}
                  onClick={() => {
                    setType(tp.value);
                  }}
                  type="button"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', padding: '10px 14px', borderRadius: '12px' }}
                >
                  <span style={{ fontWeight: 600 }}>{tp.name}</span>
                  {tab === 'iccid' && (() => {
                    const isPost = (tp.value || '').toLowerCase() === 'post';
                    const countValue = typeCounts[(tp.value || '').toLowerCase()] || 0;
                    const badgeStyle = {
                      background: isPost ? '#ece9ff' : '#e6fffb',
                      color: isPost ? '#4338ca' : '#0f766e',
                      borderRadius: '9999px',
                      padding: '4px 10px',
                      fontSize: '12px',
                      fontWeight: 800,
                      lineHeight: 1,
                      minWidth: '36px',
                      textAlign: 'center',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                      border: '1px solid rgba(0,0,0,0.06)'
                    };
                    return (
                      <span className="typeCountBadge" style={badgeStyle}>
                        {countValue}
                      </span>
                    );
                  })()}
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
              >
                <i className="bi bi-dash"></i>
              </button>
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
              >
                <i className="bi bi-plus"></i>
              </button>
            </div>
            {/* <button className="countBtn-modern" onClick={handleClaim} disabled={loading}>
              {loading ? 'Alınıyor...' : 'Claim'}
            </button> */}
            <button className="countBtn-modern" onClick={handleNewClaim} disabled={loading}>
              <i className="bi bi-download"></i>
              {loading ? 'Alınıyor...' : 'Al'}
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
                    >
                      <i className="bi bi-clipboard"></i>
                    </button>
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
                <i className="bi bi-clipboard-check"></i>
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
