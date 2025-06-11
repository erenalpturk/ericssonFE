import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
    Badge,
    IconButton,
    Popover,
    List,
    ListItem,
    ListItemText,
    Typography,
    Box,
    Divider,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Card,
    CardMedia,
    useTheme
} from '@mui/material';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

const NotificationBell = () => {
    const theme = useTheme();
    const { baseUrl, user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedNotification, setSelectedNotification] = useState(null);

    const fetchNotifications = async () => {
        try {
            const response = await fetch(`${baseUrl}/user/getUserNotifications/${user.sicil_no}`);
            const data = await response.json();
            if (response.ok) {
                setNotifications(data.data);
                setUnreadCount(data.data.filter(n => n.statu === 'UNREAD').length);
            }
        } catch (error) {
            console.error('Bildirimler yüklenirken hata:', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Her 30 saniyede bir bildirimleri güncelle
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [user.sicil_no]);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleNotificationClick = (notification) => {
        setSelectedNotification(notification);
        if (notification.statu === 'UNREAD') {
            markAsRead(notification.id);
        }
    };

    const handleCloseDialog = () => {
        setSelectedNotification(null);
    };

    const markAsRead = async (notificationId) => {
        try {
            const response = await fetch(`${baseUrl}/user/updateNotificationStatus/${notificationId}/${user.sicil_no}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ statu: 'READ' })
            });

            if (response.ok) {
                setNotifications(notifications.map(notification =>
                    notification.id === notificationId
                        ? { ...notification, statu: 'READ' }
                        : notification
                ));
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error('Bildirim durumu güncellenirken hata:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            const unreadNotifications = notifications.filter(n => n.statu === 'UNREAD');
            await Promise.all(
                unreadNotifications.map(notification =>
                    fetch(`${baseUrl}/user/updateNotificationStatus/${notification.id}/${user.sicil_no}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ statu: 'READ' })
                    })
                )
            );
            setNotifications(notifications.map(notification => ({ ...notification, statu: 'READ' })));
            setUnreadCount(0);
        } catch (error) {
            console.error('Tüm bildirimler güncellenirken hata:', error);
        }
    };

    const open = Boolean(anchorEl);

    const renderNotificationContent = (notification) => {
        return (
            <Box sx={{ mt: 2 }}>
                {notification.image_url && (
                    <Card 
                        sx={{ 
                            mb: 2,
                            borderRadius: 2,
                            overflow: 'hidden',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                            border: `1px solid ${theme.palette.divider}`
                        }}
                    >
                        <CardMedia
                            component="img"
                            image={notification.image_url}
                            alt={notification.title}
                            sx={{
                                width: '100%',
                                maxHeight: 300,
                                objectFit: 'contain',
                                bgcolor: theme.palette.background.default
                            }}
                        />
                    </Card>
                )}
                <Typography variant="body1" sx={{ 
                    whiteSpace: 'pre-wrap',
                    lineHeight: 1.6,
                    color: theme.palette.text.primary,
                    fontSize: '0.95rem'
                }}>
                    {notification.message}
                </Typography>
                <Typography variant="caption" sx={{ 
                    display: 'block',
                    mt: 2,
                    color: theme.palette.text.secondary,
                    fontSize: '0.8rem'
                }}>
                    {format(new Date(notification.cdate), 'dd MMMM yyyy HH:mm', { locale: tr })}
                </Typography>
            </Box>
        );
    };

    return (
        <>
            <IconButton
                color="inherit"
                onClick={handleClick}
                sx={{ 
                    position: 'relative',
                    '&:hover': {
                        backgroundColor: theme.palette.action.hover
                    }
                }}
            >
                <Badge 
                    badgeContent={unreadCount} 
                    color="error"
                    sx={{
                        '& .MuiBadge-badge': {
                            backgroundColor: theme.palette.error.main,
                            color: theme.palette.error.contrastText
                        }
                    }}
                >
                    <i className="bi bi-bell-fill"></i>
                </Badge>
            </IconButton>
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                PaperProps={{
                    sx: {
                        width: 360,
                        maxHeight: 480,
                        mt: 1,
                        borderRadius: 2,
                        boxShadow: theme.shadows[4],
                        border: `1px solid ${theme.palette.divider}`
                    }
                }}
            >
                <Box sx={{ 
                    p: 2, 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    borderBottom: `1px solid ${theme.palette.divider}`
                }}>
                    <Typography variant="h6" sx={{ 
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        color: theme.palette.text.primary
                    }}>
                        Bildirimler
                    </Typography>
                    {unreadCount > 0 && (
                        <Button 
                            size="small" 
                            onClick={markAllAsRead}
                            sx={{
                                textTransform: 'none',
                                color: theme.palette.primary.main,
                                '&:hover': {
                                    backgroundColor: theme.palette.primary.light + '20'
                                }
                            }}
                        >
                            Tümünü Okundu İşaretle
                        </Button>
                    )}
                </Box>
                <List sx={{ p: 0 }}>
                    {notifications.length === 0 ? (
                        <ListItem>
                            <ListItemText
                                primary="Bildirim bulunmuyor"
                                sx={{ 
                                    textAlign: 'center', 
                                    color: theme.palette.text.secondary,
                                    py: 2
                                }}
                            />
                        </ListItem>
                    ) : (
                        notifications.map((notification) => (
                            <React.Fragment key={notification.id}>
                                <ListItem
                                    sx={{
                                        bgcolor: notification.statu === 'UNREAD' 
                                            ? theme.palette.action.hover 
                                            : 'inherit',
                                        '&:hover': {
                                            bgcolor: theme.palette.action.selected,
                                            cursor: 'pointer'
                                        },
                                        py: 1.5
                                    }}
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    <ListItemText
                                        primary={
                                            <Typography
                                                variant="subtitle2"
                                                sx={{
                                                    color: theme.palette.text.primary,
                                                    fontWeight: notification.statu === 'UNREAD' ? 600 : 400,
                                                    mb: 0.5
                                                }}
                                            >
                                                {notification.title}
                                            </Typography>
                                        }
                                        secondary={
                                            <>
                                                <Typography
                                                    component="span"
                                                    variant="body2"
                                                    sx={{ 
                                                        display: 'block',
                                                        color: theme.palette.text.secondary,
                                                        fontSize: '0.85rem',
                                                        mb: 0.5
                                                    }}
                                                >
                                                    {notification.message.length > 50 
                                                        ? notification.message.substring(0, 50) + '...' 
                                                        : notification.message}
                                                </Typography>
                                                <Typography
                                                    component="span"
                                                    variant="caption"
                                                    sx={{
                                                        color: theme.palette.text.disabled,
                                                        fontSize: '0.75rem'
                                                    }}
                                                >
                                                    {format(new Date(notification.cdate), 'dd MMMM yyyy HH:mm', { locale: tr })}
                                                </Typography>
                                            </>
                                        }
                                    />
                                </ListItem>
                                <Divider sx={{ my: 0 }} />
                            </React.Fragment>
                        ))
                    )}
                </List>
            </Popover>

            <Dialog
                open={Boolean(selectedNotification)}
                onClose={handleCloseDialog}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        boxShadow: theme.shadows[4],
                        border: `1px solid ${theme.palette.divider}`
                    }
                }}
            >
                {selectedNotification && (
                    <>
                        <DialogTitle sx={{ 
                            pb: 1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            borderBottom: `1px solid ${theme.palette.divider}`
                        }}>
                            <i className="bi bi-bell-fill" style={{ color: theme.palette.primary.main }}></i>
                            <Typography variant="h6" sx={{ 
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                color: theme.palette.text.primary
                            }}>
                                {selectedNotification.title}
                            </Typography>
                        </DialogTitle>
                        <DialogContent sx={{ pt: 2 }}>
                            {renderNotificationContent(selectedNotification)}
                        </DialogContent>
                        <DialogActions sx={{ 
                            px: 3, 
                            pb: 2,
                            borderTop: `1px solid ${theme.palette.divider}`
                        }}>
                            <Button 
                                onClick={handleCloseDialog}
                                variant="contained"
                                color="primary"
                                sx={{
                                    textTransform: 'none',
                                    borderRadius: 1.5
                                }}
                            >
                                Kapat
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </>
    );
};

export default NotificationBell; 