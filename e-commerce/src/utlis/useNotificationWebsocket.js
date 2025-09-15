import useWebSocket from 'react-use-websocket';

const userToken = JSON.parse(localStorage.getItem('user'))?.token;
const socketUrl = `wss://grpssf3g-8000.inc1.devtunnels.ms/ws/notifications/?token=${userToken}`;
export function useNotificationWebSocket() {
  const { sendJsonMessage } = useWebSocket(socketUrl);
  // console.log("WebSocket sendJsonMessage function:", sendJsonMessage);
  return sendJsonMessage;
}
