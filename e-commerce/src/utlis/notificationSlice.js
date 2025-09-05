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
    markAllRead(state) {
      state.unreadCount = 0;
    },
    resetNotifications(state) {
      state.notifications = [];
      state.unreadCount = 0;
    },
  },
});

export const { addNotification, markAllRead, resetNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
