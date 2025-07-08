import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import MyIccids from './AddIccids';
import {
  MenuItem,
  Select,
  IconButton,
  TextField,
  Tooltip,
  Snackbar,
  ListItemText,
  CircularProgress
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const MyIccidList = () => {
  const [iccids, setIccids] = useState([]);
  const [selectedIccids, setSelectedIccids] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orderBy, setOrderBy] = useState('');
  const [order, setOrder] = useState('asc');
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const statusOptions = ['available', 'reserved', 'sold'];
  const { baseUrl, user } = useAuth();
  const [showIccidManagement, setShowIccidManagement] = useState(false);
  const [activeFilters, setActiveFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: 'updated_at', direction: 'desc' });
  const [copySuccess, setCopySuccess] = useState(false);
  const [tab, setTab] = useState('iccid-list');

  useEffect(() => {
    fetchIccids();
  }, []);

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const showError = (message) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(''), 3000);
  };

  const fetchIccids = async () => {
    try {
      setLoading(true);
      const endpoint = user.role === 'admin' || user.role === 'support'
        ? `${baseUrl}/iccid/getAll`
        : `${baseUrl}/iccid/getAll/${user.sicil_no}`;

      const response = await fetch(endpoint, {
        method: 'POST'
      });
      const data = await response.json();

      // Eğer admin değilse, data.data içinden ICCID'leri al
      setIccids(user.role === 'admin' || user.role === 'support' ? data : data.data);
    } catch (error) {
      showError('ICCID\'ler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIccids.length === 0) {
      showError('Lütfen silinecek ICCID\'leri seçin');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/iccid/bulk-delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ iccids: selectedIccids }),
      });
      const data = await response.json();
      showSuccess(data.message);
      setSelectedIccids([]);
      fetchIccids();
    } catch (error) {
      showError('ICCID\'ler silinirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAllIccids = (event) => {
    const sortedAndFilteredData = filterData(sortData(iccids));
    const paginatedData = sortedAndFilteredData.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
    if (event.target.checked) {
      setSelectedIccids(prev => [
        ...prev,
        ...paginatedData
          .map(item => item.iccid)
          .filter(id => !prev.includes(id))
      ]);
    } else {
      setSelectedIccids(prev =>
        prev.filter(id => !paginatedData.map(item => item.iccid).includes(id))
      );
    }
  };

  const handleSelectIccid = (iccid) => {
    setSelectedIccids(prev =>
      prev.includes(iccid)
        ? prev.filter(id => id !== iccid)
        : [...prev, iccid]
    );
  };

  const sortData = (data) => {
    if (!orderBy) return data;

    return [...data].sort((a, b) => {
      const aValue = a[orderBy];
      const bValue = b[orderBy];

      if (order === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
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

      for (const [key, value] of Object.entries(activeFilters)) {
        if (value && item[key] !== value) {
          return false;
        }
      }

      return true;
    });
  };

  const handleStatusChange = async (iccidid, newStatus) => {
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/iccid/update-iccid`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ iccidid, used_by: user.sicil_no, status: newStatus }),
      });
      const data = await response.json();

      if (response.ok) {
        showSuccess('Statü başarıyla güncellendi.');
        fetchIccids();
      } else {
        showError(data.error || 'Statü güncellenemedi.');
      }
    } catch (error) {
      showError('Statü güncellenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'text-green-500';
      case 'reserved': return 'text-yellow-500';
      case 'sold': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const handleFilterApply = (filterType, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: value || null
    }));
    setPage(0);
  };

  const clearFilters = () => {
    setActiveFilters({});
    setSearchText('');
    setPage(0);
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
    const filtered = filterData(iccids);
    return getSortedData(filtered);
  };

  const getPaginatedData = () => {
    const filtered = getFilteredData();
    const start = page * rowsPerPage;
    if (!filtered || filtered.length === 0) return [];
    return filtered.slice(start, start + rowsPerPage);
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

      {/* ICCID Management Modal */}
      {showIccidManagement && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>ICCID Yönetimi</h2>
              <button className="modal-close" onClick={() => setShowIccidManagement(false)}>
                <i className="bi bi-x"></i>
              </button>
            </div>
            <div className="modal-body">
              <AddIccids onClose={() => setShowIccidManagement(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Table Section */}
      <div className="output-card">
        {/* <div className="card-header">
          <div className="card-actions">
            <button
              className="action-btn primary"
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(iccids, null, 2));
                showSuccess('Veriler kopyalandı!');
              }}
            >
              <i className="bi bi-clipboard"></i>
              Verileri Kopyala
            </button>
          </div>
        </div> */}
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
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>
              <Select
                size="small"
                value={activeFilters.stock || ''}
                onChange={(e) => handleFilterApply('stock', e.target.value)}
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
                  <span className="text-gray-500">Durum</span>
                </MenuItem>
                <MenuItem value="available">
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon fontSize="small" color="success" />
                    <span>Müsait</span>
                  </div>
                </MenuItem>
                <MenuItem value="reserved">
                  <div className="flex items-center gap-2">
                    <CancelIcon fontSize="small" color="warning" />
                    <span>Rezerve</span>
                  </div>
                </MenuItem>
                <MenuItem value="sold">
                  <div className="flex items-center gap-2">
                    <CancelIcon fontSize="small" color="error" />
                    <span>Satıldı</span>
                  </div>
                </MenuItem>
              </Select>
              {user.role !== 'tester' && (
                <Select
                  size="small"
                  value={activeFilters.used_by || ''}
                  onChange={(e) => handleFilterApply('used_by', e.target.value)}
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
                  {Array.from(new Set(iccids.map(a => a.used_by))).map(user => (
                    <MenuItem key={user} value={user}>
                      <span className="truncate">{user}</span>
                    </MenuItem>
                  ))}
                </Select>
              )}
              <Select
                size="small"
                value={activeFilters.type || ''}
                onChange={(e) => handleFilterApply('type', e.target.value)}
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
                  <span className="text-gray-500">Tip</span>
                </MenuItem>
                {Array.from(new Set(iccids.map(a => a.type))).map(type => (
                  <MenuItem key={type} value={type}>
                    <span className="truncate">{type}</span>
                  </MenuItem>
                ))}
              </Select>
              {(activeFilters.stock || activeFilters.type || (user.role !== 'tester' && activeFilters.used_by) || searchText) && (
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
            {selectedIccids.length > 0 && (
              <button
                className="action-btn danger"
                onClick={handleBulkDelete}
                disabled={loading}
              >
                <i className="bi bi-trash"></i>
                Seçilenleri Sil ({selectedIccids.length})
              </button>
            )}
          </div>

          {/* Table */}
          <div className="table-container">
            {loading ? (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                padding: '2rem',
                background: 'rgba(255, 255, 255, 0.9)'
              }}>
                <CircularProgress size={40} />
              </div>
            ) : (
              <table className="modern-table">
                <thead>
                  <tr>
                    {user.role !== 'tester' && (
                      <th>
                        <input
                          type="checkbox"
                          checked={selectedIccids.length > 0 && getFilteredData() && selectedIccids.length === getFilteredData().length}
                          onChange={handleSelectAllIccids}
                        />
                      </th>
                    )}
                    <th onClick={() => handleSort('iccid')} style={{ cursor: 'pointer' }}>
                      ICCID
                      {sortConfig.key === 'iccid' && (
                        <span className="ml-1">
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    <th onClick={() => handleSort('stock')} style={{ cursor: 'pointer' }}>
                      Durum
                      {sortConfig.key === 'stock' && (
                        <span className="ml-1">
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    <th onClick={() => handleSort('type')} style={{ cursor: 'pointer' }}>
                      Tip
                      {sortConfig.key === 'type' && (
                        <span className="ml-1">
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    <th onClick={() => handleSort('cdate')} style={{ cursor: 'pointer' }}>
                      Oluşturulma
                      {sortConfig.key === 'cdate' && (
                        <span className="ml-1">
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    <th onClick={() => handleSort('updated_at')} style={{ cursor: 'pointer' }}>
                      Güncellenme
                      {sortConfig.key === 'updated_at' && (
                        <span className="ml-1">
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    <th onClick={() => handleSort('used_by')} style={{ cursor: 'pointer' }}>
                      Kullanan
                      {sortConfig.key === 'used_by' && (
                        <span className="ml-1">
                          {sortConfig.direction === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                    {user.role !== 'tester' && (
                      <th>
                        <span className="text-sm font-medium">
                          Ekleyen
                        </span>
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {getPaginatedData().map((row) => (
                    <tr key={row.iccidid}>
                      {user.role !== 'tester' && (
                        <td>
                          <input
                            type="checkbox"
                          checked={selectedIccids.includes(row.iccid)}
                          onChange={() => handleSelectIccid(row.iccid)}
                        />
                        </td>
                      )}
                      <td className="font-mono text-sm">{row.iccid}</td>
                      <td>
                        <select
                          className={`status-select ${getStatusColor(row.stock)}`}
                          value={row.stock}
                          onChange={(e) => handleStatusChange(row.iccidid, e.target.value)}
                          disabled={loading}
                        >
                          {statusOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <span className="type-badge">{row.type}</span>
                      </td>
                      <td className="text-gray-600">
                        <span className="text-sm font-medium">
                            {new Date(row.cdate).toLocaleString('tr-TR', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                          <br />
                          <span className="text-xs text-gray-500">
                            {new Date(row.cdate).toLocaleString('tr-TR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                            })}
                          </span>
                      </td>
                      <td className="text-gray-600">
                        <span className="text-sm font-medium">
                            {new Date(row.updated_at).toLocaleString('tr-TR', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                          <br />
                          <span className="text-xs text-gray-500">
                            {new Date(row.updated_at).toLocaleString('tr-TR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric'
                            })}
                          </span>
                      </td>
                      
                      <td className="text-gray-600">
                        {row.used_by_name}
                      </td>
                      {user.role !== 'tester' && (
                        <td className="text-gray-600">
                          {row.added_by_name}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          <div className="pagination">
            <div className="pagination-info">
              Toplam {getFilteredData()?.length || 0} kayıt
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
                Sayfa {page + 1} / {Math.ceil(getFilteredData()?.length || 0 / rowsPerPage)}
              </span>
              <button
                onClick={() => setPage(Math.min(Math.ceil(getFilteredData()?.length || 0 / rowsPerPage) - 1, page + 1))}
                disabled={page >= Math.ceil(getFilteredData()?.length || 0 / rowsPerPage) - 1}
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

export default MyIccidList;
