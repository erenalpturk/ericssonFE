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

  const fetchIccids = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/iccid/getAll`, {
        method: 'POST'});
      const data = await response.json();
      setIccids(data);
    } catch (error) {
      toast.error('ICCID\'ler yüklenirken bir hata oluştu.', { position: 'top-right', autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };

  const fetchActivations = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${baseUrl}/iccid/enesvealpdatalarinizigetiriyoru`, {
        method: 'POST'});
      const data = await response.json();
      setActivations(data);
    } catch (error) {
      toast.error('Veriler yüklenirken bir hata oluştu.', { position: 'top-right', autoClose: 3000 });
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
      toast.success(data.message, { position: 'top-right', autoClose: 1000 });
      setIccidText('');
      setCustomType('');
      setSelectedType('fonkpos');
      fetchIccids();
    } catch (error) {
      toast.error('ICCID\'ler eklenirken bir hata oluştu.', { position: 'top-right', autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIccids.length === 0) {
      toast.error('Lütfen silinecek ICCID\'leri seçin', { position: 'top-right', autoClose: 3000 });
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
      toast.success(data.message, { position: 'top-right', autoClose: 1000 });
      setSelectedIccids([]);
      fetchIccids();
    } catch (error) {
      toast.error('ICCID\'ler silinirken bir hata oluştu.', { position: 'top-right', autoClose: 3000 });
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
      const response = await fetch(`${baseUrl}/iccid/setstatus`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ iccid, status: newStatus }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success('Statü başarıyla güncellendi.', { position: 'top-right', autoClose: 1000 });
        setOrderBy('iccid');
        setOrder('asc');
        fetchIccids();
      } else {
        toast.error(data.message || 'Statü güncellenemedi.', { position: 'top-right', autoClose: 3000 });
      }
    } catch (error) {
      toast.error('Statü güncellenirken bir hata oluştu.', { position: 'top-right', autoClose: 3000 });
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

  return (
    <Box sx={{ p: 3 }}>
      <ToastContainer />
      <Typography variant="h4" gutterBottom>
        ICCID Yönetimi
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Yeni ICCID Ekle
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <FormControl fullWidth size="small">
            <InputLabel>ICCID Tipi</InputLabel>
            <Select
              value={selectedType}
              label="ICCID Tipi"
              onChange={(e) => setSelectedType(e.target.value)}
            >
              {iccidTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  {type.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {selectedType === 'custom' && (
            <TextField
              size="small"
              label="Özel Tip"
              value={customType}
              onChange={(e) => setCustomType(e.target.value)}
              sx={{ minWidth: 200 }}
            />
          )}
        </Box>
        <TextField
          fullWidth
          multiline
          rows={4}
          value={iccidText}
          onChange={(e) => setIccidText(e.target.value)}
          placeholder="ICCID'leri her satıra bir tane olacak şekilde girin"
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          onClick={handleIccidSubmit}
          disabled={loading || !iccidText.trim() || (selectedType === 'custom' && !customType.trim())}
        >
          {loading ? <CircularProgress size={24} /> : 'ICCID\'leri Ekle'}
        </Button>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
          <Tab label="ICCID Listesi" />
          <Tab label="Aktivasyonlar" />
        </Tabs>

        <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
          <TextField
            size="small"
            placeholder="Ara..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Tooltip title="Filtrele">
            <IconButton onClick={handleFilterClick}>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
          <Button
            size="small"
            onClick={clearFilters}
            disabled={Object.keys(activeFilters).length === 0 && !searchText}
          >
            Filtreleri Temizle
          </Button>
          <Typography variant="body2" color="text.secondary">
            {activeTab === 0 
              ? `Toplam ${iccids.length} ICCID`
              : `Toplam ${activations.length} Aktivasyon`}
          </Typography>
        </Box>

        {renderFilterMenu(activeTab === 0 ? iccids : activations)}
        {renderFilterDialog()}

        {activeTab === 0 && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">
                ICCID Listesi
              </Typography>
              <Button
                variant="contained"
                color="error"
                onClick={handleBulkDelete}
                disabled={loading || selectedIccids.length === 0}
              >
                Seçilenleri Sil ({selectedIccids.length})
              </Button>
            </Box>

            {renderTable(
              iccids,
              iccidColumns,
              selectedIccids,
              handleSelectIccid
            )}
          </>
        )}

        {activeTab === 1 && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">
                Aktivasyonlar
              </Typography>
            </Box>

            {renderTable(
              activations,
              activationColumns,
              selectedActivations,
              handleSelectActivation
            )}
          </>
        )}
      </Paper>
    </Box>
  );
};

export default IccidManagement;
