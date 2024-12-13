import mqtt from 'mqtt';

class MqttService {
    constructor() {
        this.client = null;
        this.listeners = [];
        this.isSimulating = false;
    }

    connect(brokerUrl, options = {}, simulate = false) {
        if (!this.client) {
            const optionsWithoutWs = {
                ...options,
                protocol: 'mqtt',
            };
            this.client = mqtt.connect(brokerUrl, optionsWithoutWs);

            this.client.on('connect', () => {
                console.log('Connected to MQTT broker via TCP!');
                if (simulate) {
                    this.startSimulating();
                }
            });

            this.client.on('error', (err) => {
                console.error('MQTT connection error:', err);
            });

            this.client.on('message', (topic, message) => {
                try {
                    const data = JSON.parse(message.toString());
                    this.listeners.forEach((callback) => callback(topic, data));
                } catch (error) {
                    console.error('Error parsing MQTT message:', error);
                }
            });
        }
    }

    startSimulating() {
        if (!this.isSimulating) {
            this.isSimulating = true;
            let assetId = 1;
            setInterval(() => {
                const locationData = this.generateAssetLocation(assetId);
                const topic = `assets/${assetId}/location`;
                this.client.publish(topic, JSON.stringify(locationData));
                console.log(`Simulated: Published to ${topic}: ${JSON.stringify(locationData)}`);
                assetId = assetId < 5 ? assetId + 1 : 1; // Loop through 5 assets
            }, 2000); // Simulate every 2 seconds
        }
    }

    generateAssetLocation(assetId) {
        const lat = Math.random() * 1000 % 199;
        const lon = Math.random() * 1000 % 199;
        return {
            asset_id: assetId,
            floormap_id: 1,
            x: lat,
            y: lon
        };
    }

    subscribe(topic, callback) {
        if (this.client) {
            this.client.subscribe(topic, { qos: 0 }, (err) => {
                if (err) {
                    console.error('Subscription error:', err);
                } else {
                    console.log(`Subscribed to topic: ${topic}`);
                }
            });
            this.listeners.push(callback);
        }
    }

    disconnect() {
        if (this.client) {
            this.client.end();
            this.client = null;
            this.listeners = [];
            console.log('Disconnected from MQTT broker');
        }
    }
}

export const mqttService = new MqttService();
