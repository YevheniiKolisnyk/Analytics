const {Schema, model} = require('mongoose')

const categorySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  imageSrc: {
    type: String,
    default: '',
  },
  user: {
    ref: 'users',
    type: Schema.Types.ObjectId
  }
})

module.exports = model('categories', categorySchema)
