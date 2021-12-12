const assert = require('chai').assert
const config = require('../../../config')
const axios = require('axios').default

const util = require('util')
util.inspect.defaultOptions = { depth: 1 }

const LOCALHOST = `http://localhost:${config.port}`

const context = {}

describe('Orbit', () => {
  beforeEach(() => {})

  describe('GET /orbitdb', () => {
    it('should fetch all the data in the OrbitDB', async () => {
      const options = {
        method: 'GET',
        url: `${LOCALHOST}/orbitdb`,
        headers: {
          Accept: 'application/json'
        }
      }
      const result = await axios(options)
      assert.property(result.data, 'entries', 'entry property expected')
      const entries = result.data.entries

      context.entries = entries

      assert.isArray(entries)
      /*       assert.property(entries[0], '_id')
      assert.property(entries[0], 'entry')
      assert.property(entries[0], 'category')
      assert.property(entries[0], 'signature')
      assert.property(entries[0], 'slpAddress')
      assert.property(entries[0], 'description')
      assert.property(entries[0], 'balance')
      assert.property(entries[0], 'merit')

      assert.isNumber(entries.length) */
    })

    it('Should return the entries ignoring the blacklisted ones', async () => {
      const options = {
        method: 'GET',
        url: `${LOCALHOST}/orbitdb`,
        headers: {
          Accept: 'application/json'
        }
      }
      const result = await axios(options)

      assert.property(result.data, 'entries', 'entry property expected')

      const entries = result.data.entries
      assert.isArray(entries)

      /*      const entry = entries[entries.length - 1]
      assert.notEqual(entry._id, context.entryId)
      assert.isNumber(entries.length)
      assert.notEqual(entries.length, context.entries.length) */
    })
  })

  describe('GET /orbitdb/c/:category', () => {
    it('should fetch all the data in the OrbitDB with the given category', async () => {
      const options = {
        method: 'GET',
        url: `${LOCALHOST}/orbitdb/c/bch`,
        headers: {
          Accept: 'application/json'
        }
      }
      const result = await axios(options)

      assert.property(result.data, 'entries', 'entry property expected')
      const entries = result.data.entries
      assert.isArray(entries)

      /*     assert.property(entries[0], '_id')
      assert.property(entries[0], 'entry')
      assert.property(entries[0], 'signature')
      assert.property(entries[0], 'slpAddress')
      assert.property(entries[0], 'description')
      assert.property(entries[0], 'category')
      assert.property(entries[0], 'balance')
      assert.property(entries[0], 'merit')

      assert.isNumber(entries.length)

      const hasOtherCategories = entries.some((item) => item.category !== 'bch')
      assert.equal(hasOtherCategories, false, 'Contains differents categories') */
    })

    it('should return an empty array', async () => {
      const options = {
        method: 'GET',
        url: `${LOCALHOST}/orbitdb/c/mango`,
        headers: {
          Accept: 'application/json'
        }
      }
      const result = await axios(options)
      assert.isArray(result.data.entries)

      /*     assert.property(result.data, 'entries', 'entry property expected')
      const entries = result.data.entries
      assert(!entries.length, 'Expected empty array') */
    })

    it('Should return the entries ignoring the blacklisted ones', async () => {
      const options = {
        method: 'GET',
        url: `${LOCALHOST}/orbitdb/c/bch`,
        headers: {
          Accept: 'application/json'
        }
      }
      const result = await axios(options)

      assert.property(result.data, 'entries', 'entry property expected')

      const entries = result.data.entries
      assert.isArray(entries)

      /*     const entry = entries[entries.length - 1]

      assert.notEqual(entry._id, context.entryId)
      assert.isNumber(entries.length)
      assert.notEqual(entries.length, context.entries.length) */
    })
  })
})
