import React, { useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import { useDispatch } from 'react-redux';
import { addNotification, resetNotifications } from '../utlis/notificationSlice';

const userToken = JSON.parse(localStorage.getItem('user'))?.token;
const socketUrl = `wss://grpssf3g-8000.inc1.devtunnels.ms/ws/notifications/?token=${userToken}`

function WebSocketListener() {
    const dispatch = useDispatch();
    // dispatch(resetNotifications())

    const  {lastJsonMessage}  = useWebSocket(socketUrl);
    // console.log("Last JSON Message:", lastJsonMessage)
    useEffect(() => {
        if (lastJsonMessage) {
            const { message, unread_count } = lastJsonMessage;
            dispatch(addNotification({ message, unread_count }));
        }
    }, [lastJsonMessage, dispatch]);

    return null;
}

export default WebSocketListener;
