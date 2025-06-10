import React, { useState, useEffect } from 'react';
import {
  MenuItem,
  Select,
  IconButton,
  TextField,
  Tooltip,
  Snackbar,
  ListItemText
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

const ActivationList = () => {
  const [activations, setActivations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { baseUrl, user } = useAuth();
  const [editingNote, setEditingNote] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [otherStatusValues, setOtherStatusValues] = useState({});
  const [openStatusMenu, setOpenStatusMenu] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [activationStatuses, setActivationStatuses] = useState({});

  useEffect(() => {
    fetchActivations();
  }, []);

  useEffect(() => {
    if (activations.length > 0) {
      fetchActivationStatusesForCurrentPage();
    }
  }, [activations, page, rowsPerPage, activeFilters, searchText]);

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const showError = (message) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(''), 3000);
  };

  const fetchActivations = async () => {
    try {
      setLoading(true);

      const endpoint = user.role === 'admin'
        ? `${baseUrl}/iccid/enesvealpdatalarinizigetiriyoru`
        : `${baseUrl}/iccid/enesvealpdatalarinizigetiriyor/${user.sicil_no}`;

      const response = await fetch(endpoint, {
        method: 'POST'
      });
      const data = await response.json();
      setActivations(data);
    } catch (error) {
      showError('Veriler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  // Aktivasyon tipine göre veritabanı seç
  const getDatabaseForActivationType = (activationType) => {
    if (activationType === 'RegPost' || activationType === 'RegPre') {
      return 'OMNI2';
    } else if (activationType === 'FonkPost' || activationType === 'FonkPre') {
      return 'OMNI4';
    }
    // Diğer tipler için default
    return 'OMNI4';
  };

  const fetchActivationStatusesForCurrentPage = async () => {
    try {
      // Sadece mevcut sayfadaki aktivasyonları al
      const currentPageData = getPaginatedData();
      
      if (currentPageData.length === 0) {
        return;
      }

      // Aktivasyon tipine göre gruplayarak API çağrıları yap
      const groupedByDb = currentPageData.reduce((groups, activation) => {
        const dbName = getDatabaseForActivationType(activation.activationtype);
        if (!groups[dbName]) {
          groups[dbName] = [];
        }
        groups[dbName].push(activation);
        return groups;
      }, {});

      console.log(`Fetching activation status for page ${page + 1}, ${currentPageData.length} items`);
      console.log('Grouped by database:', Object.keys(groupedByDb).map(db => `${db}: ${groupedByDb[db].length} items`));
      console.log('Active filters:', activeFilters);
      console.log('Search text:', searchText);

      // Her veritabanı grubu için ayrı API çağrısı yap
      const allResults = {};
      
      for (const [dbName, activationsForDb] of Object.entries(groupedByDb)) {
        const msisdns = activationsForDb.map(activation => activation.msisdn);
        
        console.log(`Querying ${dbName} for ${msisdns.length} MSISDNs`);

        const response = await fetch(`${baseUrl}/oracle/activation-status-bulk`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            msisdns: msisdns,
            dbName: dbName
          }),
          timeout: 60000, // 60 second timeout
          signal: AbortSignal.timeout(60000)
        });

        const bulkData = await response.json();
        
        if (bulkData.results) {
          // Results'ı activationId'ye göre map'le
          activationsForDb.forEach(activation => {
            const msisdnStatus = bulkData.results[activation.msisdn];
            if (msisdnStatus) {
              allResults[activation.activationid] = {
                activationId: activation.activationid,
                msisdn: activation.msisdn,
                database: dbName,
                ...msisdnStatus
              };
            }
          });
        }
      }
      
      // Mevcut state'i güncelle (sadece bu sayfadaki veriler için)
      setActivationStatuses(prevStatuses => ({
        ...prevStatuses,
        ...allResults
      }));
      
    } catch (error) {
      console.error('Aktiflik durumları alınırken hata:', error);
    }
  };

  const handleFilterApply = (filterType, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: value || null
    }));
    setPage(0); // Filtre değiştiğinde ilk sayfaya dön
    // Aktiflik statuslarını temizle, yeni filtreli veriler için tekrar sorgulanacak
    setActivationStatuses({});
  };

  const clearFilters = () => {
    setActiveFilters({});
    setSearchText('');
    setPage(0);
    // Filtreler temizlendiğinde aktiflik statuslarını da temizle
    setActivationStatuses({});
  };

  const filterData = (data) => {
    return data.filter(item => {
      // Arama filtresi
      if (searchText) {
        const searchLower = searchText.toLowerCase();
        const matchesSearch = Object.values(item).some(value =>
          String(value).toLowerCase().includes(searchLower)
        );
        if (!matchesSearch) return false;
      }

      // Diğer filtreler
      for (const [key, value] of Object.entries(activeFilters)) {
        if (value && item[key] !== value) {
          return false;
        }
      }

      return true;
    });
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedData = (data) => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  const getFilteredData = () => {
    const filtered = filterData(activations);
    return getSortedData(filtered);
  };

  const getPaginatedData = () => {
    const filtered = getFilteredData();
    const start = page * rowsPerPage;
    if (!filtered || !Array.isArray(filtered) || filtered.length === 0) return [];
    return filtered.slice(start, start + rowsPerPage);
  };

  const handleStatusChange = async (activationId, newStatus) => {
    if (newStatus === 'other') {
      setActivations(prev => prev.map(activation =>
        activation.activationid === activationId
          ? { ...activation, status: 'other' }
          : activation
      ));
      setOpenStatusMenu(prev => ({ ...prev, [activationId]: true }));
      return;
    }
    setOpenStatusMenu(prev => ({ ...prev, [activationId]: false }));
    try {
      const response = await fetch(`${baseUrl}/iccid/update-activation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          activationId,
          status: newStatus,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setActivations(prev => prev.map(activation =>
          activation.activationid === activationId
            ? { ...activation, status: newStatus }
            : activation
        ));
        showSuccess('Statü başarıyla güncellendi');
      } else {
        showError(data.error || 'Statü güncellenirken bir hata oluştu');
      }
    } catch (error) {
      console.error('Statü güncelleme hatası:', error);
      showError('Statü güncellenirken bir hata oluştu');
    }
  };

  const handleOtherStatusInput = async (activationId, value) => {
    if (value.length > 12) return;
    setOtherStatusValues(prev => ({ ...prev, [activationId]: value }));
  };

  const handleOtherStatusSubmit = async (activationId, value) => {
    try {
      const response = await fetch(`${baseUrl}/iccid/update-activation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          activationId,
          status: value,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setActivations(prev => prev.map(activation =>
          activation.activationid === activationId
            ? { ...activation, status: value }
            : activation
        ));
        showSuccess('Statü başarıyla güncellendi');
        setOpenStatusMenu(prev => ({ ...prev, [activationId]: false }));
      } else {
        showError(data.error || 'Statü güncellenirken bir hata oluştu');
      }
    } catch (error) {
      console.error('Statü güncelleme hatası:', error);
      showError('Statü güncellenirken bir hata oluştu');
    }
  };

  const handleNoteSubmit = async (activationId) => {
    try {
      const response = await fetch(`${baseUrl}/iccid/update-activation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          activationId,
          note: noteText,
        }),
      });

      if (response.ok) {
        setActivations(prev => prev.map(activation =>
          activation.activationid === activationId
            ? { ...activation, note: noteText }
            : activation
        ));
        setEditingNote(1);
        setNoteText('');
        showSuccess('Not başarıyla güncellendi');
      } else {
        showError('Not güncellenirken bir hata oluştu');
      }
    } catch (error) {
      showError('Not güncellenirken bir hata oluştu');
    }
  };

  const handleCopyDataInfo = (row) => {
    const text = `MSISDN: ${row.msisdn}\nTCKN: ${row.tckn}\nDoğum Tarihi: ${row.birth_date}\nTarife: ${row.tariff_name}\nOrtam: ${row.activationtype}`;
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
  };

  const handleStatusMenuClose = (activationId) => {
    setOpenStatusMenu(prev => ({ ...prev, [activationId]: false }));
  };

  const getUniqueStatuses = () => {
    const statuses = new Set(activations.map(a => a.status));
    return Array.from(statuses).filter(status =>
      status && status !== 'clean' && status !== 'dirty' && status.length === 12
    );
  };

  return (
    <div className="modern-page">
      {/* Success/Error Messages */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50">
          <div className="result-alert success">
            <div className="alert-icon">
              <i className="bi bi-check-circle-fill"></i>
            </div>
            <div className="alert-content">
              <strong>Başarılı!</strong>
              <p>{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="fixed top-4 right-4 z-50">
          <div className="result-alert error">
            <div className="alert-icon">
              <i className="bi bi-x-circle-fill"></i>
            </div>
            <div className="alert-content">
              <strong>Hata!</strong>
              <p>{errorMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-icon">
            <i className="bi bi-check-circle text-emerald-600"></i>
          </div>
          <div className="header-text">
            <h1>Aktivasyonlarım</h1>
            <p>Aktivasyonlarınızı görüntüleyin</p>
          </div>
        </div>
        <div className="stats-badge">
          <i className="bi bi-list-ol"></i>
          <span>{activations.length} Aktivasyon</span>
        </div>
      </div>

      {/* Table Section */}
      <div className="output-card">
        <div className="card-header">
          <div className="card-actions">
            {/* <button
              className="action-btn primary"
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(activations, null, 2));
                showSuccess('Veriler kopyalandı!');
              }}
            >
              <i className="bi bi-clipboard"></i>
              Verileri Kopyala
            </button> */}
          </div>
        </div>
        <div className="card-body">
          {/* Search and Controls */}
          <div className="table-controls">
            <div className="flex items-center gap-2">
              <div className="search-box">
                <i className="bi bi-search"></i>
                <input
                  type="text"
                  placeholder="Ara..."
                  value={searchText}
                  onChange={(e) => {
                    setSearchText(e.target.value);
                    setPage(0); // Arama değiştiğinde ilk sayfaya dön
                    setActivationStatuses({}); // Aktiflik statuslarını temizle
                  }}
                />
              </div>
              <Select
                size="small"
                value={activeFilters.status || ''}
                onChange={(e) => handleFilterApply('status', e.target.value)}
                displayEmpty
                sx={{
                  minWidth: 90,
                  fontSize: '0.95rem',
                  '& .MuiSelect-select': {
                    fontSize: '0.95rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(0, 0, 0, 0.1)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(0, 0, 0, 0.2)',
                  },
                }}
                startAdornment={
                  <i className="bi bi-funnel text-gray-500 mr-1"></i>
                }
              >
                <MenuItem value="">
                  <span className="text-gray-500">Statü</span>
                </MenuItem>
                <MenuItem value="clean">
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon fontSize="small" color="success" />
                    <span>Temiz</span>
                  </div>
                </MenuItem>
                <MenuItem value="dirty">
                  <div className="flex items-center gap-2">
                    <CancelIcon fontSize="small" color="error" />
                    <span>Kirli</span>
                  </div>
                </MenuItem>
                {Array.from(new Set(activations.map(a => a.status)))
                  .filter(status => status !== 'clean' && status !== 'dirty')
                  .map(status => (
                    <MenuItem key={status} value={status}>
                      <span className="font-mono text-sm">{status}</span>
                    </MenuItem>
                  ))}
              </Select>
              <Select
                size="small"
                value={activeFilters.tariff_name || ''}
                onChange={(e) => handleFilterApply('tariff_name', e.target.value)}
                displayEmpty
                sx={{
                  minWidth: 90,
                  fontSize: '0.95rem',
                  '& .MuiSelect-select': {
                    py: 0.5,
                    px: 1,
                    fontSize: '0.95rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(0, 0, 0, 0.1)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(0, 0, 0, 0.2)',
                  },
                }}
                startAdornment={
                  <i className="bi bi-credit-card text-gray-500 mr-1"></i>
                }
              >
                <MenuItem value="">
                  <span className="text-gray-500">Tarife</span>
                </MenuItem>
                {Array.from(new Set(activations.map(a => a.tariff_name))).map(tariff => (
                  <MenuItem key={tariff} value={tariff}>
                    <span className="truncate">{tariff}</span>
                  </MenuItem>
                ))}
              </Select>
              <Select
                size="small"
                value={activeFilters.activationtype || ''}
                onChange={(e) => handleFilterApply('activationtype', e.target.value)}
                displayEmpty
                sx={{
                  minWidth: 90,
                  fontSize: '0.95rem',
                  '& .MuiSelect-select': {
                    py: 0.5,
                    px: 1,
                    fontSize: '0.95rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(0, 0, 0, 0.1)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(0, 0, 0, 0.2)',
                  },
                }}
                startAdornment={
                  <i className="bi bi-layers text-gray-500 mr-1"></i>
                }
              >
                <MenuItem value="">
                  <span className="text-gray-500">Ortam</span>
                </MenuItem>
                {Array.from(new Set(activations.map(a => a.activationtype))).map(type => (
                  <MenuItem key={type} value={type}>
                    <span className="truncate">{type}</span>
                  </MenuItem>
                ))}
              </Select>
              {(activeFilters.status || activeFilters.tariff_name || activeFilters.activationtype || searchText) && (
                <IconButton
                  size="small"
                  onClick={clearFilters}
                  sx={{
                    color: 'rgba(0, 0, 0, 0.5)',
                    '&:hover': {
                      color: 'rgba(0, 0, 0, 0.7)',
                    },
                  }}
                >
                  <i className="bi bi-x-circle"></i>
                </IconButton>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('msisdn')} style={{ cursor: 'pointer' }}>
                    Data Bilgileri
                    {sortConfig.key === 'msisdn' && (
                      <span className="ml-1">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                  {user.role === 'admin' && (
                    <th onClick={() => handleSort('user')} style={{ cursor: 'pointer' }}>
                      Kullanıcı
                      {sortConfig.key === 'user' && (
                        <span className="ml-1">
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                  )}
                  <th onClick={() => handleSort('tariff_name')} style={{ cursor: 'pointer' }}>
                    Tarife Bilgileri
                    {sortConfig.key === 'tariff_name' && (
                      <span className="ml-1">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                  <th onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>
                    Statü
                    {sortConfig.key === 'status' && (
                      <span className="ml-1">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                  {/*
                  <th>
                    Aktiflik/Pasiflik
                  </th>
                  */}
                  <th onClick={() => handleSort('note')} style={{ cursor: 'pointer' }}>
                    Not
                    {sortConfig.key === 'note' && (
                      <span className="ml-1">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                  <th onClick={() => handleSort('created_at')} style={{ cursor: 'pointer' }}>
                    Oluşturulma
                    {sortConfig.key === 'created_at' && (
                      <span className="ml-1">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </th>
                </tr>
              </thead>
              <tbody>
                {getPaginatedData().map((row) => (
                  <tr key={row.activationid}>
                    <td >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <div className="flex flex-col gap-1 pr-6">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500 text-sm">MSISDN:</span>
                            <span className="font-mono text-sm">{row.msisdn}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500 text-sm">TCKN:</span>
                            <span className="font-mono text-sm">{row.tckn}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500 text-sm">DT:</span>
                            <span className="text-sm">{row.birth_date}</span>
                          </div>
                        </div>
                        <Tooltip title="Kopyala" arrow>
                          <IconButton
                            size="small"
                            onClick={() => handleCopyDataInfo(row)}
                            sx={{
                              background: 'rgba(255,255,255,0.7)',
                              borderRadius: '6px',
                              boxShadow: 1,
                              '&:hover': { background: 'rgba(230,230,230,0.9)' }
                            }}
                          >
                            <ContentCopyIcon fontSize="inherit" style={{ fontSize: 16 }} />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </td>
                    {user.role === 'admin' && (
                      <td>
                        <span className="user-badge">{row.user}</span>
                      </td>
                    )}
                    <td>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span onClick={() => console.log(row.status)} className="font-mono text-sm">{row.tariff_name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="type-badge">{row.activationtype}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>

                        <Select
                          size="small"
                          value={row.status}

                          onChange={e => {
                            handleStatusChange(row.activationid, e.target.value);
                          }}
                          open={!!openStatusMenu[row.activationid] || undefined}
                          onClose={() => handleStatusMenuClose(row.activationid)}
                          sx={{
                            minWidth: 90,
                            fontSize: '0.95rem',
                            '& .MuiSelect-select': {
                              fontSize: '0.95rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                            },
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'rgba(0, 0, 0, 0.1)',
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'rgba(0, 0, 0, 0.2)',
                            },
                          }}
                          onKeyDown={(e) => e.stopPropagation()}
                          renderValue={() => {
                            if (row.status === 'clean') {
                              return (
                                <div className="flex items-center gap-2">
                                  <CheckCircleIcon fontSize="small" color="success" />
                                  <span>Temiz</span>
                                </div>
                              )
                            } else if (row.status === 'dirty') {
                              return (
                                <div className="flex items-center gap-2">
                                  <CancelIcon fontSize="small" color="error" />
                                  <span>Kirli</span>
                                </div>
                              )
                            } else {
                              return (
                                <div className="flex items-center gap-2">
                                  <MoreHorizIcon fontSize="small" color="disabled" />
                                  <span className="font-mono text-sm">{row.status}</span>
                                </div>
                              )
                            }
                          }}
                        >
                          <MenuItem value="clean">
                            <div className="flex items-center gap-2">
                              <CheckCircleIcon fontSize="small" color="success" />
                              <span>Temiz</span>
                            </div>
                          </MenuItem>
                          <MenuItem value="dirty">
                            <div className="flex items-center gap-2">
                              <CancelIcon fontSize="small" color="error" />
                              <span>Kirli</span>
                            </div>
                          </MenuItem>
                          {Array.from(new Set(activations.map(a => a.status)))
                            .filter(status => status !== 'clean' && status !== 'dirty')
                            .map(status => (
                              <MenuItem key={status} value={status}>
                                <span className="font-mono text-sm">{status}</span>
                              </MenuItem>
                            ))}
                          <MenuItem onKeyDown={e => e.stopPropagation()} value="other" disableGutters disableRipple style={{ padding: 0, minHeight: 0 }} onClick={e => e.stopPropagation()} tabIndex={-1}>
                            <ListItemText primary={
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <TextField
                                  autoFocus
                                  size="small"
                                  value={otherStatusValues[row.activationid] || ''}
                                  onChange={e => handleOtherStatusInput(row.activationid, e.target.value)}
                                  inputProps={{ maxLength: 12 }}
                                  placeholder="12 karakter"
                                  sx={{ width: 110 }}
                                  onClick={e => e.stopPropagation()}
                                />
                                <IconButton
                                  size="small"
                                  onClick={() => handleOtherStatusSubmit(row.activationid, otherStatusValues[row.activationid] || '')}
                                  sx={{
                                    padding: '4px',
                                    '&:hover': {
                                      backgroundColor: 'rgba(0, 0, 0, 0.04)'
                                    }
                                  }}
                                >
                                  <SaveIcon sx={{ fontSize: '1rem' }} />
                                </IconButton>
                              </div>
                            } />
                          </MenuItem>
                        </Select>
                      </div>
                    </td>
                    {/* <td>
                      <div className="flex items-center justify-center">
                        {(() => {
                          const activationStatus = activationStatuses[row.activationid];
                          if (!activationStatus) {
                            return <span className="text-gray-400 text-sm">Yükleniyor...</span>;
                          }
                          
                          const dbName = activationStatus.database || getDatabaseForActivationType(row.activationtype);
                          const tooltipTitle = `${activationStatus.status} (${dbName})`;
                          
                          switch(activationStatus.statusType) {
                            case 'active':
                              return (
                                <Tooltip title={tooltipTitle} arrow>
                                  <div className="flex items-center gap-1 cursor-help">
                                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                    <span className="text-green-600 font-medium text-sm">{activationStatus.status}</span>
                                  </div>
                                </Tooltip>
                              );
                            case 'passive':
                              return (
                                <Tooltip title={tooltipTitle} arrow>
                                  <div className="flex items-center gap-1 cursor-help">
                                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                    <span className="text-red-600 font-medium text-sm">{activationStatus.status}</span>
                                  </div>
                                </Tooltip>
                              );
                            case 'no-data':
                              return (
                                <Tooltip title={`Veri Yok (${dbName})`} arrow>
                                  <div className="flex items-center gap-1 cursor-help">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                                    <span className="text-gray-500 text-sm">Veri Yok</span>
                                  </div>
                                </Tooltip>
                              );
                            case 'error':
                              return (
                                <Tooltip title={`Hata (${dbName})`} arrow>
                                  <div className="flex items-center gap-1 cursor-help">
                                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                                    <span className="text-orange-600 text-sm">Hata</span>
                                  </div>
                                </Tooltip>
                              );
                            default:
                              return (
                                <Tooltip title={tooltipTitle} arrow>
                                  <div className="flex items-center gap-1 cursor-help">
                                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                                    <span className="text-yellow-600 text-sm">{activationStatus.status}</span>
                                  </div>
                                </Tooltip>
                              );
                          }
                        })()}
                      </div>
                    </td> */}
                    <td style={{ padding: '0px' }}>
                      <div >
                        {editingNote === row.activationid ? (
                          <div className="flex gap-2 items-center" style={{ position: 'relative', width: '100%', height: '100%' }}>
                            <TextField
                              value={noteText}
                              onChange={(e) => setNoteText(e.target.value)}
                              placeholder="Not ekleyin..."
                              sx={{ fontSize: '0.92rem', width: '100%', padding: '0px' }}
                            />
                            <IconButton
                              style={{ position: 'absolute', right: '0px', top: '0px' }}
                              size="small"
                              color="primary"
                              onClick={() => handleNoteSubmit(row.activationid)}
                            >
                              <SaveIcon sx={{ fontSize: '1rem' }} />
                            </IconButton>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2" style={{ width: '100%' }}>
                            <span className="text-sm" style={{ fontSize: '0.92rem', width: '100%' }}>{row.note || '-'}</span>
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => {
                                setEditingNote(row.activationid);
                                setNoteText(row.note || '');
                              }}
                            >
                              <EditIcon sx={{ fontSize: '1.1rem' }} />
                            </IconButton>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="text-gray-600">
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-medium">
                          {new Date(row.created_at).toLocaleString('tr-TR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        <br />
                        <span className="text-xs text-gray-500">
                          {new Date(row.created_at).toLocaleString('tr-TR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="pagination">
            <div className="pagination-info">
              Toplam {getFilteredData().length} kayıt
            </div>
            <div className="pagination-controls">
              <select
                value={rowsPerPage}
                onChange={(e) => setRowsPerPage(Number(e.target.value))}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
              >
                <i className="bi bi-chevron-left"></i>
              </button>
              <span>
                Sayfa {page + 1} / {Math.ceil(getFilteredData().length / rowsPerPage)}
              </span>
              <button
                onClick={() => setPage(Math.min(Math.ceil(getFilteredData().length / rowsPerPage) - 1, page + 1))}
                disabled={page >= Math.ceil(getFilteredData().length / rowsPerPage) - 1}
              >
                <i className="bi bi-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      <Snackbar
        open={copySuccess}
        autoHideDuration={1500}
        onClose={() => setCopySuccess(false)}
        message="Kopyalandı!"
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      />
    </div>
  );
};

export default ActivationList;
