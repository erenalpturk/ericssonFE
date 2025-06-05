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

const ActivationList = () => {
  const [activations, setActivations] = useState([]);
  const [selectedActivations, setSelectedActivations] = useState([]);
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
  const { baseUrl, user } = useAuth();

  useEffect(() => {
    fetchActivations();
  }, []);

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

  const handleSelectAllActivations = (event) => {
    const sortedAndFilteredData = filterData(sortData(activations));
    const paginatedData = sortedAndFilteredData.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
    if (event.target.checked) {
      setSelectedActivations(prev => [
        ...prev,
        ...paginatedData
          .map(item => item.activationid)
          .filter(id => !prev.includes(id))
      ]);
    } else {
      setSelectedActivations(prev =>
        prev.filter(id => !paginatedData.map(item => item.activationid).includes(id))
      );
    }
  };

  const handleSelectActivation = (activationid) => {
    setSelectedActivations(prev => 
      prev.includes(activationid)
        ? prev.filter(id => id !== activationid)
        : [...prev, activationid]
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

  const getFilteredData = () => {
    if (!searchText) return activations;
    
    return activations.filter(item => {
      const searchString = searchText.toLowerCase();
      return item.msisdn?.toLowerCase().includes(searchString) ||
             item.tckn?.toLowerCase().includes(searchString) ||
             item.user?.toLowerCase().includes(searchString);
    });
  };

  const getPaginatedData = () => {
    const filtered = getFilteredData();
    const start = page * rowsPerPage;
    if (!filtered || !Array.isArray(filtered) || filtered.length === 0) return [];
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
            <i className="bi bi-check-circle text-emerald-600"></i>
          </div>
          <div className="header-text">
            <h1>Aktivasyon Listesi</h1>
            <p>Aktivasyon verilerini yönetin</p>
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
            <button 
              className="action-btn primary"
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(activations, null, 2));
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
          </div>

          {/* Table */}
          <div className="table-container">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>MSISDN</th>
                  <th>Tarife</th>
                  <th>TCKN</th>
                  <th>Doğum Tarihi</th>
                  <th>Ad Soyad</th>
                  <th>Kullanıcı</th>
                  <th>Aktivasyon Tipi</th>
                  <th>Oluşturulma</th>
                </tr>
              </thead>
              <tbody>
                {getPaginatedData().map((row) => (
                  <tr key={row.activationid}>
                    <td className="font-mono text-sm">{row.msisdn}</td>
                    <td className="font-mono text-sm">{row.prod_ofr_id}</td>
                    <td className="font-mono text-sm">{row.tckn}</td>
                    <td>{row.birth_date}</td>
                    <td>{row.birth_date}</td>

                    <td>
                      <span className="user-badge">{row.user}</span>
                    </td>
                    <td>
                      <span className="type-badge">{row.activationtype}</span>
                    </td>
                    <td className="text-gray-600">
                      {new Date(row.created_at).toLocaleString('tr-TR')}
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

export default ActivationList;
