/**
 * SocketService
 * Handles WebSocket connections, reconnection logic, and event buffering.
 * Implements a Singleton pattern.
 */
class SocketService {
  private socket: WebSocket | null = null;
  private url: string = '';
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private eventBuffer: string[] = [];
  private listeners: Map<string, Array<(data: any) => void>> = new Map();
  private isExplicitlyDisconnected: boolean = false;

  // Status callbacks
  private onStatusChange: ((status: 'connecting' | 'connected' | 'disconnected' | 'reconnecting') => void) | null = null;

  constructor() {
    this.handleOpen = this.handleOpen.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  /**
   * Connect to the WebSocket server
   * @param url WebSocket URL
   */
  public connect(url: string) {
    if (this.socket?.readyState === WebSocket.OPEN) return;

    this.url = url;
    this.isExplicitlyDisconnected = false;
    this.notifyStatus('connecting');

    try {
      this.socket = new WebSocket(url);
      this.socket.onopen = this.handleOpen;
      this.socket.onmessage = this.handleMessage;
      this.socket.onclose = this.handleClose;
      this.socket.onerror = this.handleError;
    } catch (error) {
      console.error('[SocketService] Connection error:', error);
      this.scheduleReconnect();
    }
  }

  /**
   * Disconnect from the server
   */
  public disconnect() {
    this.isExplicitlyDisconnected = true;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.notifyStatus('disconnected');
  }

  /**
   * Send a message to the server
   * @param data Data to send
   */
  public send(data: any) {
    const message = JSON.stringify(data);

    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      console.log('[SocketService] Buffering message (offline):', data);
      this.eventBuffer.push(message);
    }
  }

  /**
   * Subscribe to event types
   * @param eventType Event type to listen for (or 'all' for all messages)
   * @param callback Callback function
   */
  public on(eventType: string, callback: (data: any) => void) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType)?.push(callback);
  }

  /**
   * Unsubscribe from event types
   */
  public off(eventType: string, callback: (data: any) => void) {
    if (!this.listeners.has(eventType)) return;

    const callbacks = this.listeners.get(eventType);
    if (callbacks) {
      this.listeners.set(
        eventType,
        callbacks.filter((cb) => cb !== callback)
      );
    }
  }

  /**
   * Set callback for connection status changes
   */
  public setStatusCallback(callback: (status: 'connecting' | 'connected' | 'disconnected' | 'reconnecting') => void) {
    this.onStatusChange = callback;
  }

  private handleOpen() {
    console.log('[SocketService] Connected');
    this.reconnectAttempts = 0;
    this.notifyStatus('connected');
    this.flushBuffer();
  }

  private handleMessage(event: MessageEvent) {
    try {
      const data = JSON.parse(event.data);

      // Notify 'all' listeners
      this.listeners.get('message')?.forEach((cb) => cb(data));

      // Notify specific listeners if data has a type
      if (data.type && this.listeners.has(data.type)) {
        this.listeners.get(data.type)?.forEach((cb) => cb(data));
      }
    } catch (e) {
      console.error('[SocketService] Parse error:', e);
    }
  }

  private handleClose(event: CloseEvent) {
    console.log('[SocketService] Closed:', event.reason);
    if (!this.isExplicitlyDisconnected) {
      this.notifyStatus('disconnected');
      this.scheduleReconnect();
    }
  }

  private handleError(event: Event) {
    console.error('[SocketService] Error:', event);
    // Error usually leads to close, which handles reconnect
  }

  private scheduleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.warn('[SocketService] Max reconnect attempts reached');
      return;
    }

    this.notifyStatus('reconnecting');
    const delay = Math.pow(2, this.reconnectAttempts) * 1000;
    console.log(`[SocketService] Reconnecting in ${delay}ms...`);

    this.reconnectTimer = setTimeout(() => {
      this.reconnectAttempts++;
      this.connect(this.url);
    }, delay);
  }

  private flushBuffer() {
    if (this.eventBuffer.length > 0 && this.socket?.readyState === WebSocket.OPEN) {
      console.log(`[SocketService] Flushing ${this.eventBuffer.length} buffered events`);
      while (this.eventBuffer.length > 0) {
        const message = this.eventBuffer.shift();
        if (message) this.socket.send(message);
      }
    }
  }

  private notifyStatus(status: 'connecting' | 'connected' | 'disconnected' | 'reconnecting') {
    if (this.onStatusChange) {
      this.onStatusChange(status);
    }
  }
}

export const socketService = new SocketService();
