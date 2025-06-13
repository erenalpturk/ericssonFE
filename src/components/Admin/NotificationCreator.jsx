import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Snackbar,
  Alert,
  FormControlLabel,
  Checkbox,
  Card,
  CardContent,
  Divider,
  IconButton,
  InputAdornment,
  Switch,
  Chip,
  Autocomplete,
  CircularProgress,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Paper,
  Badge,
  Skeleton,
  Pagination,
  Tooltip
} from '@mui/material';
import {
  Send as SendIcon,
  NotificationsActive as NotificationIcon,
  Person as PersonIcon,
  Title as TitleIcon,
  Message as MessageIcon,
  Group as GroupIcon,
  Clear as ClearIcon,
  Preview as PreviewIcon,
  History as HistoryIcon,
  AdminPanelSettings as AdminIcon,
  PeopleAlt as PeopleIcon,
  Schedule as ScheduleIcon,
  Image as ImageIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const NotificationCreator = () => {
  const { baseUrl } = useAuth();
  const [formData, setFormData] = useState({
    user_sicil_no: '',
    selectedUser: null,
    title: '',
    message: '',
    sendToAll: false,
    image: null,
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  
  // Bildirim Geçmişi State'leri
  const [tabValue, setTabValue] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);


  // Kullanıcıları yükle
  useEffect(() => {
    const fetchUsers = async () => {
      setUsersLoading(true);
      try {
        const response = await fetch(`${baseUrl}/user/getAllUsers`);
        const data = await response.json();

        if (response.ok && data.data) {
          // Admin olmayan kullanıcıları filtrele
          const nonAdminUsers = data.data.filter(user => user.role !== 'admin');
          setUsers(nonAdminUsers);
        }
      } catch (error) {
        console.error('Kullanıcılar yüklenirken hata:', error);
        setSnackbar({
          open: true,
          message: 'Kullanıcılar yüklenirken bir hata oluştu',
          severity: 'error'
        });
      } finally {
        setUsersLoading(false);
      }
    };

    fetchUsers();
  }, [baseUrl]);

  // Bildirim geçmişini yükle
  const fetchNotifications = async (page = 1) => {
    setNotificationsLoading(true);
    try {
      const response = await fetch(`${baseUrl}/user/getNotifications?page=${page}&limit=10`);
      const data = await response.json();

      if (response.ok && data.data) {
        // API'den gelen verileri formatla
        const formattedNotifications = data.data.map(notification => {
          // user_sicil_no'ya göre alıcı bilgisini belirle
          let receiver = "Bilinmeyen Kullanıcı";
          let sender = "Admin";

          if (notification.user_sicil_no === "ALL") {
            receiver = "Tüm Kullanıcılar";
          } else {
            // Kullanıcı listesinden alıcı bilgisini bul
            const user = users.find(u => u.sicil_no === notification.user_sicil_no);
            if (user) {
              receiver = user.full_name;
            } else {
              receiver = `Sicil No: ${notification.user_sicil_no}`;
            }
          }

          return {
            ...notification,
            receiver,
            sender
          };
        });

        setNotifications(formattedNotifications);

        // Toplam sayfa sayısını hesapla
        const totalItems = data.total || formattedNotifications.length;
        setTotalPages(Math.ceil(totalItems / 10));

      } else {
        // API hatası durumunda boş liste göster
        console.warn('API\'den veri alınamadı');
        setNotifications([]);
        setTotalPages(1);
      }

    } catch (error) {
      console.error('Bildirimler yüklenirken hata:', error);
      setSnackbar({
        open: true,
        message: 'Bildirimler yüklenirken bir hata oluştu',
        severity: 'error'
      });
    } finally {
      setNotificationsLoading(false);
    }
  };

  // Bildirim geçmişini kullanıcılar yüklendikten sonra al
  useEffect(() => {
    if (users.length > 0) {
      fetchNotifications(1);
    }
  }, [users]);

  // Tab değiştirme
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Sayfa değiştirme
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchNotifications(page);
  };



  // Bildirim silme
  const handleDeleteNotification = async (notificationId) => {
    try {
      const response = await fetch(`${baseUrl}/user/deleteNotification/${notificationId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setSnackbar({
          open: true,
          message: 'Bildirim başarıyla silindi',
          severity: 'success'
        });
        
        // Listeyi yenile
        fetchNotifications(currentPage);
      } else {
        throw new Error('Bildirim silinirken bir hata oluştu');
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Bildirim silinirken bir hata oluştu',
        severity: 'error'
      });
    }
  };



  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'sendToAll' ? checked : value
    });
  };

  const handleClear = () => {
    setFormData({
      user_sicil_no: '',
      selectedUser: null,
      title: '',
      message: '',
      sendToAll: false
    });
    setShowPreview(false);
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  if (!formData.title || !formData.message) {
    setSnackbar({
      open: true,
      message: 'Başlık ve mesaj alanları zorunludur',
      severity: 'error'
    });
    setIsLoading(false);
    return;
  }

  if (!formData.sendToAll && !formData.selectedUser) {
    setSnackbar({
      open: true,
      message: 'Kullanıcı seçiniz veya herkese gönder seçeneğini işaretleyiniz',
      severity: 'error'
    });
    setIsLoading(false);
    return;
  }

  try {
    const payload = new FormData();
    payload.append("title", formData.title);
    payload.append("message", formData.message);
    payload.append("user_sicil_no", formData.sendToAll ? "ALL" : formData.selectedUser?.sicil_no);

    if (formData.image) {

      payload.append("file", formData.image);
    }

    const response = await fetch(`${baseUrl}/user/createNotification`, {
      method: 'POST',
      body: payload
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Bildirim oluşturulurken bir hata oluştu');
    }

    setSnackbar({
      open: true,
      message: 'Bildirim başarıyla oluşturuldu',
      severity: 'success'
    });

    handleClear();
  } catch (error) {
    setSnackbar({
      open: true,
      message: error.message || 'Bildirim oluşturulurken bir hata oluştu',
      severity: 'error'
    });
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-icon">
            <i className="bi bi-bell-fill text-amber-600"></i>
          </div>
          <div className="header-text">
            <h1>Bildirim Yönetimi</h1>
            <p>Bildirim oluşturun ve geçmişi yönetin</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Chip
            icon={<NotificationIcon />}
            label="Admin Panel"
            color="primary"
            variant="filled"
            sx={{
              background: 'linear-gradient(135deg, rgb(102, 126, 234), rgb(118, 75, 162))',
              color: 'white',
              fontWeight: 'bold'
            }}
          />
        </div>
      </div>

      {/* Ana Tab Seçimi */}
      <Card
        elevation={0}
        sx={{
          borderRadius: '16px',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.95))',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(102, 126, 234, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          marginBottom: '24px'
        }}
      >
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            borderBottom: '1px solid rgba(102, 126, 234, 0.1)',
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '16px',
              color: '#666',
              minHeight: '64px',
              '&.Mui-selected': {
                color: 'rgb(102, 126, 234)',
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: 'rgb(102, 126, 234)',
              height: '3px',
              borderRadius: '2px',
            },
          }}
        >
          <Tab
            icon={<SendIcon />}
            iconPosition="start"
            label="Yeni Bildirim Oluştur"
            sx={{ minWidth: '200px' }}
          />
          <Tab
            icon={<HistoryIcon />}
            iconPosition="start"
            label="Bildirim Geçmişi"
            sx={{ minWidth: '200px' }}
          />
        </Tabs>
      </Card>

      {/* Tab İçerikleri */}
      {tabValue === 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: showPreview ? '1fr 1fr' : '1fr', gap: '24px' }}>
          {/* Bildirim Oluşturma Formu */}
          <Card
          elevation={0}
          sx={{
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.95))',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(102, 126, 234, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}
        >
          <CardContent sx={{ padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, rgb(102, 126, 234), rgb(118, 75, 162))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)'
              }}>
                <SendIcon sx={{ color: 'white', fontSize: '24px' }} />
              </div>
              <div>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a1a1a', marginBottom: '4px' }}>
                  Yeni Bildirim
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', fontSize: '14px' }}>
                  Kullanıcılara anında bildirim gönderin
                </Typography>
              </div>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Gönderim Türü */}
              <Card sx={{
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05))',
                border: '1px solid rgba(102, 126, 234, 0.1)',
                borderRadius: '12px',
                padding: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <GroupIcon sx={{ color: 'rgb(102, 126, 234)', fontSize: '20px' }} />
                    <div>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                        Herkese Gönder
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#666' }}>
                        Tüm kullanıcılara toplu bildirim gönder
                      </Typography>
                    </div>
                  </div>
                  <Switch
                    checked={formData.sendToAll}
                    onChange={handleChange}
                    name="sendToAll"
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: 'rgb(102, 126, 234)',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: 'rgb(102, 126, 234)',
                      },
                    }}
                  />
                </div>
              </Card>

              {/* Kullanıcı Seçimi */}
              <Autocomplete
                fullWidth
                options={users}
                getOptionLabel={(option) => `${option.full_name} (${option.sicil_no})`}
                value={formData.selectedUser}
                onChange={(event, newValue) => {
                  setFormData({
                    ...formData,
                    selectedUser: newValue,
                    user_sicil_no: newValue?.sicil_no || ''
                  });
                }}
                disabled={formData.sendToAll}
                loading={usersLoading}
                isOptionEqualToValue={(option, value) => option.sicil_no === value?.sicil_no}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Kullanıcı Seçin"
                    required={!formData.sendToAll}
                    placeholder={formData.sendToAll ? "Herkese gönderiliyor..." : "Kullanıcı arayın..."}
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon sx={{ color: formData.sendToAll ? '#ccc' : 'rgb(102, 126, 234)' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <>
                          {usersLoading ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(102, 126, 234, 0.5)',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgb(102, 126, 234)',
                        },
                      },
                    }}
                    helperText={formData.sendToAll ? "Herkese gönder seçeneği aktifken bu alan devre dışıdır" : "Bildirimi alacak kullanıcıyı seçin"}
                  />
                )}
                renderOption={(props, option) => (
                  <Box component="li" {...props} sx={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 16px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, rgb(102, 126, 234), rgb(118, 75, 162))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}>
                      {option.full_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                        {option.full_name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#666' }}>
                        Sicil No: {option.sicil_no}
                      </Typography>
                    </div>
                  </Box>
                )}
                sx={{
                  '& .MuiAutocomplete-listbox': {
                    borderRadius: '12px',
                    overflow: 'hidden'
                  }
                }}
              />


              {/* Resim Yükleme Alanı */}
              <Card 
                onClick={() => document.getElementById('image-upload-input').click()}
                sx={{
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05))',
                  border: formData.image ? '2px solid rgb(102, 126, 234)' : '2px dashed rgba(102, 126, 234, 0.3)',
                  borderRadius: '12px',
                  padding: '24px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  '&:hover': {
                    borderColor: 'rgb(102, 126, 234)',
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 24px rgba(102, 126, 234, 0.2)'
                  }
                }}>
                <input
                  id="image-upload-input"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                  style={{ display: 'none' }}
                />
                
                {formData.image ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, rgb(102, 126, 234), rgb(118, 75, 162))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)'
                    }}>
                      <i className="bi bi-check2" style={{ color: 'white', fontSize: '32px' }}></i>
                    </div>
                    <div>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1a1a1a', marginBottom: '4px' }}>
                        Resim Seçildi
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666', marginBottom: '8px' }}>
                        {formData.image.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#999' }}>
                        Farklı bir resim seçmek için tıklayın
                      </Typography>
                    </div>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<ClearIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        setFormData({ ...formData, image: null });
                      }}
                      sx={{
                        borderRadius: '8px',
                        textTransform: 'none',
                        borderColor: 'rgba(239, 68, 68, 0.3)',
                        color: 'rgb(239, 68, 68)',
                        '&:hover': {
                          borderColor: 'rgb(239, 68, 68)',
                          background: 'rgba(239, 68, 68, 0.05)'
                        }
                      }}
                    >
                      Kaldır
                    </Button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
                      border: '2px dashed rgba(102, 126, 234, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <i className="bi bi-cloud-upload" style={{ color: 'rgb(102, 126, 234)', fontSize: '32px' }}></i>
                    </div>
                    <div>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1a1a1a', marginBottom: '4px' }}>
                        Resim Ekle (Opsiyonel)
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666', marginBottom: '8px' }}>
                        PNG, JPG veya GIF formatında resim yükleyebilirsiniz
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#999' }}>
                        Dosya seçmek için tıklayın veya sürükleyip bırakın
                      </Typography>
                    </div>
                    <Chip
                      label="Dosya Seç"
                      clickable
                      color="primary"
                      variant="outlined"
                      onClick={(e) => {
                        e.stopPropagation();
                        document.getElementById('image-upload-input').click();
                      }}
                      sx={{
                        borderRadius: '8px',
                        fontWeight: 600,
                        borderColor: 'rgba(102, 126, 234, 0.3)',
                        color: 'rgb(102, 126, 234)',
                        '&:hover': {
                          borderColor: 'rgb(102, 126, 234)',
                          background: 'rgba(102, 126, 234, 0.05)'
                        }
                      }}
                    />
                  </div>
                )}
              </Card>

              {/* Başlık */}
              <TextField
                fullWidth
                label="Bildirim Başlığı"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Örn: Yeni Özellik Duyurusu"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <TitleIcon sx={{ color: 'rgb(102, 126, 234)' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(102, 126, 234, 0.5)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgb(102, 126, 234)',
                    },
                  },
                }}
              />

              {/* Mesaj */}
              <TextField
                fullWidth
                label="Bildirim Mesajı"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                multiline
                rows={6}
                placeholder="Kullanıcılara iletmek istediğiniz mesajı buraya yazın..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ alignSelf: 'flex-start', marginTop: '16px' }}>
                      <MessageIcon sx={{ color: 'rgb(102, 126, 234)' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(102, 126, 234, 0.5)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgb(102, 126, 234)',
                    },
                  },
                }}
              />

              <Divider sx={{ margin: '8px 0' }} />

              {/* Aksiyon Butonları */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Button
                  variant="outlined"
                  startIcon={<PreviewIcon />}
                  onClick={() => setShowPreview(!showPreview)}
                  disabled={!formData.title || !formData.message}
                  sx={{
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 600,
                    borderColor: 'rgba(102, 126, 234, 0.3)',
                    color: 'rgb(102, 126, 234)',
                    '&:hover': {
                      borderColor: 'rgb(102, 126, 234)',
                      background: 'rgba(102, 126, 234, 0.05)'
                    }
                  }}
                >
                  {showPreview ? 'Önizlemeyi Gizle' : 'Önizleme'}
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<ClearIcon />}
                  onClick={handleClear}
                  sx={{
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 600,
                    borderColor: 'rgba(239, 68, 68, 0.3)',
                    color: 'rgb(239, 68, 68)',
                    '&:hover': {
                      borderColor: 'rgb(239, 68, 68)',
                      background: 'rgba(239, 68, 68, 0.05)'
                    }
                  }}
                >
                  Temizle
                </Button>

                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SendIcon />}
                  disabled={isLoading || !formData.title || !formData.message || (!formData.sendToAll && !formData.selectedUser)}
                  sx={{
                    borderRadius: '12px',
                    textTransform: 'none',
                    fontWeight: 600,
                    minWidth: '140px',
                    background: 'linear-gradient(135deg, rgb(102, 126, 234), rgb(118, 75, 162))',
                    boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, rgb(90, 112, 220), rgb(105, 65, 150))',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 32px rgba(102, 126, 234, 0.4)',
                    },
                    '&:disabled': {
                      background: '#ccc',
                      color: '#999'
                    }
                  }}
                >
                  {isLoading ? 'Gönderiliyor...' : 'Bildirim Gönder'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Önizleme Paneli */}
        {showPreview && (
          <Card
            elevation={0}
            sx={{
              borderRadius: '16px',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.95))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(102, 126, 234, 0.1)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}
          >
            <CardContent sx={{ padding: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
                  border: '1px solid rgba(102, 126, 234, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <PreviewIcon sx={{ color: 'rgb(102, 126, 234)', fontSize: '24px' }} />
                </div>
                <div>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a1a1a', marginBottom: '4px' }}>
                    Önizleme
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666', fontSize: '14px' }}>
                    Bildiriminizin nasıl görüneceği
                  </Typography>
                </div>
              </div>

              {/* Bildirim Önizleme */}
              <Card sx={{
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05))',
                border: '1px solid rgba(102, 126, 234, 0.2)',
                borderRadius: '12px',
                padding: '20px',
                position: 'relative'
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, rgb(102, 126, 234), rgb(118, 75, 162))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <i className="bi bi-bell-fill" style={{ color: 'white', fontSize: '20px' }}></i>
                  </div>
                  <div style={{ flex: 1 }}>
                    <Typography variant="subtitle1" sx={{
                      fontWeight: 600,
                      color: '#1a1a1a',
                      marginBottom: '8px',
                      lineHeight: 1.4
                    }}>
                      {formData.title || 'Bildirim Başlığı'}
                    </Typography>
                    <Typography variant="body2" sx={{
                      color: '#666',
                      lineHeight: 1.6,
                      whiteSpace: 'pre-wrap'
                    }}>
                      {formData.message || 'Bildirim mesajınız burada görünecek...'}
                    </Typography>
                    <Typography variant="caption" sx={{
                      color: '#999',
                      marginTop: '12px',
                      display: 'block'
                    }}>
                      {new Date().toLocaleDateString('tr-TR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Typography>
                  </div>
                </div>

                {/* Alıcı Bilgisi */}
                <Divider sx={{ margin: '16px 0' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Chip
                    icon={formData.sendToAll ? <GroupIcon /> : <PersonIcon />}
                    label={
                      formData.sendToAll
                        ? 'Herkese Gönderilecek'
                        : formData.selectedUser
                          ? `${formData.selectedUser.full_name} (${formData.selectedUser.sicil_no})`
                          : 'Kullanıcı seçilmedi'
                    }
                    size="small"
                    color={formData.sendToAll ? 'primary' : 'default'}
                    sx={{
                      fontSize: '12px',
                      fontWeight: 500
                    }}
                  />
                </div>
              </Card>
            </CardContent>
          </Card>
        )}
        </div>
      )}

      {/* Bildirim Geçmişi Tab */}
      {tabValue === 1 && (
        <div>
          {/* Bildirim Geçmişi */}
          <Card
            elevation={0}
            sx={{
              borderRadius: '16px',
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.95))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(102, 126, 234, 0.1)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              marginBottom: '24px'
            }}
          >
            <CardContent sx={{ padding: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgb(102, 126, 234), rgb(118, 75, 162))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)'
                }}>
                  <HistoryIcon sx={{ color: 'white', fontSize: '24px' }} />
                </div>
                <div>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a1a1a', marginBottom: '4px' }}>
                    Bildirim Geçmişi
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666', fontSize: '14px' }}>
                    Gönderilen tüm bildirimleri görüntüleyin ve yönetin
                  </Typography>
                </div>
                <div style={{ marginLeft: 'auto' }}>
                  <Badge badgeContent={notifications.length} color="primary" />
                </div>
              </div>

              {/* Bildirim Listesi */}
              {notificationsLoading ? (
                <div>
                  {[...Array(3)].map((_, index) => (
                    <Card key={index} sx={{ marginBottom: '16px', borderRadius: '12px' }}>
                      <CardContent>
                        <div style={{ display: 'flex', gap: '16px' }}>
                          <Skeleton variant="circular" width={48} height={48} />
                          <div style={{ flex: 1 }}>
                            <Skeleton variant="text" width="70%" height={24} />
                            <Skeleton variant="text" width="100%" height={20} />
                            <Skeleton variant="text" width="50%" height={16} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div>
                  {notifications.length === 0 ? (
                    <Card sx={{
                      borderRadius: '12px',
                      border: '2px dashed rgba(102, 126, 234, 0.3)',
                      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05))',
                      textAlign: 'center',
                      padding: '40px'
                    }}>
                      <div style={{
                        width: '64px',
                        height: '64px',
                        margin: '0 auto 16px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <NotificationIcon sx={{ color: 'rgb(102, 126, 234)', fontSize: '32px' }} />
                      </div>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a', marginBottom: '8px' }}>
                        Henüz bildirim gönderilmemiş
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        İlk bildiriminizi oluşturmak için "Yeni Bildirim Oluştur" sekmesini kullanın
                      </Typography>
                    </Card>
                  ) : (
                    notifications.map((notification) => (
                      <Card key={notification.id} sx={{
                        marginBottom: '16px',
                        borderRadius: '12px',
                        border: '1px solid rgba(102, 126, 234, 0.1)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 24px rgba(102, 126, 234, 0.2)',
                          borderColor: 'rgba(102, 126, 234, 0.3)'
                        }
                      }}>
                        <CardContent sx={{ padding: '20px' }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                            <Avatar sx={{
                              width: 48,
                              height: 48,
                              background: 'linear-gradient(135deg, rgb(102, 126, 234), rgb(118, 75, 162))',
                              fontSize: '20px',
                              fontWeight: 'bold'
                            }}>
                              A
                            </Avatar>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a', fontSize: '16px' }}>
                                  {notification.title}
                                </Typography>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <Chip
                                    label={notification.user_sicil_no === "ALL" ? "Herkese" : "Tekil"}
                                    size="small"
                                    color={notification.user_sicil_no === "ALL" ? "primary" : "default"}
                                    sx={{ fontSize: '11px' }}
                                  />
                                  <IconButton
                                    size="small"
                                    onClick={() => handleDeleteNotification(notification.id)}
                                    sx={{ 
                                      color: 'rgb(239, 68, 68)',
                                      '&:hover': {
                                        backgroundColor: 'rgba(239, 68, 68, 0.1)'
                                      }
                                    }}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </div>
                              </div>
                              
                              <Typography variant="body2" sx={{
                                color: '#666',
                                marginBottom: '12px',
                                lineHeight: 1.5,
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                              }}>
                                {notification.message}
                              </Typography>

                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <PersonIcon sx={{ fontSize: '16px', color: '#999' }} />
                                    <Typography variant="caption" sx={{ color: '#999' }}>
                                      {notification.receiver}
                                    </Typography>
                                  </div>
                                  {notification.image_url && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                      <ImageIcon sx={{ fontSize: '16px', color: 'rgb(102, 126, 234)' }} />
                                      <Typography variant="caption" sx={{ color: 'rgb(102, 126, 234)' }}>
                                        Resim var
                                      </Typography>
                                    </div>
                                  )}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <ScheduleIcon sx={{ fontSize: '16px', color: '#999' }} />
                                  <Typography variant="caption" sx={{ color: '#999' }}>
                                    {new Date(notification.cdate).toLocaleDateString('tr-TR', {
                                      day: 'numeric',
                                      month: 'short',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </Typography>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}



      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ borderRadius: '12px' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default NotificationCreator; 