var config = require('./config.js'),
    rfxcom = require('rfxcom'),
    rfxtrx = new rfxcom.RfxCom(config.serialPort, {debug: false}),
    lightwaverf = new rfxcom.Lighting5(rfxtrx, rfxcom.lighting5.LIGHTWAVERF),
    dsMoodSwitch = require('./dsMoodSwitch.js'),
    _ = require('underscore');

rfxtrx.initialise(function () {
});

rfxtrx.on("lighting5", function (evt) {
    var switchConfig = _.findWhere(config.switches, { id : evt.id });
    if (dsMoodSwitch.actions[evt.command]) {
        dsMoodSwitch.actions[evt.command](switchConfig, function (err, result) {
            if (err) {
                console.error(err.stack);
            }
        });
    }
});
