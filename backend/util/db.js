const Sequelize = require('sequelize')
const { DATABASE_URL } = require('./config')
const { Umzug, SequelizeStorage } = require('umzug')

const sequelize = new Sequelize(DATABASE_URL)

const runMigrations = async () => {
  const migrator = new Umzug({
    migrations: {
      glob: 'migrations/*.js',
    },
    storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
    context: sequelize.getQueryInterface(),
    logger: console,
  })
  const migrations = await migrator.up()
  console.log('Migrations up to date', {
    files: migrations.map((mig) => mig.name),
  })
}

const connectToDatabase = async (retries = 5) => {
  try {
    await sequelize.authenticate()
    console.log('Authentication successful')
    await runMigrations()
    console.log('Database connected and migrations completed')
    return null
  } catch (err) {
    console.log(`Connecting to database failed. Retries left: ${retries}`)
    console.log(`Error: ${err.message}`)
    
    if (retries > 0) {
      console.log('Retrying in 5 seconds...')
      await new Promise(resolve => setTimeout(resolve, 5000))
      return connectToDatabase(retries - 1)
    } else {
      console.log('Max retries reached. Exiting...')
      return process.exit(1)
    }
  }
}

module.exports = { connectToDatabase, sequelize }