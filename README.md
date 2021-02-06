# webrtc-streamer-card
Homeassistant Lovelace card that stream zero delay video from webrtc-streamer(RTSP, H264, H265...)


You need a running Webrtc-streamer instance, see official repository for more details and full options :
https://github.com/mpromonet/webrtc-streamer

webrtc-streamer is based on live555 lib so it should be able to process MPEG, H.265, H.264, H.263+, DV or JPEG video, and several audio codecs.
http://www.live555.com/liveMedia/

Can be run the simplest way through Docker:
```docker run -p 8000:8000 -it mpromonet/webrtc-streamer```

Clone or uncompress this repo in your homeassistant www directory.

Custom card must be add as module in your dashboard ressources :
```
resources:
  - url: /local/webrtc-streamer-card/webrtc-streamer-card.js?v=0.1
    type: module
    
```

Then in Lovelace add your card manually 
```
type: 'custom:webrtc-streamer-card'
entity: camera.besder_substream
name: Garage subtream
stream_uri: 'rtsp://username:password@192.168.1.xxx:554/0/av0'
webrtc_server_url: 'http://127.0.0.1:8000/'

```

stream_uri : URI or label name of your original device video stream(RTSP,RTP). For label see webrtc-streamer documentation
webrtc_server_url : url and port of your webrtc-streamer instance

Please note this is only a visualisation card, no entity can be created and it is not streamable anywhere else than in a webrtc compatible browser, but it's still very nice for "realtime" PTZ positioning.

webrtc-streamer have crashed and over consummed my laptop ressources while stress testing it, but it seems to be best solution for my personnal case and play very nice with my cheap chinese cam.
Should diserve an add-on...


Disclaimer : This simple card is given as is, more as a proof of concept because i have no skills in lovelace card development and no support will be made.
Feel free to fork the repo, enhanced it and share it back.
