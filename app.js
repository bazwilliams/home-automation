var config = require('./config.js'),
    rfxcom = require('rfxcom');
    rfxtrx = new rfxcom.RfxCom(config.serialPort, {debug: false}),
    lightwaverf = new rfxcom.Lighting5(rfxtrx, rfxcom.lighting5.LIGHTWAVERF),
    dsMoodSwitch = require('./dsMoodSwitch.js');

rfxtrx.initialise(function () {
    // lightwaverf.switchOn("0xFFFFFF/1");
});

rfxtrx.on("lighting5", function (evt) {
    if (dsMoodSwitch.actions[evt.command]) {
        dsMoodSwitch.actions[evt.command](function (err, result) {
            if (err) {
                console.error(err.stack);
            }
        });
    }
});
