import {
    PUSHER_CONFIG
} from 'Config'
import Pusher from 'pusher-js';
class PluginPusher {
    constructor(config) {
        this.config = config; // pusher配置
        this.initPusher()
        Pusher.logToConsole = process.env.NODE_ENV === 'production' ? false : true; // eslint-disable-line
    }
    initPusher() {
        this.pusher = new Pusher(this.config.APP_KEY, { // eslint-disable-line
            wsHost: this.config.wsHost,
            wsPort: this.config.wsPort,
            // forceTLS: true
        });

    }
}
export default new PluginPusher(PUSHER_CONFIG)['pusher']