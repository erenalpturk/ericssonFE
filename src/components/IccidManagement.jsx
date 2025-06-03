import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  TableSortLabel,
  IconButton,
  Menu,
  MenuItem,
  InputAdornment,
  Tooltip,
  Chip,
  TablePagination,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const IccidManagement = () => {
  const [iccidText, setIccidText] = useState('');
  const [activations, setActivations] = useState([]);
  const [iccids, setIccids] = useState([]);
  const [selectedIccids, setSelectedIccids] = useState([]);
  const [selectedActivations, setSelectedActivations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [orderBy, setOrderBy] = useState('');
  const [order, setOrder] = useState('asc');
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [activeFilters, setActiveFilters] = useState({});
  const [searchText, setSearchText] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedType, setSelectedType] = useState('fonkpos');
  const [customType, setCustomType] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const baseUrl = 'https://iccid.vercel.app';
  //const baseUrl = 'http://localhost:5432';
  const iccidTypes = [
    { value: 'fonkpos', label: 'Fonksiyonel Postpaid' },
    { value: 'regpos', label: 'Regresyon Postpaid' },
    { value: 'fonkpre', label: 'Fonksiyonel Prepaid' },
    { value: 'regpre', label: 'Regresyon Prepaid' },
    { value: 'custom', label: 'Diğer' }
  ];
  const statusOptions = ['available', 'reserved', 'sold'];

  useEffect(() => {
    fetchActivations();
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

  const fetchActivations = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/iccid/enesvealpdatalarinizigetiriyoru`, {
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

  const handleIccidSubmit = async () => {
    try {
      setLoading(true);
      const type = selectedType === 'custom' ? customType : selectedType;
      const response = await fetch(`${baseUrl}/iccid/formatAndInsertIccids/${type}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: iccidText,
      });
      const data = await response.json();
      showSuccess(data.message);
      setIccidText('');
      setCustomType('');
      setSelectedType('fonkpos');
      fetchIccids();
    } catch (error) {
      showError('ICCID\'ler eklenirken bir hata oluştu.');
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

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
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
      // Search text filter
      if (searchText) {
        const searchLower = searchText.toLowerCase();
        const matchesSearch = Object.values(item).some(value => 
          String(value).toLowerCase().includes(searchLower)
        );
        if (!matchesSearch) return false;
      }

      // Active filters
      for (const [key, value] of Object.entries(activeFilters)) {
        if (value && item[key] !== value) {
          return false;
        }
      }

      return true;
    });
  };

  const getFilterOptions = (data, field) => {
    return [...new Set(data.map(item => item[field]))];
  };

  const renderFilterMenu = (data) => {
    const filterOptions = {
      iccids: ['stock', 'type'],
      activations: ['user', 'activationtype']
    };

    return (
      <Menu
        anchorEl={filterAnchorEl}
        open={Boolean(filterAnchorEl)}
        onClose={handleFilterClose}
      >
        {filterOptions[activeTab === 0 ? 'iccids' : 'activations'].map((filter) => (
          <MenuItem key={filter} onClick={() => handleFilterSelect(filter)}>
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </MenuItem>
        ))}
      </Menu>
    );
  };

  const renderFilterDialog = () => {
    if (!selectedFilter) return null;

    const options = getFilterOptions(
      activeTab === 0 ? iccids : activations,
      selectedFilter
    );

    return (
      <Box sx={{ mt: 2, mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          {selectedFilter.charAt(0).toUpperCase() + selectedFilter.slice(1)} Filtresi
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {options.map((option) => (
            <Chip
              key={option}
              label={option}
              onClick={() => handleFilterApply(option)}
              color={activeFilters[selectedFilter] === option ? 'primary' : 'default'}
              sx={{ m: 0.5 }}
            />
          ))}
        </Box>
      </Box>
    );
  };

  // Tablo başında kullanılacak seçim durumları
  const sortedAndFilteredIccids = filterData(sortData(iccids));
  const paginatedIccids = sortedAndFilteredIccids.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  const allIccidsSelected = paginatedIccids.length > 0 && paginatedIccids.every(row => selectedIccids.includes(row.iccid));
  const someIccidsSelected = paginatedIccids.some(row => selectedIccids.includes(row.iccid)) && !allIccidsSelected;

  const sortedAndFilteredActivations = filterData(sortData(activations));
  const paginatedActivations = sortedAndFilteredActivations.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  const allActivationsSelected = paginatedActivations.length > 0 && paginatedActivations.every(row => selectedActivations.includes(row.activationid));
  const someActivationsSelected = paginatedActivations.some(row => selectedActivations.includes(row.activationid)) && !allActivationsSelected;

  const renderTableHeader = (columns) => (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            checked={
              activeTab === 0
                ? allIccidsSelected
                : allActivationsSelected
            }
            indeterminate={
              activeTab === 0
                ? someIccidsSelected
                : someActivationsSelected
            }
            onChange={activeTab === 0 ? handleSelectAllIccids : handleSelectAllActivations}
          />
        </TableCell>
        {columns.map((column) => (
          <TableCell key={column.field}>
            <TableSortLabel
              active={orderBy === column.field}
              direction={orderBy === column.field ? order : 'asc'}
              onClick={() => handleRequestSort(column.field)}
            >
              {column.headerName}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleStatusChange = async (iccid, newStatus) => {
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/iccid/updateStatus`, {
        method: 'PUT',
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
        showError(data.message || 'Statü güncellenemedi.');
      }
    } catch (error) {
      showError('Statü güncellenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const renderTable = (data, columns, selectedItems, onSelect) => {
    const sortedAndFilteredData = filterData(sortData(data));
    const paginatedData = sortedAndFilteredData.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );

    return (
      <>
        <TableContainer>
          <Table>
            {renderTableHeader(columns)}
            <TableBody>
              {paginatedData.map((row) => (
                <TableRow key={row[activeTab === 0 ? 'iccidid' : 'activationid']}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedItems.includes(row[activeTab === 0 ? 'iccid' : 'activationid'])}
                      onChange={() => onSelect(row[activeTab === 0 ? 'iccid' : 'activationid'])}
                    />
                  </TableCell>
                  {columns.map((column) => (
                    <TableCell key={column.field}>
                      {activeTab === 0 && column.field === 'stock' ? (
                        <FormControl size="small" fullWidth>
                          <Select
                            value={row.stock}
                            onChange={e => handleStatusChange(row.iccid, e.target.value)}
                            disabled={loading}
                          >
                            {statusOptions.map(option => (
                              <MenuItem key={option} value={option}>{option}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      ) : (
                        column.valueFormatter ? column.valueFormatter(row[column.field]) : row[column.field]
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={sortedAndFilteredData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Sayfa başına satır:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} / ${count}`}
        />
      </>
    );
  };

  const iccidColumns = [
    { field: 'iccid', headerName: 'ICCID' },
    { field: 'stock', headerName: 'Durum' },
    { field: 'type', headerName: 'Tip' },
    { 
      field: 'cdate', 
      headerName: 'Oluşturulma Tarihi',
      valueFormatter: (value) => new Date(value).toLocaleString('tr-TR')
    },
    { 
      field: 'updated_at', 
      headerName: 'Güncellenme Tarihi',
      valueFormatter: (value) => new Date(value).toLocaleString('tr-TR')
    }
  ];

  const activationColumns = [
    { field: 'msisdn', headerName: 'MSISDN' },
    { field: 'tckn', headerName: 'TCKN' },
    { field: 'birth_date', headerName: 'Doğum Tarihi' },
    { field: 'user', headerName: 'Kullanıcı' },
    { field: 'activationtype', headerName: 'Aktivasyon Tipi' },
    { 
      field: 'created_at', 
      headerName: 'Oluşturulma Tarihi',
      valueFormatter: (value) => new Date(value).toLocaleString('tr-TR')
    },
    { 
      field: 'updated_at', 
      headerName: 'Güncellenme Tarihi',
      valueFormatter: (value) => new Date(value).toLocaleString('tr-TR')
    }
  ];

  const getFilteredData = () => {
    const data = activeTab === 0 ? iccids : activations;
    if (!searchText) return data;
    
    return data.filter(item => {
      const searchString = searchText.toLowerCase();
      if (activeTab === 0) {
        return item.iccid?.toLowerCase().includes(searchString) ||
               item.type?.toLowerCase().includes(searchString) ||
               item.stock?.toLowerCase().includes(searchString);
      } else {
        return item.msisdn?.toLowerCase().includes(searchString) ||
               item.tckn?.toLowerCase().includes(searchString) ||
               item.user?.toLowerCase().includes(searchString);
      }
    });
  };

  const getPaginatedData = () => {
    const filtered = getFilteredData();
    const start = page * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  };

  const handleClearAll = () => {
    setIccidText('');
    setCustomType('');
    setSelectedType('fonkpos');
    setSearchText('');
    setSelectedIccids([]);
    setSelectedActivations([]);
    setPage(0);
  };

  const handleCopyData = async () => {
    try {
      const data = activeTab === 0 ? iccids : activations;
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      showError('Kopyalama başarısız');
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

  const inputCount = iccidText.trim() ? iccidText.trim().split('\n').filter(line => line.trim()).length : 0;

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
            <h1>ICCID Management</h1>
            <p>ICCID ve aktivasyon verilerini yönetin</p>
          </div>
        </div>
        <div className="stats-badge">
          <i className="bi bi-list-ol"></i>
          <span>{activeTab === 0 ? `${iccids.length} ICCID` : `${activations.length} Aktivasyon`}</span>
        </div>
      </div>

      {/* Add ICCID Section */}
      <div className="input-card">
        <div className="card-header">
          <div className="card-title">
            <i className="bi bi-plus-circle text-blue-500"></i>
            <span>Yeni ICCID Ekle</span>
          </div>
          <div className="card-actions">
            <span className="stats-badge small">
              <i className="bi bi-hash"></i>
              {inputCount} ICCID
            </span>
            <button 
              className="action-btn secondary"
              onClick={handleClearAll}
              disabled={!iccidText && !searchText && selectedIccids.length === 0}
            >
              <i className="bi bi-trash"></i>
              Temizle
            </button>
          </div>
        </div>
        <div className="card-body">
          <div className="config-grid">
            <div className="config-item">
              <label className="config-label">
                <i className="bi bi-tags text-purple-500"></i>
                ICCID Tipi
              </label>
              <select
                className="config-input"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                {iccidTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            {selectedType === 'custom' && (
              <div className="config-item">
                <label className="config-label">
                  <i className="bi bi-pencil text-orange-500"></i>
                  Özel Tip
                </label>
                <input
                  type="text"
                  className="config-input"
                  value={customType}
                  onChange={(e) => setCustomType(e.target.value)}
                  placeholder="Özel tip adını girin"
                />
              </div>
            )}
          </div>
          <div className="form-group">
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
            disabled={loading || !iccidText.trim() || (selectedType === 'custom' && !customType.trim())}
          >
            {loading ? (
              <>
                <i className="bi bi-arrow-repeat spin"></i>
                ICCID'ler Ekleniyor...
              </>
            ) : (
              <>
                <i className="bi bi-plus-circle"></i>
                ICCID'leri Ekle
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tabs and Table Section */}
      <div className="output-card">
        <div className="card-header">
          <div className="tabs-container">
            <button
              className={`tab-btn ${activeTab === 0 ? 'active' : ''}`}
              onClick={() => setActiveTab(0)}
            >
              <i className="bi bi-credit-card text-blue-500"></i>
              ICCID Listesi
            </button>
            <button
              className={`tab-btn ${activeTab === 1 ? 'active' : ''}`}
              onClick={() => setActiveTab(1)}
            >
              <i className="bi bi-check-circle text-green-500"></i>
              Aktivasyonlar
            </button>
          </div>
          <div className="card-actions">
            <button 
              className={`action-btn ${copySuccess ? 'success' : 'primary'}`}
              onClick={handleCopyData}
            >
              {copySuccess ? (
                <>
                  <i className="bi bi-check-circle"></i>
                  Kopyalandı!
                </>
              ) : (
                <>
                  <i className="bi bi-clipboard"></i>
                  Verileri Kopyala
                </>
              )}
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
            {activeTab === 0 && selectedIccids.length > 0 && (
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
            {activeTab === 0 ? (
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
            ) : (
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>MSISDN</th>
                    <th>TCKN</th>
                    <th>Doğum Tarihi</th>
                    <th>Kullanıcı</th>
                    <th>Aktivasyon Tipi</th>
                    <th>Oluşturulma</th>
                  </tr>
                </thead>
                <tbody>
                  {getPaginatedData().map((row) => (
                    <tr key={row.activationid}>
                      <td className="font-mono text-sm">{row.msisdn}</td>
                      <td className="font-mono text-sm">{row.tckn}</td>
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
            )}
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

      {/* Help Section */}
      <div className="help-card">
        <div className="help-header">
          <i className="bi bi-question-circle text-orange-500"></i>
          <span>Nasıl Kullanılır?</span>
        </div>
        <div className="help-content">
          <div className="help-steps">
            <div className="help-step">
              <span className="step-number">1</span>
              <span>ICCID tipini seçin veya özel tip tanımlayın</span>
            </div>
            <div className="help-step">
              <span className="step-number">2</span>
              <span>ICCID'leri metin alanına yapıştırın (her satıra bir ICCID)</span>
            </div>
            <div className="help-step">
              <span className="step-number">3</span>
              <span>"ICCID'leri Ekle" butonuna tıklayın</span>
            </div>
            <div className="help-step">
              <span className="step-number">4</span>
              <span>Tabloda ICCID'leri yönetin, durum güncelleyin veya toplu silme yapın</span>
            </div>
          </div>
          <div className="help-note">
            <div className="note-header">
              <i className="bi bi-lightbulb text-yellow-500"></i>
              <span>İpucu</span>
            </div>
            <p>Durum renkleri: Yeşil (Müsait), Sarı (Rezerve), Kırmızı (Satıldı). Arama ile tabloda filtreleme yapabilirsiniz.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IccidManagement;
