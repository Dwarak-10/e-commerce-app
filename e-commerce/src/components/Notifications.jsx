import React, { useEffect, useState } from 'react';
import { Box, Typography, Divider, Popover } from '@mui/material';
import moment from 'moment';
import api from '../utlis/api';
import { useQuery } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';


// console.log(userToken)
const adminNotification = async () => {
    const { data } = await api.get('/api/notifications/')
    // console.log(data)
    return data
}

const vendorNotification = async () => {
    const { data } = await api.get('/api/notifications/')
    // console.log(data)
    return data
}


const NotificationPopover = ({
    anchorEl,
    open,
    onClose,
}) => {
    const popoverId = open ? 'notification-popover' : undefined;

    const notifications = useSelector(state => state.notification?.notifications);
    console.log("Notifications from redux:", notifications)
    const dispatch = useDispatch();

    const { data: adminNotifications } = useQuery({
        queryKey: ['adminNotifications'],
        queryFn: adminNotification,
    })
    const { data: vendorNotifications } = useQuery({
        queryKey: ['vendorNotifications'],
        queryFn: vendorNotification,
    })


    const user = useSelector((store) => store?.user)
    const role = user?.role

    // const notifications = role === "admin" ? adminNotifications : vendorNotifications
    // const notifications = lastJsonMessage?.message

    return (
        <Popover
            id={popoverId}
            open={open}
            anchorEl={anchorEl}
            onClose={onClose}
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
                {(!notifications || notifications.length === 0) ? (
                    <Typography variant="body2" color="textSecondary">
                        No new notifications
                    </Typography>
                ) : (
                    notifications
                        // .filter(note => note.is_read)
                        .map((note, index) => (
                            <Typography
                                key={note.id || index}
                                variant="body2"
                                sx={{ mb: 1, wordWrap: 'break-word', cursor: 'pointer' }}
                            >
                                • {note?.message}
                                {' '}
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
