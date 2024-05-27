// src/services/webSocketService.js

class WebSocketService {
  constructor(url) {
    this.url = url;
    this.ws = null;
  }

  connect(onOpen, onClose, onError) {
    this.ws = new WebSocket(this.url);

    this.ws.onopen = onOpen;
    this.ws.onclose = onClose;
    this.ws.onerror = onError;
  }

  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(data);
    }
  }

  close() {
    if (this.ws) {
      this.ws.close();
    }
  }
}

export default WebSocketService;
