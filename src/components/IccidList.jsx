import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  TableSortLabel,
  Menu,
  MenuItem,
  Chip,
  TablePagination,
  Select,
  FormControl,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const IccidList = () => {
  const [iccids, setIccids] = useState([]);
  const [selectedIccids, setSelectedIccids] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orderBy, setOrderBy] = useState('');
  const [order, setOrder] = useState('asc');
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [activeFilters, setActiveFilters] = useState({});
  const [searchText, setSearchText] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const statusOptions = ['available', 'reserved', 'sold'];
  const { baseUrl, user } = useAuth();

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
      const response = await fetch(`${baseUrl}/iccid/getAll`, {
        method: 'POST'
      });
      const data = await response.json();
      setIccids(data);
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

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleFilterSelect = (filter) => {
    setSelectedFilter(filter);
    handleFilterClose();
  };

  const handleFilterApply = (value) => {
    setActiveFilters(prev => ({
      ...prev,
      [selectedFilter]: value
    }));
  };

  const clearFilters = () => {
    setActiveFilters({});
    setSearchText('');
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

  const handleStatusChange = async (iccid, newStatus) => {
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/iccid/setStatus`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ iccid, status: newStatus }),
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
    switch(status) {
      case 'available': return 'text-green-500';
      case 'reserved': return 'text-yellow-500';
      case 'sold': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getFilteredData = () => {
    if (!searchText) return iccids;
    
    return iccids.filter(item => {
      const searchString = searchText.toLowerCase();
      return item.iccid?.toLowerCase().includes(searchString) ||
             item.type?.toLowerCase().includes(searchString) ||
             item.stock?.toLowerCase().includes(searchString);
    });
  };

  const getPaginatedData = () => {
    const filtered = getFilteredData();
    const start = page * rowsPerPage;
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

      {/* Header Section */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-icon">
            <i className="bi bi-credit-card-2-front text-emerald-600"></i>
          </div>
          <div className="header-text">
            <h1>ICCID Listesi</h1>
            <p>ICCID verilerini yönetin</p>
          </div>
        </div>
        <div className="stats-badge">
          <i className="bi bi-list-ol"></i>
          <span>{iccids.length} ICCID</span>
        </div>
      </div>

      {/* Table Section */}
      <div className="output-card">
        <div className="card-header">
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
        </div>
        <div className="card-body">
          {/* Search and Controls */}
          <div className="table-controls">
            <div className="search-box">
              <i className="bi bi-search"></i>
              <input
                type="text"
                placeholder="Ara..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
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
            <table className="modern-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={selectedIccids.length === getFilteredData().length && getFilteredData().length > 0}
                      onChange={handleSelectAllIccids}
                    />
                  </th>
                  <th>ICCID</th>
                  <th>Durum</th>
                  <th>Tip</th>
                  <th>Oluşturulma</th>
                  <th>Güncellenme</th>
                </tr>
              </thead>
              <tbody>
                {getPaginatedData().map((row) => (
                  <tr key={row.iccidid}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedIccids.includes(row.iccid)}
                        onChange={() => handleSelectIccid(row.iccid)}
                      />
                    </td>
                    <td className="font-mono text-sm">{row.iccid}</td>
                    <td>
                      <select
                        className={`status-select ${getStatusColor(row.stock)}`}
                        value={row.stock}
                        onChange={(e) => handleStatusChange(row.iccid, e.target.value)}
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
                      {new Date(row.cdate).toLocaleString('tr-TR')}
                    </td>
                    <td className="text-gray-600">
                      {new Date(row.updated_at).toLocaleString('tr-TR')}
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
    </div>
  );
};

export default IccidList;
