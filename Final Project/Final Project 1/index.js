const express = require('express');
const app = express();

app.use(express.json());

const MAX_KEG_VOLUME = 15.5;            // half-barrel full keg = 15.5 US gallons = 124 pints
const KEG_DISPENSE_AMOUNT = 0.125;      // = 1 US pint = 16 fl. oz.
const KEG_VOLUME_ALMOST_DRY = 1.55;     // = i.e., 10% of max volume

const kegState = new Map()
    .set(0, `Needs Refill`)
    .set(1, `Almost Dry`)
    .set(2, `Going Down`)
    .set(3, `Full`)

const kegs = [];

class Keg {
    constructor() {
        this.id = (!kegs || kegs.length === 0) ? 1
            : parseInt(
                kegs.map(keg => keg.id)
                    .sort()
                    .reverse()
                    .shift()) + 1;
        this.kegState = 3;
        this.kegVolume = MAX_KEG_VOLUME;
    }
}

kegs.push(new Keg());  // init office with at least 1 keg

const isNumeric = (n) => {
    return !isNaN(parseFloat(n)) && isFinite(n)
};

app.get('/', (req, res) => {
    res.send(`Welcome to Beer Tap API!`);
});

app.get('/office', (req, res) => {
    res.send(kegs);
});

app.post('/office/addKeg', (req, res) => {
    let newKeg = new Keg();
    kegs.push(newKeg);

    res.send({
        id: newKeg.id,
        state: kegState.get(newKeg.kegState)
    });
});

app.post('/office/:id/dispense', (req, res) => {
    let targetKeg = kegs.find(keg => keg.id.toString() === req.params.id);
    
    if (!targetKeg) {
        return res.status(404).send(`Keg not found.`);
    }

    if (targetKeg.kegVolume === 0) {
        return res.status(400).send(`No beer dispensed, selected keg is empty.`);
    }

    targetKeg.kegVolume -= KEG_DISPENSE_AMOUNT;
    targetKeg.kegState = targetKeg.kegVolume === 0 ? 0      // keg is empty, needs refill
        : targetKeg.kegVolume <= KEG_VOLUME_ALMOST_DRY ? 1  // keg is almost dry
        : 2;                                                // keg volume is going down

    res.send({
        id: targetKeg.id,
        state: kegState.get(targetKeg.kegState)
    });
});

app.post('/office/:id/replaceKeg', (req, res) => {
    let targetKeg = kegs.find(keg => keg.id.toString() === req.params.id);
    
    if (!targetKeg) {
        return res.status(404).send(`Keg not found.`);
    }

    let targetKegIndex = kegs.indexOf(targetKeg);
    let newKeg = new Keg();

    delete newKeg.id;
    Object.assign(targetKeg, newKeg);

    kegs.splice(targetKegIndex, 1, targetKeg);
    
    res.send({
        id: targetKeg.id,
        state: kegState.get(targetKeg.kegState)
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port} . . . `));