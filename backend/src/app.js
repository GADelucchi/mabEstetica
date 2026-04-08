// Imports
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUiExpress = require('swagger-ui-express');
const routerServer = require('./routes/index.router');
const { port } = require('../process/config');
// const { admin, serviceAccount } = require('./config/firebaseConfig');

// Code
const app = express();

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount)
// })
// console.log('Firebase Admin inicializado correctamente!');


app.use(express.json())
const corsOptions = {
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500', 'https://mabestetica.onrender.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    // allowedHeaders: ['Content-Type', 'Authorization'],
    // exposedHeaders: ['set-cookie'],
    // preflightContinue: false,
    credentials: true
};
app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: true }))
app.use(morgan(`dev`))

app.use(cookieParser(`P@l@braS3cre3t0`))

// initPassport()
passport.use(passport.initialize())

// Port
const httpServer = app.listen(port, (error) => {
    if (error) console.log(`Error en el servidor`, error)
    console.log(`Escuchando en el puerto: ${port}`);
})

// Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentación de MABESTETICA',
            description: 'Esta es la documentación de MABESTETICA'
        }
    },
    apis: [`${__dirname}/docs/**/*.yaml`]
}

const specs = swaggerJsDoc(swaggerOptions)

app.use('/api', routerServer);