const express = require('express')
const app = express()
const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')
const cors = require('cors')

// Reitit
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
// Middleware
const { errorHandler } = require('./customMW/errorHandler')

app.use(cors()) // Salli pyynnöt kaikista osoitteista

// Miidlewaret
app.use(express.json())
// Reitit
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(errorHandler) // Viimeisenä !

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()