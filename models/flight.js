const mongoose = require('mongoose');

const oneYearFromNow = new Date();
oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

const Schema = mongoose.Schema;

const flightsSchema = new Schema({
    airline: {
        type: String,
        enum: ['American', 'Southwest', 'United', 'Delta', 'JetBlue'],
        required: true
      },
    airport: {
        type: String,
        enum: ['LGA', 'AUS', 'DFW', 'DEN', 'LAX', 'SAN'],
        default: 'LGA',
        required: true
    },
    flightNo: {
        type: Number,
        min: 10,
        max: 9999,
        required: true
    },
    departs: {
        type: Date,
        default: oneYearFromNow,
        required: true,
        validate: (value) => {
            if (value < new Date()) {
                throw new Error('Date must be in the future')
            }
        }
    },
}, {
    timestamps: true
});


module.exports = mongoose.model('Flight', flightsSchema)