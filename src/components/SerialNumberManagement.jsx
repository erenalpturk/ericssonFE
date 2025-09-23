import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import AddIccids from './AddIccids';
import SetManagement from './SetManagement';
import SerialNumberAdd from './SerialNumberAdd';
import GetIccid from './GetIccid';
import MyIccidList from './MyIccidList';

const SerialNumberManagement = () => {
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
    const [tab, setTab] = useState('claim');

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

            {/* Header Section */}
            <div className="page-header">
                <div className="header-content">
                    <div className="header-icon">
                        <i className="bi bi-credit-card-2-front text-emerald-600"></i>
                    </div>
                    <div className="header-text">
                        <h1>Seri No Yönetimi</h1>
                        <p>Kullandığınız veya rezerve ettiğiniz seri numaralarını yönetin</p>
                    </div>
                    {user.role !== 'tester' && (
                        <div className="action-buttons">
                            <button className="action-btn primary" onClick={() => setTab('claim')}>
                                <i className="bi bi-plus-circle"></i>
                                Al
                            </button>
                            {/* <button className="action-btn primary" onClick={() => setTab('add')}>
                                <i className="bi bi-plus-circle"></i>
                                Ekle
                            </button> */}
                            <button className="action-btn primary" onClick={() => setTab('setManagement')}>
                                <i className="bi bi-plus-circle"></i>
                                Setlerim
                            </button>
                            {/* <button className="action-btn primary" onClick={() => setTab('used')}>
                                <i className="bi bi-plus-circle"></i>
                                Kullandıklarım
                            </button> */}
                        </div>
                    )}
                </div>
            </div>
            <div className="page-content">
                {/* {tab === 'used' && <MyIccidList />} */}
                {tab === 'claim' && <GetIccid />}
                {/* {tab === 'add' && <SerialNumberAdd />} */}
                {tab === 'setManagement' && <SetManagement />}
            </div>
        </div>
    );
};

export default SerialNumberManagement;
