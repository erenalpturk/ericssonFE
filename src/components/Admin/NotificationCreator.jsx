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
  CircularProgress
} from '@mui/material';
import { 
  Send as SendIcon, 
  NotificationsActive as NotificationIcon,
  Person as PersonIcon,
  Title as TitleIcon,
  Message as MessageIcon,
  Group as GroupIcon,
  Clear as ClearIcon,
  Preview as PreviewIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const NotificationCreator = () => {
  const { baseUrl } = useAuth();
  const [formData, setFormData] = useState({
    user_sicil_no: '',
    selectedUser: null,
    title: '',
    message: '',
    sendToAll: false
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
      const notificationData = {
        title: formData.title,
        message: formData.message,
        user_sicil_no: formData.sendToAll ? 'ALL' : formData.selectedUser?.sicil_no
      };

      const response = await fetch(`${baseUrl}/user/createNotification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationData)
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
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Page Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-icon">
            <i className="bi bi-bell-fill text-amber-600"></i>
          </div>
          <div className="header-text">
            <h1>Bildirim Oluştur</h1>
            <p>Kullanıcılara bildirim gönderin ve iletişimi güçlendirin</p>
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