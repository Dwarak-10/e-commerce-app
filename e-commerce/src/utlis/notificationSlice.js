import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    notifications: [],
};

const notificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        addNotification(state, action) {
            state.notifications.push(action.payload);
        },
        markNotificationRead(state, action) {
            const id = action.payload;
            const notification = state.notifications.find(n => n.id === id);
            if (notification) {
                notification.is_read = false;
            }
        },
        markAllRead(state) {
            state.notifications.forEach(n => {
                n.is_read = false;
            });
        },
        removeNotification(state, action) {
            const id = action.payload;
            state.notifications = state.notifications.filter(n => n.id !== id);
        },
        clearNotifications(state) {
            state.notifications = [];
        },
    },
});

export const {
    addNotification,
    markNotificationRead,
    markAllRead,
    removeNotification,
    clearNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;
