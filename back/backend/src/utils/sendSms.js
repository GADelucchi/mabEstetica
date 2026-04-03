// Imports
const twilio = require('twilio')
const { twilioAuthToken, twilioAccountSid, myPhoneNumber, twilioPhoneNumber } = require('../../process/config')

// Code
const client = twilio(twilioAccountSid, twilioAuthToken)

// Exports
exports.sendSms = () => client.messages.create({
    body: 'SMS de prueba',
    from: twilioPhoneNumber,
    to: myPhoneNumber
})