# Home Automation

This is the beginnings of a home automation package. The first step is to control a hidden Linn DS from a remote switch. The switch I've chosen is a LightwaveRF Mood switch which has 6 buttons. 4 of these have been dedicated to controlling the DS:

* Toggle Off / Radio
* Play preset playlist 1
* Play preset playlist 2
* Play preset playlist 3

## Installation

Clone this repository onto your server and perform an `npm install` inside the node-rfxcom folder which will install all the dependencies. 

This project sends REST calls to another of my services https://github.com/bazwilliams/upnp-playlist-service which provides an API for adding playlists and changing the state of the DSs. This should also work with any Upnp device which has playlist support - Maybe Sonos? 

Set the serial port your RFXCom433 device is connected and the hostname and port where the upnp playlist service is running.
Then run the service, if you press a button on any switches, an error message should be logged with a message including the id of the switch. You will need to include this id the configuration of each switch. After deciding which device to control, add the uriRoot (which can currently be found from the upnp-playlist-service) below along with the id of the switch, friendly name of the switch and playlist configurations. 

Save all this in a `config.js` file in the root folder. An multi switch example follows. 

```javascript
module.exports = {
    serialPort: '/dev/ttyUSB0',
    hostname: 'localhost',
    port: 18080,
    switches: [{
        name: 'Bathroom',
        id: '0xF301B1',
        uriRoot: '/api/devices/4c494e4e-0026-0f21-f15c-01373197013f/',
        playlist1: 'Louise Relax',
        playlist2: 'Barry Bathroom Megamix',
        playlist3: 'Kids Bathtime'
    },{
        name: 'Kitchen',
        id: '0xF2FA39',
        uriRoot: '/api/devices/4c494e4e-0026-0f21-d74b-01333078013f/',
        playlist1: 'Louise Relax',
        playlist2: 'Easy Listening Bucket',
        playlist3: 'Jazzy',
    }]
};
```

For Linux, a template upstart script has been included in `etc/init/automation-service.conf` which assumes you have cloned the repository into `/opt/home-automation` it also assumes you have node.js installed and have a user called `nodejs` which has read and write privileges to the serial port, add group 'dialout' to 'nodejs'. Modify and copy this into your `/etc/init/` folder to enable you to start the service at boot automatically. 
