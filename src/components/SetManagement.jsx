import React, { useState, useEffect } from 'react';
import '../styles/SetManagement.css';
import { useAuth } from '../contexts/AuthContext';

const SetManagement = () => {
  const [sets, setSets] = useState([]);
  const [newSetName, setNewSetName] = useState('');
  const { baseUrl, user } = useAuth();
  const [userAllIccid, setUserAllIccid] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedSet, setSelectedSet] = useState(null);
  const [editSetName, setEditSetName] = useState('');
  const [editIccidList, setEditIccidList] = useState([]);
  const [iccidBySet, setIccidBySet] = useState([]);

  // ICCID ekleme için yeni state'ler
  const [iccidText, setIccidText] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // GetIccid'den alınan state'ler
  const [environment, setEnvironment] = useState('fonk');
  const [gsmType, setGsmType] = useState('post');
  const [dealer, setDealer] = useState('');
  const [iccidParams, setIccidParams] = useState([]);
  const [dealerParams, setDealerParams] = useState([]);

  const envTabList = [
    { label: 'Fonk', key: 'fonk' },
    { label: 'Reg', key: 'reg' },
    { label: 'Hotfix', key: 'hotfix' },
  ];

  const fetchSets = async () => {
    const response = await fetch(`${baseUrl}/iccid/getSets/${user.sicil_no}`);
    const data = await response.json();
    // Her set'e open property'sini ekle
    const setsWithOpen = data.map(set => ({ ...set, open: false }));
    setSets(setsWithOpen);
  };

  const fetchUserAllIccid = async () => {
    const response = await fetch(`${baseUrl}/iccid/getAll/${user.sicil_no}`);
    const data = await response.json();
    setUserAllIccid(data);
  };

  const handleAddSet = async () => {
    if (!newSetName.trim()) return;
    const response = await fetch(`${baseUrl}/iccid/addSet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ set_name: newSetName, user_id: user.sicil_no }),
    });
    setNewSetName('');
    fetchSets();
    fetchUserAllIccid();
  };

  const handleDeleteSet = async (id) => {
    const response = await fetch(`${baseUrl}/iccid/deleteSet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ set_id: id }),
    });
    fetchSets();
  };

  const handleUpdateSet = async (id, status) => {
    const response = await fetch(`${baseUrl}/iccid/updateSet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ set_id: id, status: status }),
    });
    fetchSets();
  };

  // Accordion aç/kapa - tek açık set
  const toggleSet = (id) => {
    setSets(prevSets => {
      const updatedSets = prevSets.map(set => {
        if (set.id === id) {
          const newOpenState = !set.open;
          if (newOpenState) {
            const setIccids = userAllIccid.filter(iccid => iccid.set_table_id === id);
            setIccidBySet(setIccids);
          }
          return { ...set, open: newOpenState };
        } else {
          return { ...set, open: false };
        }
      });
      return updatedSets;
    });
  };

  // Set header için status sayacı
  const getSetStatusCounts = (setId) => {
    const list = Array.isArray(userAllIccid)
      ? userAllIccid.filter(i => i.set_table_id === setId)
      : [];
    const counts = { available: 0, reserved: 0, sold: 0 };
    for (const item of list) {
      const s = item.stock || 'available';
      if (counts[s] !== undefined) counts[s] += 1;
    }
    const total = list.length;
    return { ...counts, total };
  };

  // GetIccid'den alınan fonksiyonlar
  const getDealerParams = async () => {
    try {
      const response = await fetch(`${baseUrl}/iccid/getParams/5`);
      const data = await response.json();
      if (!response.ok || data.error) {
        setErrorMessage(data.error || 'Bir hata oluştu');
        setDealerParams([]);
      } else {
        setDealerParams(data);
        setDealer('');
      }
    } catch (err) {
      setErrorMessage('Bir hata oluştu');
      setDealerParams([]);
    }
  }

  const getIccidParams = async () => {
    try {
      const response = await fetch(`${baseUrl}/iccid/getParams/4`);
      const data = await response.json();
      if (!response.ok || data.error) {
        setErrorMessage(data.error || 'Bir hata oluştu');
        setIccidParams([]);
      } else {
        setIccidParams(data);
      }
    } catch (err) {
      setErrorMessage('Bir hata oluştu');
      setIccidParams([]);
    }
  }

  // Set düzenleme modal'ını aç
  const openEditModal = async (set) => {
    setSelectedSet(set);
    setEditSetName(set.set_name);
    setEditModalOpen(true);

    // Set'in ICCID'lerini getir
    const response = await fetch(`${baseUrl}/iccid/getIccidBySet/${set.id}`);
    const data = await response.json();
    setEditIccidList(data);

    // Parametreleri yükle
    getIccidParams();
    getDealerParams();
  };

  // Environment değiştiğinde dealer parametrelerini yenile
  useEffect(() => {
    if (editModalOpen) {
      getDealerParams();
    }
  }, [environment]);

  // Set adını güncelle
  const handleUpdateSetName = async () => {
    if (!editSetName.trim()) return;

    const response = await fetch(`${baseUrl}/iccid/updateSetName`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        set_id: selectedSet.id,
        set_name: editSetName
      }),
    });

    if (response.ok) {
      fetchSets();
      setEditModalOpen(false);
    }
  };

  // ICCID ekleme fonksiyonu (güncellenmiş)
  const handleIccidSubmit = async () => {
    if (dealer === '') {
      setErrorMessage('Dealer seçilmedi');
      return;
    } else if (gsmType === '') {
      setErrorMessage('GSM Tipi seçilmedi');
      return;
    } else if (!iccidText.trim()) {
      setErrorMessage('ICCID girişi yapılmadı');
      return;
    }
const type = gsmType === 'post' && environment === 'fonk' ? 'fonkpos' : gsmType === 'post' && environment === 'reg' ? 'regpos' : gsmType === 'post' && environment === 'hotfix' ? 'hotfixpos' : gsmType === 'pre' && environment === 'fonk' ? 'fonkpre' : gsmType === 'pre' && environment === 'reg' ? 'regpre' : gsmType === 'pre' && environment === 'hotfix' ? 'hotfixpre' : null;
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/iccid/formatAndInsertIccids/${type}/${environment}/${gsmType}/${dealer}/${user.sicil_no}/${selectedSet.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: iccidText,
      });
      const data = await response.json();

      if (response.ok) {
        showSuccess(data.message);
        setIccidText('');
        // ICCID listesini yenile
        const updatedResponse = await fetch(`${baseUrl}/iccid/getIccidBySet/${selectedSet.id}`);
        const updatedData = await updatedResponse.json();
        setEditIccidList(updatedData);

        // Ana sayfadaki iccidBySet'i de güncelle
        const newIccidBySet = userAllIccid.filter(iccid => iccid.set_table_id === selectedSet.id);
        setIccidBySet(newIccidBySet);
        // Status rozetleri için tüm listeyi tazele
        fetchUserAllIccid();
      } else {
        showError(data.error || 'ICCID\'ler eklenirken bir hata oluştu.');
      }
    } catch (error) {
      showError('ICCID\'ler eklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
    fetchUserAllIccid();
  };

  // ICCID sil
  const handleRemoveIccidFromSet = async (iccidId) => {
    const response = await fetch(`${baseUrl}/iccid/removeIccidFromSet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        set_id: selectedSet.id,
        iccid_id: iccidId
      }),
    });

    if (response.ok) {
      // ICCID listesini yenile
      const updatedResponse = await fetch(`${baseUrl}/iccid/getIccidBySet/${selectedSet.id}`);
      const updatedData = await updatedResponse.json();
      setEditIccidList(updatedData);

      // Status rozetleri için tüm listeyi tazele
      fetchUserAllIccid();
      const newIccidBySet = userAllIccid.filter(iccid => iccid.set_table_id === selectedSet.id);
      setIccidBySet(newIccidBySet);
    }
  };

  // Set içindeki ICCID'leri temizle
  const handleClearSet = async (setId) => {
    if (!window.confirm('Bu set içindeki tüm ICCID\'leri temizlemek istediğinizden emin misiniz?')) {
      return;
    }
    try {
      const response = await fetch(`${baseUrl}/iccid/updateSetIccid/${setId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          set_table_id: setId,
          status: 'available'
        }),
      });

      if (response.ok) {
        // Listeleri yenile
        await fetchUserAllIccid();
        const updatedIccids = userAllIccid.filter(iccid => iccid.set_table_id === setId);
        setIccidBySet(updatedIccids);
        showSuccess('Set başarıyla temizlendi');
      } else {
        const data = await response.json();
        showError(data.error || 'Set temizlenirken bir hata oluştu');
      }
    } catch (error) {
      showError('Set temizlenirken bir hata oluştu');
    }
    fetchUserAllIccid();
  };

  // Modal'ı kapat
  const closeEditModal = () => {
    setEditModalOpen(false);
    setSelectedSet(null);
    setEditSetName('');
    setEditIccidList([]);
    setIccidText('');
    setSuccessMessage('');
    setErrorMessage('');
    setEnvironment('fonk');
    setGsmType('post');
    setDealer('');
  };

  // Success/Error mesajları için yardımcı fonksiyonlar
  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const showError = (message) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(''), 3000);
  };

  useEffect(() => {
    if (user) {
      fetchSets();
      fetchUserAllIccid();
    }
  }, [user]);

  return (
    <div className="modern-page">
      <h1>Set Yönetimi</h1>
      <div className="set-add-bar">
        <input
          type="text"
          placeholder="Yeni set adı girin"
          value={newSetName}
          onChange={e => setNewSetName(e.target.value)}
        />
        <button onClick={handleAddSet}>Set Ekle</button>
      </div>
      <div className="sets-list">
        {sets.map(set => {
          const counts = getSetStatusCounts(set.id);
          return (
            <div key={set.id} className="set-accordion">
              <div className="set-header">
                <div className="set-header-left" onClick={() => toggleSet(set.id)}>
                  <span>{set.set_name}</span>
                  <span className="arrow">{set.open ? '▲' : '▼'}</span>
                </div>
                <div className="set-header-actions">
                  <div className="set-stats">
                    <span className="stat-badge total" title="Toplam">{counts.total}</span>
                    <span className="stat-badge available" title="Müsait">{counts.available}</span>
                    <span className="stat-badge reserved" title="Rezerve">{counts.reserved}</span>
                    <span className="stat-badge sold" title="Satıldı">{counts.sold}</span>
                  </div>
                  <button
                    className="clear-set-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClearSet(set.id);
                    }}
                    title="Set içindeki tüm ICCID'leri temizle"
                  >
                    Temizle
                  </button>
                  <button
                    className="delete-set-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm('Bu seti silmek istediğinizden emin misiniz? İşlem geri alınamaz.')) {
                        handleDeleteSet(set.id);
                      }
                    }}
                    title="Seti Sil"
                  >
                    Sil
                  </button>
                  <button
                    className="edit-set-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditModal(set);
                    }}
                  >
                    Seti Düzenle
                  </button>
                </div>
              </div>
              {set.open && (
                <div className="set-content">
                  {iccidBySet.length > 0 ? iccidBySet.map(iccid => (
                    <div key={iccid.iccidid} className="iccid-detail-item">
                      <div className="iccid-single-row">
                        <span className="iccid-number">{iccid.iccid}</span>
                        <span className="detail-item">
                          <span className="detail-label">Ortam:</span>
                          <span className="detail-value">{iccid.environment}</span>
                        </span>
                        <span className="detail-item">
                          <span className="detail-label">GSM:</span>
                          <span className="detail-value">{iccid.gsm_type}</span>
                        </span>
                        <span className="detail-item">
                          <span className="detail-label">Dealer:</span>
                          <span className="detail-value">{iccid.dealer}</span>
                        </span>
                        <span className="detail-item">
                          <span className="detail-label">Kullanan:</span>
                          <span className="detail-value">{iccid.used_by_name}</span>
                        </span>
                        <span className="detail-item">
                          <span className="detail-label">Kullanma tarihi:</span>
                          <span className="detail-value">{iccid.updated_at}</span>
                        </span>
                        <span className={`stock-badge ${iccid.stock}`}>
                          {iccid.stock === 'available' ? 'Müsait' :
                            iccid.stock === 'reserved' ? 'Rezerve' :
                              iccid.stock === 'sold' ? 'Satıldı' : iccid.stock}
                        </span>
                      </div>
                    </div>
                  )) : <div className="no-iccid">Bu sette henüz Seri No bulunmuyor.</div>}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Set Düzenleme Modal */}
      {editModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Set Düzenle: {selectedSet?.set_name}</h2>
              <button className="close-btn" onClick={closeEditModal}>×</button>
            </div>

            <div className="modal-body">
              {/* Success/Error Messages */}
              {successMessage && (
                <div className="result-alert success">
                  <div className="alert-icon">
                    <i className="bi bi-check-circle-fill"></i>
                  </div>
                  <div className="alert-content">
                    <strong>Başarılı!</strong>
                    <p>{successMessage}</p>
                  </div>
                </div>
              )}

              {errorMessage && (
                <div className="result-alert error">
                  <div className="alert-icon">
                    <i className="bi bi-x-circle-fill"></i>
                  </div>
                  <div className="alert-content">
                    <strong>Hata!</strong>
                    <p>{errorMessage}</p>
                  </div>
                </div>
              )}

              {/* Set Adı Değiştirme */}
              <div className="section">
                <h3>Set Adını Değiştir</h3>
                <div className="input-group">
                  <input
                    type="text"
                    value={editSetName}
                    onChange={(e) => setEditSetName(e.target.value)}
                    placeholder="Yeni set adı"
                  />
                  <button onClick={handleUpdateSetName}>Güncelle</button>
                </div>
              </div>

              {/* ICCID Ekleme (GetIccid'deki gibi) */}
              <div className="section">
                <div className="input-card">
                  <div className="card-header">
                    <div className="card-title">
                      <i className="bi bi-plus-circle text-blue-500"></i>
                      <span>Seri No Ekle</span>
                    </div>
                  </div>
                  <div className="card-body">
                    {/* Environment Seçimi */}
                    <div className="config-section">
                      <h4>Ortam</h4>
                      <div className="env-tabs">
                        {envTabList.map(env => (
                          <button
                            key={env.key}
                            className={`env-tab ${environment === env.key ? 'selected' : ''}`}
                            onClick={() => setEnvironment(env.key)}
                          >
                            {env.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Dealer Seçimi */}
                    <div className="config-section">
                      <h4>Dealer</h4>
                      <div className="dealer-grid">
                        {dealerParams.map(dl => (
                          <button
                            key={dl.key}
                            className={`dealer-btn ${dealer === dl.value ? 'selected' : ''}`}
                            onClick={() => setDealer(dl.value)}
                          >
                            {dl.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* GSM Type Seçimi */}
                    <div className="config-section">
                      <h4>GSM Tipi</h4>
                      <div className="gsm-type-grid">
                        {iccidParams.map(tp => (
                          <button
                            key={tp.id}
                            className={`gsm-type-btn ${gsmType === tp.value ? 'selected' : ''}`}
                            onClick={() => setGsmType(tp.value)}
                          >
                            {tp.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* ICCID Girişi */}
                    <div className="form-group">
                      <label className="config-label">
                        <i className="bi bi-list-ol text-green-500"></i>
                        Seri No'lar
                      </label>
                      <textarea
                        className="modern-textarea"
                        rows="6"
                        value={iccidText}
                        onChange={(e) => setIccidText(e.target.value)}
                        placeholder="ICCID'leri her satıra bir tane olacak şekilde girin...&#10;&#10;Örnek:&#10;8990011234567890123&#10;8990011234567890124&#10;8990011234567890125"
                      />
                    </div>
                    <button
                      className={`convert-btn ${loading ? 'loading' : ''}`}
                      onClick={handleIccidSubmit}
                      disabled={loading || !iccidText.trim() || !dealer || !gsmType}
                    >
                      {loading ? (
                        <>
                          <i className="bi bi-arrow-repeat spin"></i>
                          Seri No'lar Ekleniyor...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-plus-circle"></i>
                          Seri No'ları Ekle
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* ICCID Listesi */}
              <div className="section">
                <h3>Mevcut Seri No'lar</h3>
                <div className="iccid-list">
                  {editIccidList.length > 0 ? editIccidList.map(iccid => (
                    <div key={iccid.iccidid} className="iccid-item">
                      <span>{iccid.iccid}</span>
                      <button
                        className="remove-btn"
                        onClick={() => handleRemoveIccidFromSet(iccid.iccidid)}
                      >
                        Sil
                      </button>
                    </div>
                  )) : <div className="no-iccid">Bu sette henüz Seri No bulunmuyor.</div>}
                  {editIccidList.length === 0 && (
                    <p className="no-iccid">Bu sette henüz Seri No bulunmuyor.</p>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="cancel-btn" onClick={closeEditModal}>
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SetManagement;
