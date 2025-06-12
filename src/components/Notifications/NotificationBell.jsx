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
    useTheme,
    Tooltip,
    keyframes
} from '@mui/material';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

// Animasyon keyframes
const bellShake = keyframes`
  0%, 100% { transform: rotate(0deg); }
  10%, 30%, 50%, 70%, 90% { transform: rotate(-10deg); }
  20%, 40%, 60%, 80% { transform: rotate(10deg); }
`;

const pulseGlow = keyframes`
  0% { box-shadow: 0 0 5px rgba(102, 126, 234, 0.4); }
  50% { box-shadow: 0 0 20px rgba(118, 75, 162, 0.8); }
  100% { box-shadow: 0 0 5px rgba(102, 126, 234, 0.4); }
`;

const NotificationBell = () => {
    const theme = useTheme();
    const { baseUrl, user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [isAnimating, setIsAnimating] = useState(false);

    const fetchNotifications = async () => {
        try {
            const response = await fetch(`${baseUrl}/user/getUserNotifications/${user.sicil_no}`);
            const data = await response.json();
            if (response.ok) {
                const previousUnreadCount = unreadCount;
                const newUnreadCount = data.data.filter(n => n.statu === 'UNREAD').length;
                
                setNotifications(data.data);
                setUnreadCount(newUnreadCount);
                
                // Yeni bildirim geldiğinde animasyon tetikle
                if (newUnreadCount > previousUnreadCount) {
                    setIsAnimating(true);
                    setTimeout(() => setIsAnimating(false), 1000);
                }
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
                body: JSON.stringify({ statu: 'read' })
            });

            if (response.ok) {
                setNotifications(notifications.map(notification =>
                    notification.id === notificationId
                        ? { ...notification, statu: 'read' }
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
                        body: JSON.stringify({ statu: 'read' })
                    })
                )
            );
            setNotifications(notifications.map(notification => ({ ...notification, statu: 'read' })));
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
            <Tooltip title="Bildirimler" arrow placement="bottom">
            <IconButton
                color="inherit"
                onClick={handleClick}
                sx={{ 
                    position: 'relative',
                        padding: '8px',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        animation: isAnimating ? `${bellShake} 0.8s ease-in-out` : unreadCount > 0 ? `${bellShake} 1.5s ease-in-out infinite` : 'none',
                    '&:hover': {
                            transform: 'translateY(-2px)',
                        },
                        '&:active': {
                            transform: 'translateY(0px)',
                    }
                }}
            >
                <Badge 
                    badgeContent={unreadCount} 
                    color="error"
                    sx={{
                        '& .MuiBadge-badge': {
                                backgroundColor: 'linear-gradient(135deg, rgb(102, 126, 234), rgb(118, 75, 162))',
                                background: 'linear-gradient(135deg, rgb(102, 126, 234), rgb(118, 75, 162))',
                                color: '#ffffff',
                                fontWeight: 'bold',
                                fontSize: '0.75rem',
                                minWidth: '20px',
                                height: '20px',
                                borderRadius: '10px',
                                border: '2px solid #ffffff',
                                boxShadow: '0 2px 8px rgba(118, 75, 162, 0.4)',
                                transform: 'scale(1) translate(50%, -50%)',
                                '&::after': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3), transparent)',
                                }
                        }
                    }}
                >
                        <i 
                            className="bi bi-bell-fill" 
                            style={{ 
                                fontSize: '22px',
                                color: 'rgb(102, 126, 234)',
                                transition: 'all 0.3s ease'
                            }}
                        />
                </Badge>
            </IconButton>
            </Tooltip>
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
                        width: 380,
                        maxHeight: 500,
                        mt: 1,
                        borderRadius: '16px',
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.98))',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                        border: '1px solid rgba(102, 126, 234, 0.1)',
                        overflow: 'hidden'
                    }
                }}
            >
                <Box sx={{ 
                    p: 2.5,
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05))',
                    borderBottom: '1px solid rgba(102, 126, 234, 0.1)'
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: unreadCount > 0 ? 1.5 : 0 }}>
                        <Box sx={{
                            width: 32,
                            height: 32,
                            borderRadius: '8px',
                            background: 'linear-gradient(135deg, rgb(102, 126, 234), rgb(118, 75, 162))',
                            display: 'flex',
                    alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                        }}>
                            <i className="bi bi-bell-fill" style={{ color: 'white', fontSize: '16px' }}></i>
                        </Box>
                        <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ 
                        fontSize: '1.1rem',
                                fontWeight: 700,
                                color: '#1a1a1a',
                                lineHeight: 1.2
                    }}>
                        Bildirimler
                    </Typography>
                            {unreadCount > 0 && (
                                <Typography variant="caption" sx={{ 
                                    color: 'rgb(102, 126, 234)',
                                    fontWeight: 600,
                                    fontSize: '0.75rem'
                                }}>
                                    {unreadCount} okunmamış bildirim
                                </Typography>
                            )}
                        </Box>
                    </Box>
                    
                    {unreadCount > 0 && (
                        <Button 
                            size="small" 
                            onClick={markAllAsRead}
                            sx={{
                                textTransform: 'none',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                borderRadius: '8px',
                                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
                                border: '1px solid rgba(102, 126, 234, 0.2)',
                                color: 'rgb(102, 126, 234)',
                                px: 2,
                                py: 0.5,
                                '&:hover': {
                                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15), rgba(118, 75, 162, 0.15))',
                                    border: '1px solid rgba(102, 126, 234, 0.3)',
                                    transform: 'translateY(-1px)'
                                }
                            }}
                        >
                            <i className="bi bi-check-all" style={{ marginRight: '6px', fontSize: '14px' }}></i>
                            Tümünü Okundu İşaretle
                        </Button>
                    )}
                </Box>
                <Box sx={{ p: 1, maxHeight: 400, overflowY: 'auto' }}>
                    {notifications.length === 0 ? (
                        <Box sx={{ 
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 2,
                            py: 4,
                            px: 2
                        }}>
                            <Box sx={{
                                width: 64,
                                height: 64,
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <i className="bi bi-bell-slash" style={{ 
                                    fontSize: '24px',
                                    color: 'rgba(102, 126, 234, 0.6)'
                                }}></i>
                            </Box>
                            <Typography variant="body2" sx={{ 
                                color: theme.palette.text.secondary,
                                    textAlign: 'center', 
                                fontWeight: 500
                            }}>
                                Henüz bildirim bulunmuyor
                            </Typography>
                        </Box>
                    ) : (
                        notifications.map((notification, index) => (
                            <Box key={notification.id} sx={{ mb: index < notifications.length - 1 ? 1 : 0 }}>
                                <Box
                                    sx={{
                                        p: 2,
                                        borderRadius: '12px',
                                        background: notification.statu === 'UNREAD' 
                                            ? 'linear-gradient(135deg, rgba(102, 126, 234, 0.08), rgba(118, 75, 162, 0.08))'
                                            : 'linear-gradient(135deg, rgba(102, 126, 234, 0.02), rgba(118, 75, 162, 0.02))',
                                        border: notification.statu === 'UNREAD' 
                                            ? '1px solid rgba(102, 126, 234, 0.15)'
                                            : '1px solid rgba(102, 126, 234, 0.05)',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        position: 'relative',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.12), rgba(118, 75, 162, 0.12))',
                                            border: '1px solid rgba(102, 126, 234, 0.2)',
                                            transform: 'translateY(-1px)',
                                            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.1)'
                                        }
                                    }}
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                                        {/* Bildirim İkonu */}
                                        <Box sx={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: '8px',
                                            background: notification.statu === 'UNREAD' 
                                                ? 'linear-gradient(135deg, rgb(102, 126, 234), rgb(118, 75, 162))'
                                                : 'linear-gradient(135deg, rgba(102, 126, 234, 0.6), rgba(118, 75, 162, 0.6))',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: 0,
                                            boxShadow: notification.statu === 'UNREAD' 
                                                ? '0 4px 12px rgba(102, 126, 234, 0.3)'
                                                : '0 2px 8px rgba(102, 126, 234, 0.15)'
                                        }}>
                                            <i className="bi bi-bell-fill" style={{ 
                                                color: 'white', 
                                                fontSize: '14px' 
                                            }}></i>
                                        </Box>

                                        {/* Bildirim İçeriği */}
                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                            <Typography
                                                variant="subtitle2"
                                                sx={{
                                                    color: theme.palette.text.primary,
                                                    fontWeight: notification.statu === 'UNREAD' ? 600 : 500,
                                                    mb: 0.5,
                                                    lineHeight: 1.3,
                                                    fontSize: '0.9rem'
                                                }}
                                            >
                                                {notification.title}
                                            </Typography>
                                                <Typography
                                                    variant="body2"
                                                    sx={{ 
                                                        color: theme.palette.text.secondary,
                                                    fontSize: '0.8rem',
                                                    lineHeight: 1.4,
                                                    mb: 1,
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden'
                                                    }}
                                                >
                                                {notification.message}
                                                </Typography>
                                            
                                            {/* Alt Bilgiler */}
                                            <Box sx={{ 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                justifyContent: 'space-between',
                                                gap: 1
                                            }}>
                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        color: theme.palette.text.disabled,
                                                        fontSize: '0.7rem',
                                                        fontWeight: 500
                                                    }}
                                                >
                                                    {format(new Date(notification.cdate), 'dd MMM HH:mm', { locale: tr })}
                                                </Typography>
                                                
                                                {notification.statu === 'UNREAD' && (
                                                    <Box sx={{
                                                        width: 6,
                                                        height: 6,
                                                        borderRadius: '50%',
                                                        background: 'linear-gradient(135deg, rgb(102, 126, 234), rgb(118, 75, 162))',
                                                        flexShrink: 0,
                                                        boxShadow: '0 0 8px rgba(102, 126, 234, 0.4)'
                                                    }} />
                                                )}
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        ))
                    )}
                </Box>
            </Popover>

            <Dialog
                open={Boolean(selectedNotification)}
                onClose={handleCloseDialog}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '16px',
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.98))',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                        border: '1px solid rgba(102, 126, 234, 0.1)',
                        overflow: 'hidden',
                        minHeight: '300px'
                    }
                }}
                BackdropProps={{
                    sx: {
                        backgroundColor: 'rgba(0, 0, 0, 0.4)',
                        backdropFilter: 'blur(4px)'
                    }
                }}
            >
                {selectedNotification && (
                    <>
                        {/* Modern Header */}
                        <Box sx={{ 
                            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08), rgba(118, 75, 162, 0.08))',
                            borderBottom: '1px solid rgba(102, 126, 234, 0.1)',
                            p: 3
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                {/* Bildirim İkonu */}
                                <Box sx={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: '12px',
                                    background: 'linear-gradient(135deg, rgb(102, 126, 234), rgb(118, 75, 162))',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)',
                                    flexShrink: 0
                        }}>
                                    <i className="bi bi-bell-fill" style={{ color: 'white', fontSize: '22px' }}></i>
                                </Box>

                                {/* Başlık ve Meta Bilgiler */}
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Typography variant="h5" sx={{ 
                                        fontSize: '1.3rem',
                                        fontWeight: 700,
                                        color: '#1a1a1a',
                                        mb: 1,
                                        lineHeight: 1.3
                                    }}>
                                        {selectedNotification.title}
                                    </Typography>
                                    
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                                        <Box sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: 0.5,
                                            px: 1.5,
                                            py: 0.5,
                                            borderRadius: '8px',
                                            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
                                            border: '1px solid rgba(102, 126, 234, 0.2)'
                                        }}>
                                            <i className="bi bi-clock" style={{ fontSize: '12px', color: 'rgb(102, 126, 234)' }}></i>
                                            <Typography variant="caption" sx={{ 
                                                color: 'rgb(102, 126, 234)',
                                fontWeight: 600,
                                                fontSize: '0.75rem'
                                            }}>
                                                {format(new Date(selectedNotification.cdate), 'dd MMMM yyyy, HH:mm', { locale: tr })}
                                            </Typography>
                                        </Box>

                                        {selectedNotification.statu === 'UNREAD' && (
                                            <Box sx={{ 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                gap: 0.5,
                                                px: 1.5,
                                                py: 0.5,
                                                borderRadius: '8px',
                                                background: 'linear-gradient(135deg, rgb(34, 197, 94), rgb(22, 163, 74))',
                                                boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)'
                                            }}>
                                                <Box sx={{
                                                    width: 6,
                                                    height: 6,
                                                    borderRadius: '50%',
                                                    background: 'white',
                                                    boxShadow: '0 0 4px rgba(255, 255, 255, 0.5)'
                                                }} />
                                                <Typography variant="caption" sx={{ 
                                                    color: 'white',
                                                    fontWeight: 700,
                                                    fontSize: '0.7rem',
                                                    letterSpacing: '0.5px'
                                                }}>
                                                    YENİ
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>
                                </Box>

                                {/* Kapat Butonu */}
                                <IconButton 
                                    onClick={handleCloseDialog}
                                    sx={{
                                        width: 36,
                                        height: 36,
                                        background: 'rgba(255, 255, 255, 0.8)',
                                        border: '1px solid rgba(102, 126, 234, 0.2)',
                                        color: 'rgb(102, 126, 234)',
                                        '&:hover': {
                                            background: 'rgba(102, 126, 234, 0.1)',
                                            border: '1px solid rgba(102, 126, 234, 0.3)',
                                            transform: 'scale(1.05)'
                                        }
                                    }}
                                >
                                    <i className="bi bi-x" style={{ fontSize: '18px' }}></i>
                                </IconButton>
                            </Box>
                        </Box>

                        {/* İçerik Alanı */}
                        <Box sx={{ p: 3 }}>
                            <Box sx={{
                                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.02), rgba(118, 75, 162, 0.02))',
                                border: '1px solid rgba(102, 126, 234, 0.08)',
                                borderRadius: '12px',
                                p: 3,
                                position: 'relative',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '4px',
                                    height: '100%',
                                    background: 'linear-gradient(135deg, rgb(102, 126, 234), rgb(118, 75, 162))',
                                    borderRadius: '0 2px 2px 0'
                                }
                            }}>
                                {selectedNotification.image_url && (
                                    <Box sx={{ mb: 3 }}>
                                        <Box sx={{
                                            borderRadius: '12px',
                                            overflow: 'hidden',
                                            border: '1px solid rgba(102, 126, 234, 0.1)',
                                            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)'
                                        }}>
                                            <img
                                                src={selectedNotification.image_url}
                                                alt={selectedNotification.title}
                                                style={{
                                                    width: '100%',
                                                    maxHeight: '300px',
                                                    objectFit: 'contain',
                                                    backgroundColor: '#f8f9fa'
                                                }}
                                            />
                                        </Box>
                                    </Box>
                                )}
                                
                                <Typography variant="body1" sx={{ 
                                    color: '#2d3748',
                                    lineHeight: 1.7,
                                    fontSize: '1rem',
                                    whiteSpace: 'pre-wrap',
                                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                                }}>
                                    {selectedNotification.message}
                            </Typography>
                            </Box>
                        </Box>

                        {/* Footer Actions */}
                        <Box sx={{ 
                            p: 3,
                            pt: 0,
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: 2
                        }}>
                            {/* {selectedNotification.statu === 'UNREAD' && (
                                <Button 
                                    variant="outlined"
                                    startIcon={<i className="bi bi-check" style={{ fontSize: '14px' }}></i>}
                                    onClick={() => {
                                        markAsRead(selectedNotification.id);
                                        handleCloseDialog();
                                    }}
                                    sx={{
                                        borderRadius: '10px',
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        borderColor: 'rgba(34, 197, 94, 0.3)',
                                        color: 'rgb(34, 197, 94)',
                                        '&:hover': {
                                            borderColor: 'rgb(34, 197, 94)',
                                            background: 'rgba(34, 197, 94, 0.05)'
                                        }
                                    }}
                                >
                                    Okundu İşaretle
                                </Button>
                            )} */}
                            
                            <Button 
                                onClick={handleCloseDialog}
                                variant="contained"
                                startIcon={<i className="bi bi-x-circle" style={{ fontSize: '14px' }}></i>}
                                sx={{
                                    borderRadius: '10px',
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    background: 'linear-gradient(135deg, rgb(102, 126, 234), rgb(118, 75, 162))',
                                    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.3)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, rgb(90, 112, 220), rgb(105, 65, 150))',
                                        transform: 'translateY(-1px)',
                                        boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)'
                                    }
                                }}
                            >
                                Kapat
                            </Button>
                        </Box>
                    </>
                )}
            </Dialog>
        </>
    );
};

export default NotificationBell; 