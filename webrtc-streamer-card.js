import "/local/webrtc-streamer-card/libs/webrtc-streamer-element.js?module";

var LitElement =
  LitElement ||
  Object.getPrototypeOf(customElements.get("home-assistant-main"));
var html = LitElement.prototype.html;

class CameraCard extends LitElement {
  static get properties() {
    return {
      hass: {},
      _config: {}
    };
  }

  shouldUpdate(changedProps) {
    if (changedProps.has("_config")) {
      return true;
    }

    const oldHass = changedProps.get("hass");

    if (oldHass) {
      return (
        oldHass.states[this._config.entity] !==
        this.hass.states[this._config.entity]
      );
    }

    return true;
  }

  getCardSize() {
    return 3;
  }

  setConfig(config) {
    this._config = config;

  
  }

  render() {
    if (!this._config || !this.hass) {
      return html``;
    }

    const stateObj = this.hass.states[this._config.entity];

    if (!stateObj) {
      return html`
        ${this.renderStyle()}
        <ha-card>
          <div class="warning">
            Entity not available: ${this._config.entity}
          </div>
        </ha-card>
      `;
    }
    return html`
      ${this.renderStyle()}
      <ha-card .header=${this._config.name}>
        <webrtc-streamer url=${this._config.stream_uri} webrtcurl=${this._config.webrtc_server_url} options="rtptransport=tcp&timeout=10" notitle ></webrtc-streamer>
      </ha-card>
    `;
  }

  renderStyle() {
    return html`
      <style>
        .warning {
          display: block;
          color: black;
          background-color: #fce588;
          padding: 8px;
        }

      </style>
    `;
  }

  _moreInfo() {
    this._fireEvent(this, "hass-more-info", {
      entityId: this._config.entity
    });
  }

  _fireEvent(node, type, detail, options) {
    options = options || {};
    detail = detail === null || detail === undefined ? {} : detail;
    const event = new Event(type, {
      bubbles: options.bubbles === undefined ? true : options.bubbles,
      cancelable: Boolean(options.cancelable),
      composed: options.composed === undefined ? true : options.composed
    });

    event.detail = detail;
    node.dispatchEvent(event);

    return event;
  }
}

customElements.define("rtsp-webrtc-card", CameraCard);


