import React, { useState, useEffect, useRef } from 'react';
import {
  MenuItem,
  Select,
  IconButton,
  TextField,
  Tooltip,
  Snackbar,
  ListItemText,
  CircularProgress,
  Button,
  Chip
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AddIcon from '@mui/icons-material/Add';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { startOfDay, endOfDay } from 'date-fns';
import AddActivationModal from './AddActivationModal';
import TransferModal from './TransferModal';

const ActivationList = () => {
  const [activations, setActivations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState({});
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [errorMessage, setErrorMessage] = useState('');
  const { baseUrl, user } = useAuth();
  const [editingNote, setEditingNote] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [otherStatusValues, setOtherStatusValues] = useState({});
  const [openStatusMenu, setOpenStatusMenu] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [activationStatuses, setActivationStatuses] = useState({});
  const noteInputRef = useRef(null);
  const [noteLoading, setNoteLoading] = useState(null);
  const [statusLoading, setStatusLoading] = useState(null);
  const [dateFilter, setDateFilter] = useState({
    startDate: null,
    endDate: null
  });
  const [isTodayFilterActive, setIsTodayFilterActive] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [selectedActivationForTransfer, setSelectedActivationForTransfer] = useState(null);

  useEffect(() => {
    fetchActivations();
  }, []);

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
      const normalized = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : []);
      setActivations(normalized);
    } catch (error) {
      showError('Veriler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const getDatabaseForActivationType = (activationType) => {
    if (activationType === 'RegPost' || activationType === 'RegPre') {
      return 'OMNI2';
    } else if (activationType === 'FonkPost' || activationType === 'FonkPre') {
      return 'OMNI4';
    }
    return 'OMNI4';
  };

  const handleFilterApply = (filterType, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: value || null
    }));
    setPage(0);
    setActivationStatuses({});
  };

  const handleTodayFilter = () => {
    if (isTodayFilterActive) {
      setDateFilter({ startDate: null, endDate: null });
      setIsTodayFilterActive(false);
    } else {
      const today = new Date();
      setDateFilter({
        startDate: startOfDay(today),
        endDate: endOfDay(today)
      });
      setIsTodayFilterActive(true);
    }
    setPage(0);
  };

  const clearFilters = () => {
    setActiveFilters({});
    setSearchText('');
    setDateFilter({ startDate: null, endDate: null });
    setIsTodayFilterActive(false);
    setPage(0);
    setActivationStatuses({});
  };

  const filterData = (data) => {
    return data.filter(item => {
      if (searchText) {
        const searchLower = searchText.toLowerCase();
        const matchesSearch = Object.values(item).some(value =>
          String(value).toLowerCase().includes(searchLower)
        );
        if (!matchesSearch) return false;
      }

      if (dateFilter.startDate || dateFilter.endDate) {
        const itemDate = new Date(item.created_at);
        if (dateFilter.startDate && itemDate < dateFilter.startDate) return false;
        if (dateFilter.endDate) {
          const endDate = new Date(dateFilter.endDate);
          endDate.setHours(23, 59, 59, 999);
          if (itemDate > endDate) return false;
        }
      }

      for (const [key, value] of Object.entries(activeFilters)) {
        if (value) {
          if (key === 'user') {
            if (item.full_name !== value) return false;
          } else if (item[key] !== value) {
            return false;
          }
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
      setStatusLoading(activationId);
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
      } else {
        showError(data.error || 'Statü güncellenirken bir hata oluştu');
      }
    } catch (error) {
      console.error('Statü güncelleme hatası:', error);
      showError('Statü güncellenirken bir hata oluştu');
    } finally {
      setStatusLoading(null);
    }
  };

  const handleOtherStatusInput = async (activationId, value) => {
    if (value.length > 12) return;
    setOtherStatusValues(prev => ({ ...prev, [activationId]: value }));
  };

  const handleOtherStatusSubmit = async (activationId, value) => {
    try {
      setStatusLoading(activationId);
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
        setOpenStatusMenu(prev => ({ ...prev, [activationId]: false }));
      } else {
        showError(data.error || 'Statü güncellenirken bir hata oluştu');
      }
    } catch (error) {
      console.error('Statü güncelleme hatası:', error);
      showError('Statü güncellenirken bir hata oluştu');
    } finally {
      setStatusLoading(null);
    }
  };

  const handleNoteSubmit = async (activationId) => {
    try {
      setNoteLoading(activationId);
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
        setEditingNote(null);
        setNoteText('');
      } else {
        showError('Not güncellenirken bir hata oluştu');
      }
    } catch (error) {
      showError('Not güncellenirken bir hata oluştu');
    } finally {
      setNoteLoading(null);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (editingNote && noteInputRef.current && !noteInputRef.current.contains(event.target)) {
        handleNoteSubmit(editingNote);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [editingNote, noteText]);

  const handleCopyDataInfo = (row) => {
    const text = `MSISDN: ${row.msisdn}\nTCKN: ${row.tckn}\nDoğum Tarihi: ${row.birth_date}\nTarife: ${row.tariff_name}\nOrtam: ${row.activationtype}`;
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
  };

  const handleTransferClick = (activation) => {
    setSelectedActivationForTransfer(activation);
    setIsTransferModalOpen(true);
  };

  const handleTransferSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage('');
    }, 5000);
    fetchActivations();
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
        <div className="flex items-center gap-3">
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsAddModalOpen(true)}
            sx={{
              textTransform: 'none',
              borderRadius: '8px',
              boxShadow: 'none',
              height: '40px',
              minWidth: '160px',
              fontSize: '0.95rem',
              fontWeight: 500,
              paddingX: 2,
              background: 'linear-gradient(135deg, rgb(102, 126, 234), rgb(118, 75, 162))',
              '&:hover': {
                boxShadow: 'none',
                background: 'linear-gradient(135deg, rgb(90, 112, 220), rgb(105, 65, 150))',
                transform: 'translateY(-1px)',
              }
            }}
          >
            Yeni Aktivasyon
          </Button>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            height: '40px',
            paddingLeft: '16px',
            paddingRight: '16px',
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
            border: '1px solid rgba(102, 126, 234, 0.2)',
            borderRadius: '8px',
            minWidth: '140px',
            justifyContent: 'center',
            color: 'rgb(102, 126, 234)',
            fontWeight: 500,
            fontSize: '0.95rem',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.2s ease'
          }}>
            <i className="bi bi-list-ol" style={{ fontSize: '16px' }}></i>
            <span>{activations.length} Aktivasyon</span>
          </div>
        </div>
      </div>

      <AddActivationModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          fetchActivations();
          setErrorMessage('');
        }}
      />

      <TransferModal
        open={isTransferModalOpen}
        onClose={() => {
          setIsTransferModalOpen(false);
          setSelectedActivationForTransfer(null);
        }}
        activation={selectedActivationForTransfer}
        onSuccess={handleTransferSuccess}
      />

      <div className="output-card">
        <div className="card-header">
          <div className="card-actions">
          </div>
        </div>
        <div className="card-body">
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
                    setPage(0);
                    setActivationStatuses({});
                  }}
                />
              </div>
              <Button
                variant={isTodayFilterActive ? "contained" : "outlined"}
                size="small"
                onClick={handleTodayFilter}
                sx={{
                  fontSize: '0.95rem',
                  textTransform: 'none',
                  borderColor: 'rgba(0, 0, 0, 0.1)',
                  color: isTodayFilterActive ? 'white' : 'rgba(0, 0, 0, 0.7)',
                  backgroundColor: isTodayFilterActive ? '#1976d2' : 'transparent',
                  '&:hover': {
                    borderColor: isTodayFilterActive ? '#1976d2' : 'rgba(0, 0, 0, 0.2)',
                    backgroundColor: isTodayFilterActive ? '#1565c0' : 'rgba(0, 0, 0, 0.02)',
                  }
                }}
              >
                Bugün
              </Button>
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
                {Array.from(new Set((Array.isArray(activations) ? activations : []).map(a => a.status)))
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
                {Array.from(new Set((Array.isArray(activations) ? activations : []).map(a => a.tariff_name))).map(tariff => (
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
                {Array.from(new Set((Array.isArray(activations) ? activations : []).map(a => a.activationtype))).map(type => (
                  <MenuItem key={type} value={type}>
                    <span className="truncate">{type}</span>
                  </MenuItem>
                ))}
              </Select>
              {user.role === 'admin' && (
                <Select
                  size="small"
                  value={activeFilters.user || ''}
                  onChange={(e) => handleFilterApply('user', e.target.value)}
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
                    <i className="bi bi-person text-gray-500 mr-1"></i>
                  }
                >
                  <MenuItem value="">
                    <span className="text-gray-500">Kullanıcı</span>
                  </MenuItem>
                  {Array.from(new Set((Array.isArray(activations) ? activations : []).map(a => a.full_name))).map(name => (
                    <MenuItem key={name} value={name}>
                      <span className="truncate">{name}</span>
                    </MenuItem>
                  ))}
                </Select>
              )}
              {(activeFilters.status || activeFilters.tariff_name || activeFilters.activationtype || (user.role === 'admin' && activeFilters.user) || searchText || dateFilter.startDate || dateFilter.endDate) && (
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

          <div className="table-container">
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
                <CircularProgress size={40} />
              </div>
            ) : (
              <table className="modern-table">
                <thead>
                  <tr style={{
                    display: 'grid',
                    gridTemplateColumns: user.role === 'admin'
                      ? '1fr 1fr 1fr 1fr 3fr 1fr'
                      : '1fr 1fr 1fr 3fr 1fr'
                  }}>
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
                    <th onClick={() => handleSort('tariff_name')} style={{ cursor: 'pointer', textAlign: 'center' }}>
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
                    <tr key={row.activationid} style={{
                      display: 'grid',
                      opacity: row.transfer_user && row.original_owner === user.sicil_no && row.original_owner !== (row.current_owner || row.user) ? 0.5 : 1,
                      gridTemplateColumns: user.role === 'admin'
                        ? '1fr 1fr 1fr 1fr 3fr 1fr'
                        : '1fr 1fr 1fr 3fr 1fr'
                    }}>
                      <td>
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
                            <div className="flex items-center gap-2 flex-wrap">
                              {row.isAutomation === false && (
                                <Chip
                                  label="Manuel"
                                  size="small"
                                  sx={{
                                    fontSize: '11px',
                                    height: '20px',
                                    backgroundColor: '#f3f4f6',
                                    color: '#374151'
                                  }}
                                />
                              )}
                              {row.transfer_user && (
                                <Tooltip
                                  title={
                                    <div style={{ padding: '8px' }}>
                                      <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '14px' }}>
                                        Transfer Geçmişi
                                      </div>
                                      <div style={{ fontSize: '12px', lineHeight: '1.4' }}>
                                        <div style={{ marginBottom: '4px' }}>
                                          <strong>Orijinal Sahip:</strong> {row.original_owner_name || row.original_owner}
                                        </div>
                                        <div style={{ marginBottom: '4px' }}>
                                          <strong>Mevcut Sahip:</strong> {row.full_name}
                                        </div>
                                        {row.transfer_user?.transfers && row.transfer_user.transfers.length > 0 && (
                                          <div style={{ marginTop: '8px' }}>
                                            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Transfer Detayları:</div>
                                            {row.transfer_user.transfers.map((transfer, index) => (
                                              <div key={index} style={{
                                                marginBottom: '2px',
                                                paddingLeft: '8px',
                                                fontSize: '11px',
                                                opacity: transfer.active ? 1 : 0.7
                                              }}>
                                                {index + 1}. {new Date(transfer.date).toLocaleString('tr-TR', {
                                                  day: '2-digit',
                                                  month: '2-digit',
                                                  year: 'numeric',
                                                  hour: '2-digit',
                                                  minute: '2-digit'
                                                })} → {transfer.from_name || transfer.from} → {transfer.to_name || transfer.to}
                                                {transfer.active && <span style={{ color: '#4ade80' }}> (Aktif)</span>}
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  }
                                  arrow
                                  placement="top"
                                  componentsProps={{
                                    tooltip: {
                                      sx: {
                                        backgroundColor: 'rgba(255, 255, 255, 0.98)',
                                        color: '#1a1a1a',
                                        border: '1px solid rgba(102, 126, 234, 0.2)',
                                        borderRadius: '12px',
                                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
                                        backdropFilter: 'blur(20px)',
                                        maxWidth: '320px',
                                        fontSize: '13px'
                                      }
                                    },
                                    arrow: {
                                      sx: {
                                        color: 'rgba(255, 255, 255, 0.98)',
                                        '&::before': {
                                          border: '1px solid rgba(102, 126, 234, 0.2)'
                                        }
                                      }
                                    }
                                  }}
                                >
                                  <Chip
                                    label="Transfer"
                                    size="small"
                                    icon={<SwapHorizIcon style={{ fontSize: 12 }} />}
                                    sx={{
                                      fontSize: '11px',
                                      height: '20px',
                                      backgroundColor: 'rgba(102, 126, 234, 0.1)',
                                      color: 'rgb(102, 126, 234)',
                                      border: '1px solid rgba(102, 126, 234, 0.2)',
                                      cursor: 'help'
                                    }}
                                  />
                                </Tooltip>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-center gap-1">
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
                            <Tooltip title={
                              // Eğer kullanıcı orijinal sahip ve data transfer edilmişse
                              row.transfer_user && row.original_owner === user.sicil_no && row.original_owner !== (row.current_owner || row.user)
                                ? "Orijinal sahip olarak bu datayı zaten transfer ettiniz"
                                : "Transfer Et"
                            } arrow>
                              <IconButton
                                size="small"
                                onClick={() => handleTransferClick(row)}
                                disabled={
                                  // Eğer kullanıcı orijinal sahip ve data transfer edilmişse disabled yap
                                  row.transfer_user && row.original_owner === user.sicil_no && row.original_owner !== (row.current_owner || row.user)
                                }
                                sx={{
                                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
                                  borderRadius: '6px',
                                  boxShadow: 1,
                                  color: 'rgb(102, 126, 234)',
                                  mt: 1,
                                  '&:hover': {
                                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2))',
                                    color: 'rgb(90, 112, 220)'
                                  },
                                  '&:disabled': {
                                    background: 'rgba(128, 128, 128, 0.1)',
                                    color: 'rgba(128, 128, 128, 0.5)',
                                    cursor: 'not-allowed'
                                  }
                                }}
                              >
                                <SwapHorizIcon fontSize="inherit" style={{ fontSize: 16 }} />
                              </IconButton>
                            </Tooltip>
                          </div>

                        </div>
                      </td>
                      {user.role === 'admin' && (
                        <td>
                          <div className="flex flex-col items-center gap-1">
                            <span className="user-badge">{row.full_name}</span>
                            {row.transfer_user && row.original_owner !== (row.current_owner || row.user) && (
                              <Chip
                                label={`Orijinal: ${row.original_owner_name || row.original_owner}`}
                                size="small"
                                sx={{
                                  fontSize: '10px',
                                  height: '18px',
                                  backgroundColor: 'rgba(255, 152, 0, 0.1)',
                                  color: 'rgba(255, 152, 0, 0.8)',
                                  border: '1px solid rgba(255, 152, 0, 0.2)'
                                }}
                              />
                            )}
                          </div>
                        </td>
                      )}
                      <td className="text-center">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm">{row.tariff_name}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="type-badge">{row.activationtype}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Select
                            style={{ width: '100%' }}
                            size="small"
                            value={row.status}
                            onChange={e => {
                              handleStatusChange(row.activationid, e.target.value);
                            }}
                            open={!!openStatusMenu[row.activationid] || undefined}
                            onClose={() => handleStatusMenuClose(row.activationid)}
                            disabled={statusLoading === row.activationid || (row.transfer_user && row.original_owner === user.sicil_no && row.original_owner !== (row.current_owner || row.user))}
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
                              if (statusLoading === row.activationid) {
                                return (
                                  <div className="flex items-center gap-2">
                                    <CircularProgress size={16} sx={{ color: 'primary' }} />
                                  </div>
                                );
                              }
                              if (row.status === 'clean') {
                                return (
                                  <div className="flex items-center gap-2">
                                    <CheckCircleIcon fontSize="small" color="success" />
                                    <span>Temiz</span>
                                  </div>
                                );
                              } else if (row.status === 'dirty') {
                                return (
                                  <div className="flex items-center gap-2">
                                    <CancelIcon fontSize="small" color="error" />
                                    <span>Kirli</span>
                                  </div>
                                );
                              } else {
                                return (
                                  <div className="flex items-center gap-2">
                                    <MoreHorizOutlinedIcon style={{ backgroundColor: 'darkorange', color: 'white', borderRadius: '50%', padding: '2px' }} fontSize="small" color="orange" />
                                    <span className="font-mono text-sm">{row.status}</span>
                                  </div>
                                );
                              }
                            }}
                          >
                            <MenuItem value="clean" disabled={statusLoading === row.activationid}>
                              <div className="flex items-center gap-2">
                                <CheckCircleIcon fontSize="small" color="success" />
                                <span>Temiz</span>
                              </div>
                            </MenuItem>
                            <MenuItem value="dirty" disabled={statusLoading === row.activationid}>
                              <div className="flex items-center gap-2">
                                <CancelIcon fontSize="small" color="error" />
                                <span>Kirli</span>
                              </div>
                            </MenuItem>
                            {Array.from(new Set(activations.map(a => a.status)))
                              .filter(status => status !== 'clean' && status !== 'dirty')
                              .map(status => (
                                <MenuItem key={status} value={status} disabled={statusLoading === row.activationid}>
                                  <div className="flex items-center gap-2">
                                    <MoreHorizOutlinedIcon style={{ backgroundColor: 'darkorange', color: 'white', borderRadius: '50%', padding: '2px' }} fontSize="small" color="orange" />
                                    <span className="font-mono text-sm">{status}</span>
                                  </div>
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
                                    disabled={statusLoading === row.activationid}
                                    sx={{ width: 110 }}
                                    onClick={e => e.stopPropagation()}
                                  />
                                  <IconButton
                                    size="small"
                                    onClick={() => handleOtherStatusSubmit(row.activationid, otherStatusValues[row.activationid] || '')}
                                    disabled={statusLoading === row.activationid}
                                    sx={{
                                      padding: '4px',
                                      '&:hover': {
                                        backgroundColor: 'rgba(0, 0, 0, 0.04)'
                                      }
                                    }}
                                  >
                                    {statusLoading === row.activationid ? (
                                      <CircularProgress size={16} sx={{ color: 'primary' }} />
                                    ) : (
                                      <SaveIcon sx={{ fontSize: '1rem' }} />
                                    )}
                                  </IconButton>
                                </div>
                              } />
                            </MenuItem>
                          </Select>
                        </div>
                      </td>
                      <td style={{ padding: '0px', minHeight: '40px', maxHeight: '120px', overflow: 'hidden' }}>
                        <div >
                          {editingNote === row.activationid ? (
                            <div className="flex gap-2 items-center" style={{ position: 'relative', width: '100%', height: '100%' }}>
                              <TextField
                                ref={noteInputRef}
                                value={noteText}
                                onChange={(e) => setNoteText(e.target.value)}
                                placeholder="Not ekleyin..."
                                multiline
                                maxRows={3}
                                disabled={noteLoading === row.activationid || (row.transfer_user && row.original_owner === user.sicil_no && row.original_owner !== (row.current_owner || row.user))}
                                sx={{
                                  fontSize: '0.92rem',
                                  width: '100%',
                                  padding: '0px',
                                  '& .MuiOutlinedInput-root': {
                                    '&:hover fieldset': {
                                      borderColor: 'primary.main',
                                    },
                                    '&.Mui-focused fieldset': {
                                      borderColor: 'primary.main',
                                    },
                                    minHeight: '40px',
                                    maxHeight: '120px',
                                    overflow: 'auto'
                                  },
                                  '& .MuiOutlinedInput-input': {
                                    padding: '8px 12px',
                                    lineHeight: '1.4'
                                  }
                                }}
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleNoteSubmit(row.activationid);
                                  } else if (e.key === 'Escape') {
                                    setEditingNote(null);
                                    setNoteText('');
                                  }
                                }}
                              />
                              <div className="flex gap-1" style={{ position: 'absolute', right: '0px', top: '0px' }}>
                                {noteLoading === row.activationid ? (
                                  <CircularProgress size={20} sx={{ color: 'primary.main' }} />
                                ) : (
                                  <>
                                    <IconButton
                                      size="small"
                                      color="primary"
                                      onClick={() => handleNoteSubmit(row.activationid)}
                                      sx={{
                                        backgroundColor: 'rgba(255,255,255,0.9)',
                                        '&:hover': {
                                          backgroundColor: 'rgba(255,255,255,1)',
                                        }
                                      }}
                                    >
                                      <SaveIcon sx={{ fontSize: '1rem' }} />
                                    </IconButton>
                                    <IconButton
                                      size="small"
                                      color="error"
                                      onClick={() => {
                                        setEditingNote(null);
                                        setNoteText('');
                                      }}
                                      sx={{
                                        backgroundColor: 'rgba(255,255,255,0.9)',
                                        '&:hover': {
                                          backgroundColor: 'rgba(255,255,255,1)',
                                        }
                                      }}
                                    >
                                      <CancelIcon sx={{ fontSize: '1rem' }} />
                                    </IconButton>
                                  </>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div
                              className="flex items-center gap-2 group cursor-pointer hover:bg-gray-50 rounded-md transition-colors duration-200"
                              style={{
                                width: '100%',
                                padding: '4px 8px',
                                minHeight: '40px',
                                maxHeight: '120px',
                                overflow: 'auto',
                                pointerEvents: row.transfer_user && row.original_owner === user.sicil_no && row.original_owner !== (row.current_owner || row.user) ? 'none' : 'auto'
                              }}
                              onClick={() => {
                                setEditingNote(row.activationid);
                                setNoteText(row.note || '');
                              }}
                            >
                              <span
                                className="text-sm flex-grow whitespace-pre-wrap break-words"
                                style={{
                                  fontSize: '0.92rem',
                                  color: row.note ? 'inherit' : '#9CA3AF',
                                  fontStyle: row.note ? 'normal' : 'italic',
                                  lineHeight: '1.4',
                                  wordBreak: 'break-word'
                                }}
                              >
                                {row.note || 'Not eklemek için tıklayın...'}
                              </span>
                              <IconButton
                                size="small"
                                color="primary"
                                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingNote(row.activationid);
                                  setNoteText(row.note || '');
                                }}
                                sx={{
                                  '&:hover': {
                                    backgroundColor: 'rgba(0,0,0,0.04)'
                                  }
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
            )}
          </div>

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
