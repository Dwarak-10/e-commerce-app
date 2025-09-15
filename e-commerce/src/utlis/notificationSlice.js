import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    notifications: [],
    unreadCount: 0,
  },
  reducers: {
    addNotification(state, action) {
      const { message, unread_count } = action.payload;
      state.notifications.unshift({ message, timestamp: new Date().toISOString() });
      state.unreadCount = unread_count;
    },
    resetNotifications: (state) => {
      state.notifications = state.notifications.map(n => ({ ...n}));
      state.unreadCount = 0;
    },
    clearNotifications(state) {
      state.notifications = [];
      state.unreadCount = 0;
    },
  },
});

export const { addNotification, resetNotifications, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
