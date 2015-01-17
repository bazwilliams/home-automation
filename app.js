var config = require('./config.js'),
    rfxcom = require('./node-rfxcom/');
    rfxtrx = new rfxcom.RfxCom(config.serialPort, {debug: false}),
    lightwaverf = new rfxcom.Lighting5(rfxtrx, rfxcom.lighting5.LIGHTWAVERF),
    bathroomSwitch = require('./bathroom.js');

rfxtrx.initialise(function () {
    // lightwaverf.switchOn("0xFFFFFF/1");
});

rfxtrx.on("lighting5", function (evt) {
    console.log('Bathroom Light ' + evt.command + ' pressed');
    bathroomSwitch.actions[evt.command](function (err, result) {
        if (err) {
            console.error(err.stack);
        } else {
            console.log('Bathroom Light ' + evt.command + ' actioned');
        }
    });
});
