import React, { use, useEffect, useState } from 'react';
import { Box, Typography, Divider, Popover } from '@mui/material';
import moment from 'moment';
import api from '../utlis/api';
import { useQuery } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { clearNotifications, resetNotifications } from '../utlis/notificationSlice';
import { useNotificationWebSocket } from '../utlis/useNotificationWebsocket';

const NotificationPopover = ({
    anchorEl,
    open,
    onClose,
}) => {
    const popoverId = open ? 'notification-popover' : undefined;

    const notifications = useSelector(state => state.notification?.notifications);
    console.log("Notifications from redux:", notifications)
    const dispatch = useDispatch();
    const sendJsonMessage = useNotificationWebSocket();

    const handleMarkAsSeen = (notificationIds) => {
        sendJsonMessage({ type: "mark_seen", notification_ids: notificationIds });
    };

    const handleClose = () => {
        dispatch(resetNotifications());
        const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id);
        if (unreadIds.length) {
            handleMarkAsSeen(unreadIds);
        }
        if (onClose) onClose();
        dispatch(clearNotifications())
    };

    return (
        <Popover
            id={popoverId}
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
            sx={{ mt: 1 }}
        >
            <Box sx={{ p: 2, minWidth: 250 }}>
                <Typography variant="subtitle1" gutterBottom>
                    Notifications
                </Typography>
                <Divider sx={{ mb: 1 }} />
                {(!notifications || notifications.length === 0 || notifications.every(note => note.is_read)) ? (
                    <Typography variant="body2" color="textSecondary">
                        No new notifications
                    </Typography>
                ) : (

                    notifications.filter(note => !note.is_read)
                        .map((note, index) => (
                            <Typography
                                key={note.id || index}
                                variant="body2"
                                sx={{
                                    mb: 1,
                                    wordWrap: 'break-word',
                                    cursor: 'pointer',
                                    fontWeight: note.is_read ? 'normal' : 'bold'
                                }}
                            >
                                • {note.message} {' '}
                                <Box component="span" sx={{ fontSize: 11, color: 'gray', fontStyle: 'italic' }}>
                                    ({moment(note.timestamp).fromNow()})
                                </Box>
                            </Typography>
                        ))
                )}
            </Box>
        </Popover>
    );
};

export default NotificationPopover;
