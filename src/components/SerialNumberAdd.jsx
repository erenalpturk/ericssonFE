import React, { useState, useEffect } from 'react';
import '../styles/components/GetIccid.css';
import { useAuth } from '../contexts/AuthContext';

const tabList = [
  { label: 'Iccid', key: 'iccid' },
  { label: 'Imei', key: 'imei' },
];
const envTabList = [
  { label: 'Fonk', key: 'fonk' },
  { label: 'Reg', key: 'reg' },
  { label: 'Hotfix', key: 'hotfix' },
];
const iccidTypeList = [
  { name: 'Postpaid', id: 'postpaid' },
  { name: 'Prepaid', id: 'prepaid' },
  { name: 'Dk Postpaid', id: 'dkpostpaid' },
  { name: 'DK Prepaid', id: 'dkprepaid' },
];

const SerialNumberAdd = () => {
  const [tab, setTab] = useState('iccid');
  const [subTab, setSubTab] = useState('fonk');
  const [type, setType] = useState('postpaid');
  const [serialInput, setSerialInput] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { baseUrl, user } = useAuth();
  const [imeiParams, setImeiParams] = useState([]);
  const [deviceInput, setDeviceInput] = useState('');


  const typeAndSubTabToOldType = (type, subTab) => {
    if (type === 'postpaid' && subTab === 'fonk') {
      return 'fonkpos';
    } else if (type === 'prepaid' && subTab === 'fonk') {
      return 'fonkpre';
    } else if (type === 'postpaid' && subTab === 'reg') {
      return 'regpos';
    } else if (type === 'prepaid' && subTab === 'reg') {
      return 'regpre';
    } else if (type === 'postpaid' && subTab === 'hotfix') {
      return 'hotfixpos';
    } else if (type === 'prepaid' && subTab === 'hotfix') {
      return 'hotfixpre';
    } else if (type === 'dkpostpaid' && subTab === 'fonk') {
      return 'fonkdkpos';
    } else if (type === 'dkprepaid' && subTab === 'fonk') {
      return 'fonkdkpre';
    } else if (type === 'dkpostpaid' && subTab === 'reg') {
      return 'regdkpos';
    } else if (type === 'dkprepaid' && subTab === 'reg') {
      return 'regdkpre';
    } else {
      return null;
    }
  }

  const handleAddSerialNumber = async () => {
    setError('');
    setSuccess('');
    // Girilen seri numaralarını satırlara böl
    const serialNumbers = serialInput
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0);
    if (serialNumbers.length === 0) {
      setError('En az bir seri numarası giriniz.');
      return;
    }
    try {
      const response = await fetch(`${baseUrl}/iccid/addSerialNumbers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: tab === 'iccid' ? type : 3, // örnek, backend'e göre gerekirse değiştir
          subTab,
          serialNumbers,
          userId: user?.sicil_no || '',
        }),
      });
      const data = await response.json();
      if (!response.ok || data.error) {
        setError(data.error || 'Bir hata oluştu');
      } else {
        setSuccess('Seri numaraları başarıyla eklendi!');
        setSerialInput('');
      }
    } catch (err) {
      setError('Sunucu hatası');
    }
  };

  const getParams = async () => {
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

  const handleAddParams = async () => {
    try {
      const response = await fetch(`${baseUrl}/iccid/addParams`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 3, name: deviceInput, userId: user?.sicil_no || '' }),
      });
      const data = await response.json();
      if (!response.ok || data.error) {
        setError(data.error || 'Bir hata oluştu');
      } else {
        setSuccess('Cihaz başarıyla eklendi!');
        setDeviceInput('');
        getParams();
      }
    } catch (err) {
      setError('Bir hata oluştu');
    }
  };

  const handleDeleteParams = async (value, type) => {
    try {
      const response = await fetch(`${baseUrl}/iccid/deleteParams`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: type, userId: user?.sicil_no, value: value }),
      });
      const data = await response.json();
      if (!response.ok || data.error) {
        setError(data.error || 'Bir hata oluştu');
      } else {
        setSuccess('Cihaz başarıyla silindi!');
      }
    } catch (err) {
      setError('Bir hata oluştu');
    }
  };

  useEffect(() => {
    getParams();
  }, []);

  return (
    <div className="pageWrapper">
      <div className="card">
        <h1 className="title">Seri No Ekle</h1>
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
          {envTabList.map(st => (
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
            <div className="typeList">
              {(tab === 'iccid' ? iccidTypeList : imeiParams).map(tp => (
                <button
                  key={tp.id}
                  className={type === tp.id ? "typeBtn selected" : "typeBtn"}
                  onClick={() => setType(tp.id)}
                  type="button"
                >
                  {tp.name}
                </button>
              ))}
              <>
                <input
                  type="text"
                  placeholder={tab === 'imei' ? 'Yeni cihaz Adı giriniz' : 'Yeni Iccid tipi giriniz'}
                  value={deviceInput}
                  onChange={e => setDeviceInput(e.target.value)}
                />
                <button
                  className="actionBtn-modern"
                  type="button"
                  onClick={handleAddParams}
                >
                  Cihaz Ekle
                </button>
              </>
            </div>
          </div>
          {/* Input */}
          <div className="inputCol">
            <div className="inputBox-modern">
              <textarea
                className="serialInputArea"
                placeholder="Her satıra bir seri numarası giriniz."
                value={serialInput}
                onChange={e => setSerialInput(e.target.value)}
                rows={8}
                style={{ width: '100%', resize: 'vertical' }}
              />
            </div>
            <div className="outputBtnRow-modern">
              <button
                className="actionBtn-modern"
                type="button"
                onClick={handleAddSerialNumber}
              >
                Ekle
              </button>
            </div>
            {error && <div style={{ color: '#e11d48', marginTop: 8, fontSize: '0.98rem' }}>{error}</div>}
            {success && <div style={{ color: '#059669', marginTop: 8, fontSize: '0.98rem' }}>{success}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SerialNumberAdd;