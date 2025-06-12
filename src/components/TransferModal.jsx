import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Autocomplete,
  TextField,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Chip,
  Avatar
} from '@mui/material';
import {
  SwapHoriz as TransferIcon,
  Person as PersonIcon,
  ArrowForward as ArrowIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const TransferModal = ({ open, onClose, activation, onSuccess }) => {
  const { baseUrl, user } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [usersLoading, setUsersLoading] = useState(false);
  const [transferLoading, setTransferLoading] = useState(false);
  const [error, setError] = useState('');

  // Kullanıcıları yükle
  useEffect(() => {
    if (open) {
      fetchUsers();
    }
  }, [open]);

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const response = await fetch(`${baseUrl}/user/getAllUsers`);
      const data = await response.json();
      
      if (response.ok && data.data) {
        // Mevcut kullanıcıyı filtrele
        const otherUsers = data.data.filter(u => u.sicil_no !== user.sicil_no);
        setUsers(otherUsers);
      }
    } catch (error) {
      console.error('Kullanıcılar yüklenirken hata:', error);
      setError('Kullanıcılar yüklenirken bir hata oluştu');
    } finally {
      setUsersLoading(false);
    }
  };

  const handleTransfer = async () => {
    if (!selectedUser || !activation) return;

    setTransferLoading(true);
    setError('');

    try {
      const currentOwner = activation.transfer_user?.current_user || activation.user;
      
      const response = await fetch(`${baseUrl}/iccid/transfer-activation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          activationId: activation.activationid,
          fromUser: currentOwner,
          toUser: selectedUser.sicil_no
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Transfer işlemi başarısız');
      }

      onSuccess(data.message);
      onClose();
      setSelectedUser(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setTransferLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setSelectedUser(null);
    setError('');
  };

  if (!activation) return null;

  const currentOwner = activation.transfer_user?.current_user || activation.user;
  // Backend'den gelen full_name zaten doğru current owner name'ini içeriyor
  const currentOwnerName = activation.full_name;

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.98))',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(102, 126, 234, 0.1)',
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.15)'
        }
      }}
    >
      <DialogTitle sx={{ 
        padding: '24px 24px 16px 24px',
        borderBottom: '1px solid rgba(102, 126, 234, 0.1)'
      }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Box sx={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgb(102, 126, 234), rgb(118, 75, 162))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <TransferIcon sx={{ color: 'white', fontSize: '24px' }} />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a1a1a' }}>
              Data Transfer
            </Typography>
            <Typography variant="body2" sx={{ color: '#666', mt: 0.5 }}>
              MSISDN: {activation.msisdn}
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ padding: '24px' }}>
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
            {error}
          </Alert>
        )}

        {/* Transfer Bilgisi */}
        <Box sx={{
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05))',
          border: '1px solid rgba(102, 126, 234, 0.1)',
          borderRadius: '12px',
          padding: '20px',
          mb: 3
        }}>
          <Typography variant="subtitle2" sx={{ color: '#666', mb: 2 }}>
            Transfer Detayı
          </Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <Chip
              avatar={
                <Avatar sx={{ 
                  background: 'linear-gradient(135deg, rgb(102, 126, 234), rgb(118, 75, 162))',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>
                  {currentOwnerName.charAt(0).toUpperCase()}
                </Avatar>
              }
              label={currentOwnerName}
              sx={{
                padding: '8px 12px',
                fontSize: '14px',
                fontWeight: 500
              }}
            />
            <ArrowIcon sx={{ color: 'rgb(102, 126, 234)' }} />
            <Typography variant="body2" sx={{ color: '#666' }}>
              {selectedUser ? selectedUser.full_name : 'Kullanıcı seçin'}
            </Typography>
          </Box>
        </Box>

        {/* Kullanıcı Seçimi */}
        <Autocomplete
          fullWidth
          options={users}
          getOptionLabel={(option) => option.full_name}
          value={selectedUser}
          onChange={(event, newValue) => setSelectedUser(newValue)}
          loading={usersLoading}
          isOptionEqualToValue={(option, value) => option.sicil_no === value?.sicil_no}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Transfer Edilecek Kullanıcı"
              placeholder="Kullanıcı arayın..."
              required
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <PersonIcon sx={{ color: 'rgb(102, 126, 234)', mr: 1 }} />
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
            />
          )}
          renderOption={(props, option) => (
            <Box component="li" {...props} sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              padding: '12px 16px' 
            }}>
              <Avatar sx={{
                width: '36px',
                height: '36px',
                background: 'linear-gradient(135deg, rgb(102, 126, 234), rgb(118, 75, 162))',
                color: 'white',
                fontSize: '14px',
                fontWeight: 'bold'
              }}>
                {option.full_name.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                  {option.full_name}
                </Typography>
              </Box>
            </Box>
          )}
        />

        {selectedUser && (
          <Alert severity="info" sx={{ mt: 3, borderRadius: '12px' }}>
            <Typography variant="body2">
              Bu aktivasyon <strong>{selectedUser.full_name}</strong> kullanıcısına 
              transfer edilecek ve artık sadece o kullanıcı tarafından görülebilecektir.
            </Typography>
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ 
        padding: '16px 24px 24px 24px',
        borderTop: '1px solid rgba(102, 126, 234, 0.1)',
        gap: 2
      }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          startIcon={<CloseIcon />}
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
          İptal
        </Button>
        <Button
          onClick={handleTransfer}
          variant="contained"
          startIcon={transferLoading ? <CircularProgress size={16} color="inherit" /> : <TransferIcon />}
          disabled={!selectedUser || transferLoading}
          sx={{
            borderRadius: '12px',
            textTransform: 'none',
            fontWeight: 600,
            minWidth: '140px',
            background: 'linear-gradient(135deg, rgb(102, 126, 234), rgb(118, 75, 162))',
            boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, rgb(90, 112, 220), rgb(105, 65, 150))',
              transform: 'translateY(-1px)',
              boxShadow: '0 12px 32px rgba(102, 126, 234, 0.4)',
            },
            '&:disabled': {
              background: '#ccc',
              color: '#999'
            }
          }}
        >
          {transferLoading ? 'Transfer Ediliyor...' : 'Transfer Et'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TransferModal; 