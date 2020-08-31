const express = require('express')
const mongoose = require('mongoose')
const app = express()
const path = require('path')
const bodyParses = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const passport = require('passport')
const keys = require('./config/keys')
const passportMiddleware = require('./middleware/passport')
const authRoutes = require('./routes/auth')
const analyticsRoutes = require('./routes/analytics')
const categoryRoutes = require('./routes/category')
const orderRoutes = require('./routes/order')
const positionRoutes = require('./routes/position')

mongoose.connect(keys.mongoURI, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    })
    .then(() => {console.log('MongoDB connected')})
    .catch(e => {console.log(e)})

app.use(passport.initialize())
passportMiddleware(passport)

app.use(morgan('dev'))
app.use('/uploads', express.static('uploads'))
app.use(bodyParses.urlencoded({extended: true}))
app.use(bodyParses.json())
app.use(cors())

app.use('/api/auth', authRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/category', categoryRoutes)
app.use('/api/order', orderRoutes)
app.use('/api/position', positionRoutes)


if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/dist/client'))

  app.get('*', (req, res) => {
    res.sendFile(
        path.resolve(
            __dirname, 'client', 'dist', 'client', 'index.html'
        )
    )
  })
}

module.exports = app
