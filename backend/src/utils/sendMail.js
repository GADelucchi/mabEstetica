// Imports
const nodemailer = require('nodemailer')

const { gmailUser, gmailPassApp } = require('../../process/config.js')

// Code
const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: gmailUser,
        pass: gmailPassApp
    }
})

// Exports
exports.sendMail = async (email, subject, html) => {
    return await transport.sendMail({
        from: 'MAB Estética <>',
        to: email,
        subject: subject,
        html: html
    })
}