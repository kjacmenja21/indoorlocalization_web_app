
class MqttService {

    brokerUrl = `ws://adaptiq.up.railway.app/api/v1/mqtt/ws`;

    constructor() {
        this.client = null;
        this.listeners = [];
    }

    connect() {
        if (!this.client) {

            this.client = new WebSocket(this.brokerUrl);

            this.client.onopen = () => {
                console.log("Connected to WebSocket.");
            };

            this.client.onmessage = (event) => {
                //console.log("Message", event.data);
                for(let listener of this.listeners) {
                    listener(event.data);
                }
            };

            this.client.onclose = () => {
                console.log("WebSocket connection closed.");
            };

            this.client.onerror = (error) => {
                console.error("WebSocket error:", error);
            };

        }
    }

    addListener(callback) {
        this.listeners.push(callback);
    }

    disconnect() {
        if (this.client) {
            this.client.close();
            this.client = null;
            this.listeners = [];
        }
    }
}

export const mqttService = new MqttService();
console.log('init mqtt service');