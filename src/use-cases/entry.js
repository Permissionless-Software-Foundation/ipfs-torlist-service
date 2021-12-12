const { wlogger } = require('../adapters/wlogger')

const EntryEntiy = require('../entities/entry')
class EntryLib {
  constructor (localConfig = {}) {
    // console.log('User localConfig: ', localConfig)
    this.adapters = localConfig.adapters
    if (!this.adapters) {
      throw new Error(
        'Instance of adapters must be passed in when instantiating User Use Cases library.'
      )
    }

    // Encapsulate dependencies
    this.EntryEntity = new EntryEntiy()
    this.EntryModel = this.adapters.localdb.Entry
    this.BlacklistModel = this.adapters.localdb.Blacklist
    this.bchjs = this.adapters.bchjs
    this.orbitDB = this.adapters.orbitDB
  }

  // Create a new entry model and add it to the Mongo database.
  async createEntry (entryObj) {
    try {
      // Input Validation
      const entryEntity = this.EntryEntity.validate(entryObj)

      // Verify that the entry was signed by a specific BCH address.
      const isValidSignature = this.bchjs._verifySignature(entryEntity)
      if (!isValidSignature) {
        throw new Error('Invalid signature')
      }

      // Verify psf tokens balance

      const psfBalance = await this.bchjs.getPSFTokenBalance(
        entryEntity.slpAddress
      )

      if (psfBalance < 10) {
        throw new Error('Insufficient psf balance')
      }

      const merit = await this.bchjs.getMerit(entryEntity.slpAddress)

      const updatedEntry = {
        entry: entryEntity.entry.trim(),
        slpAddress: entryEntity.slpAddress.trim(),
        description: entryEntity.description.trim(),
        signature: entryEntity.signature.trim(),
        category: entryEntity.category.trim(),
        balance: psfBalance,
        merit
      }

      const entryModel = new this.EntryModel(updatedEntry)
      await entryModel.save()

      return entryModel
    } catch (err) {
      // console.log("Error in use-cases/entry.js/createEntry()", err.message)
      wlogger.error('Error in use-cases/entry.js/createEntry()')
      throw err
    }
  }

  // Filter the entries and return only the
  // non-blacklisted ones
  async filterEntries (entries) {
    try {
      // Validate Inputs
      if (!Array.isArray(entries)) {
        throw new Error('Input must be an array of entries')
      }
      if (!entries.length) {
        return entries
      }

      // Get Black List
      const blacklist = await this.BlacklistModel.find()
      // console.log('blackList : ', blacklist)

      if (!blacklist.length) {
        return entries
      }

      const filteredEntries = []
      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i]
        const _match = blacklist.filter((val) => val.hash === entry._id)

        if (!_match.length) {
          filteredEntries.push(entry)
        }
      }

      return filteredEntries
    } catch (error) {
      console.log('Error in src/use-cases/entry.js/filterEntries()')
      throw error
    }
  }

  async getDbEntries () {
    try {
      // Get a handle on the OrbitDB node.
      const db = await this.orbitDB.getNode()
      // used for debugging.
      // const temp = db.get('')
      // console.log(`temp: ${JSON.stringify(temp, null, 2)}`)

      // Get the entries of the DB.
      const entries = db.get('')

      const filteredEntries = await this.filterEntries(entries)
      // Return the entries.
      return filteredEntries
    } catch (err) {
      console.log('Error in src/use-cases/entry.js/getDbEntries()', err)
      throw err
    }
  }

  async getDbEntriesByCategory (category) {
    try {
      if (!category || typeof category !== 'string') {
        throw new Error('category must be a string')
      }
      const db = await this.orbitDB.getNode()
      // Get the entries of the DB.
      const entries = db.query((item) => item.category === category)

      const filteredEntries = await this.filterEntries(entries)
      // Return the entries.
      return filteredEntries
    } catch (err) {
      console.log(
        'Error in src/use-cases/entry.js/getDbEntriesByCategory()',
        err
      )
      throw err
    }
  }
}

module.exports = EntryLib
