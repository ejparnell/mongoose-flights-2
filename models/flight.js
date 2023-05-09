const mongoose = require('mongoose');

const oneYearFromNow = new Date();
oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

const Schema = mongoose.Schema;

const destinationSchema = new Schema({
    airport: {
        type: String,
        enum: ['LGA', 'AUS', 'DFW', 'DEN', 'LAX', 'SAN'],
        required: true,
    },
    arrival: {
        type: Date,
        required: true,
    }
});

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
    destinations: {
        type: [destinationSchema],
        required: true,
    }
}, {
    timestamps: true
});




module.exports = mongoose.model('Flight', flightsSchema)