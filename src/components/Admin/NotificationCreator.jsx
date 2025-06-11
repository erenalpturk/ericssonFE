import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Snackbar,
  Alert,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

const NotificationCreator = () => {
  const { baseUrl } = useAuth();
  const [formData, setFormData] = useState({
    user_sicil_no: '',
    title: '',
    message: '',
    sendToAll: false
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'sendToAll' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.message) {
      setSnackbar({
        open: true,
        message: 'Başlık ve mesaj alanları zorunludur',
        severity: 'error'
      });
      return;
    }

    if (!formData.sendToAll && !formData.user_sicil_no) {
      setSnackbar({
        open: true,
        message: 'Kullanıcı sicil numarası giriniz veya herkese gönder seçeneğini işaretleyiniz',
        severity: 'error'
      });
      return;
    }

    try {
      const notificationData = {
        title: formData.title,
        message: formData.message,
        user_sicil_no: formData.sendToAll ? 'ALL' : formData.user_sicil_no
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

      setFormData({
        user_sicil_no: '',
        title: '',
        message: '',
        sendToAll: false
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'Bildirim oluşturulurken bir hata oluştu',
        severity: 'error'
      });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Bildirim Oluştur
        </Typography>
        <form onSubmit={handleSubmit}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.sendToAll}
                onChange={handleChange}
                name="sendToAll"
                color="primary"
              />
            }
            label="Herkese Gönder"
          />
          <TextField
            fullWidth
            label="Kullanıcı Sicil No"
            name="user_sicil_no"
            value={formData.user_sicil_no}
            onChange={handleChange}
            margin="normal"
            disabled={formData.sendToAll}
            required={!formData.sendToAll}
            helperText={formData.sendToAll ? "Herkese gönder seçeneği işaretlendiğinde bu alan devre dışı kalır" : ""}
          />
          <TextField
            fullWidth
            label="Başlık"
            name="title"
            value={formData.title}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Mesaj"
            name="message"
            value={formData.message}
            onChange={handleChange}
            margin="normal"
            required
            multiline
            rows={4}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Bildirim Oluştur
          </Button>
        </form>
      </Paper>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default NotificationCreator; 