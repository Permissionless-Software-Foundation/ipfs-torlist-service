/*
  This library encapsulates code concerned with MongoDB and Mongoose models.
*/

// Load Mongoose models.
const Users = require('./models/users')
const Entries = require('./models/entry')
const Blacklist = require('./models/blacklist')
class LocalDB {
  constructor () {
    // Encapsulate dependencies
    this.Users = Users
    this.Entry = Entries
    this.Blacklist = Blacklist
  }
}

module.exports = LocalDB
