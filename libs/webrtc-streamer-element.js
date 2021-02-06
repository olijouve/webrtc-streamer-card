import "/local/webrtc-streamer-card/libs/adapter.min.js";
import "/local/webrtc-streamer-card/libs/webrtcstreamer.js";

class WebRTCStreamerElement extends HTMLElement {
	static get observedAttributes() {
		return ['url', 'options', 'webrtcurl', 'notitle', 'width', 'height', 'algo'];
	}  
	
	constructor() {
		super(); 
		this.shadowDOM = this.attachShadow({mode: 'open'});
		this.shadowDOM.innerHTML = `
					<style>
					div {
						margin: 0 auto;
						text-align: center; 
						
					}
					video {
						margin: auto;
						left: 0;
						right: 0;            
						position: relative;
						background: black;
						width:100%;
						heigth:100%;
					}
					canvas {
						position: absolute;
						margin: auto;
						left: 0;
						right: 0;   
						z-index:999;
					}
					</style>
					<div id="content" >
						<video id="video" muted playsinline ></video>
					</div>
					`;
		this.initialized = false;
		this.titleElement = this.shadowDOM.getElementById("title");
		this.videoElement = this.shadowDOM.getElementById("video");

	}
	connectedCallback() {
		this.connectStream(true);
		this.initialized = true;
	}
	disconnectedCallback() {
		this.disconnectStream();
		this.initialized = false;
	}
	attributeChangedCallback(attrName, oldVal, newVal) {
		if (attrName === "notitle") {
			//this.titleElement.style.visibility = "hidden";
		} else if (attrName === "width") {
			this.videoElement.style.width = newVal;
		} else if (attrName === "height") {
			this.videoElement.style.height = newVal;
		} if (this.initialized) {
			this.connectStream((attrName !== "algo"));
		}
	}
	
	disconnectStream() {
		if (this.webRtcServer) {
			this.webRtcServer.disconnect();
			this.webRtcServer = null;
		}
	}

	connectStream(reconnect) {
		
		const webrtcurl = this.getAttribute("webrtcurl");

		let videostream;
		let audiostream;

		const url = this.getAttribute("url");
		if (url) {
			try {
				let urljson = JSON.parse(url);
				videostream = urljson.video;
				audiostream = urljson.audio;
			} catch (e) {
				videostream = url;
			}
			
			const notitle = this.getAttribute("notitle");
			if (notitle === null) {
				this.titleElement.innerHTML = videostream; 
			}
			this.videoElement.title = videostream;

			let imgLoaded;
			if (reconnect) {
				this.disconnectStream();
				this.webRtcServer = new WebRtcStreamer(this.videoElement, webrtcurl);
				this.webRtcServer.connect(videostream, audiostream, this.getAttribute("options"));

				imgLoaded = new Promise( (resolve,rejet) => {
					this.videoElement.addEventListener('loadeddata', (event) => { 
						resolve(event)
					});
				} );
			} else {
				imgLoaded = new Promise( (resolve) => resolve() );
			}
		}
	}	

	setVideoSize(width, height) {
		this.videoElement.width = width;
		this.videoElement.height = height;

	}

}

customElements.define('webrtc-streamer', WebRTCStreamerElement);
