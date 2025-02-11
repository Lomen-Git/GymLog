const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')

class Exercise extends Model {}

Exercise.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    set(value) {
      this.setDataValue('name',
        value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
      )
    }
  }
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'Exercise'
})


module.exports = Exercise