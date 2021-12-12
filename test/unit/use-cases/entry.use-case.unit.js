// Public npm libraries
const assert = require('chai').assert
const sinon = require('sinon')

// Local support libraries
// const testUtils = require('../../utils/test-utils')

// Unit under test (uut)
const EntryLib = require('../../../src/use-cases/entry')
const adapters = require('../mocks/adapters')
describe('#entry-use-case', () => {
  let uut
  let sandbox

  before(async () => {
    // Delete all previous users in the database.
    // await testUtils.deleteAllUsers()
  })

  beforeEach(() => {
    sandbox = sinon.createSandbox()

    uut = new EntryLib({ adapters })
  })

  afterEach(() => sandbox.restore())

  describe('#constructor', () => {
    it('should throw an error if adapters are not passed in', () => {
      try {
        uut = new EntryLib()

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(
          err.message,
          'Instance of adapters must be passed in when instantiating User Use Cases library.'
        )
      }
    })
  })

  describe('#createEntry', () => {
    it('should throw an error if entry is not provided', async () => {
      try {
        await uut.createEntry({})
        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, "Property 'entry' must be a string!")
      }
    })

    it('should throw an error if description is not provided', async () => {
      try {
        const inputData = {
          entry: 'entry'
        }
        await uut.createEntry(inputData)
        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, "Property 'description' must be a string!")
      }
    })

    it('should throw an error if slpAddress is not provided', async () => {
      try {
        const inputData = {
          entry: 'entry',
          description: 'test'
        }
        await uut.createEntry(inputData)
        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, "Property 'slpAddress' must be a string!")
      }
    })

    it('should throw an error if signature is not provided', async () => {
      try {
        const inputData = {
          entry: 'entry',
          description: 'test',
          slpAddress: 'simpleledger:qpnty9t0w93fez04h7yzevujpv8pun204qqp0jfafg'
        }
        await uut.createEntry(inputData)
        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, "Property 'signature' must be a string!")
      }
    })
    it('should throw an error if category is not provided', async () => {
      try {
        const inputData = {
          entry: 'entry',
          description: 'test',
          slpAddress: 'simpleledger:qpnty9t0w93fez04h7yzevujpv8pun204qqp0jfafg',
          signature:
            'IFytRg6KpvTHCzcW0ZwVhPqdKtRGpoRDcuEb958yIgJFUJlb1F5qPzt/JnlYE7r012BSFj+UT67DZVTU8oNB5vw='
        }
        await uut.createEntry(inputData)
        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, "Property 'category' must be a string!")
      }
    })
    it('should catch and throw DB errors', async () => {
      try {
        // Force an error with the database.
        sandbox.stub(uut, 'EntryModel').throws(new Error('test error'))

        const inputData = {
          entry: 'entry',
          description: 'test',
          slpAddress: 'simpleledger:qpnty9t0w93fez04h7yzevujpv8pun204qqp0jfafg',
          signature:
            'IFytRg6KpvTHCzcW0ZwVhPqdKtRGpoRDcuEb958yIgJFUJlb1F5qPzt/JnlYE7r012BSFj+UT67DZVTU8oNB5vw=',
          category: 'test'
        }

        await uut.createEntry(inputData)

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, 'test error')
      }
    })
    it('should throw error if signature is invalid', async () => {
      try {
        // Mocking bchjs functions
        sandbox.stub(uut.bchjs, '_verifySignature').callsFake(() => {
          return false
        })

        const inputData = {
          entry: 'entry',
          description: 'test',
          slpAddress: 'simpleledger:qpnty9t0w93fez04h7yzevujpv8pun204qqp0jfafg',
          signature:
            'IFytRg6KpvTHCzcW0ZwVhPqdKtRGpoRDcuEb958yIgJFUJlb1F5qPzt/JnlYE7r012BSFj+UT67DZVTU8oNB5vw=',
          category: 'test'
        }

        await uut.createEntry(inputData)

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, 'Invalid signature')
      }
    })
    it('should throw error for insufficient psf balance', async () => {
      try {
        // Mocking bchjs functions
        sandbox.stub(uut.bchjs, 'getPSFTokenBalance').resolves(0)

        const inputData = {
          entry: 'entry',
          description: 'test',
          slpAddress: 'simpleledger:qpnty9t0w93fez04h7yzevujpv8pun204qqp0jfafg',
          signature:
            'IFytRg6KpvTHCzcW0ZwVhPqdKtRGpoRDcuEb958yIgJFUJlb1F5qPzt/JnlYE7r012BSFj+UT67DZVTU8oNB5vw=',
          category: 'test'
        }

        await uut.createEntry(inputData)

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, 'Insufficient psf balance')
      }
    })

    it('should create a new entry in the DB', async () => {
      // Mocking bchjs functions
      // sandbox.stub(uut.bchjs, '_verifySignature').resolves(true)
      // sandbox.stub(uut.bchjs, 'getPSFTokenBalance').resolves(100)
      // sandbox.stub(uut.bchjs, 'getMerit').resolves(100)

      const inputData = {
        entry: 'entry',
        description: 'test',
        slpAddress: 'simpleledger:qpnty9t0w93fez04h7yzevujpv8pun204qqp0jfafg',
        signature:
          'IFytRg6KpvTHCzcW0ZwVhPqdKtRGpoRDcuEb958yIgJFUJlb1F5qPzt/JnlYE7r012BSFj+UT67DZVTU8oNB5vw=',
        category: 'test'
      }

      const result = await uut.createEntry(inputData)

      assert.property(result, 'entry')
      assert.isString(result.entry)

      assert.property(result, 'slpAddress')
      assert.isString(result.slpAddress)

      assert.property(result, 'description')
      assert.isString(result.description)

      assert.property(result, 'signature')
      assert.isString(result.signature)

      assert.property(result, 'category')
      assert.isString(result.category)

      assert.property(result, 'balance')
      assert.isNumber(result.balance)

      assert.property(result, 'merit')
      assert.isNumber(result.merit)
    })
  })

  describe('#filterEntries', () => {
    it('should throw an error if input is not an array', async () => {
      try {
        await uut.filterEntries({})
        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, 'Input must be an array of entries')
      }
    })
    it('should return array if input is an empty array', async () => {
      try {
        const result = await uut.filterEntries([])
        assert.isArray(result)
        assert.equal(result.length, 0)
      } catch (err) {
        assert.fail('Unexpected code path')
      }
    })

    it('should return the array if blacklist is empty', async () => {
      try {
        sandbox.stub(uut.BlacklistModel, 'find').resolves([])

        const result = await uut.filterEntries(['entry'])
        assert.isArray(result)
        assert.equal(result.length, 1)
      } catch (err) {
        assert.fail('Unexpected code path')
      }
    })

    it('should filter categories', async () => {
      try {
        const blacklist = [
          {
            hash: 'txid1'
          }
        ]

        const entries = [
          {
            _id: 'txid1'
          },
          {
            _id: 'txid2'
          }
        ]
        sandbox.stub(uut.BlacklistModel, 'find').resolves(blacklist)

        const result = await uut.filterEntries(entries)
        assert.isArray(result)
        assert.equal(result.length, 1)
        assert.notEqual(result[0]._id, blacklist[0].hash)
      } catch (err) {
        assert.fail('Unexpected code path')
      }
    })
  })

  describe('#getDbEntries', () => {
    it('should catch error', async () => {
      try {
        sandbox.stub(uut.orbitDB, 'getNode').throws(new Error('test error'))

        await uut.getDbEntries()
        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, 'test error')
      }
    })
    it('should get db entries', async () => {
      try {
        const entries = await uut.getDbEntries()
        assert.isArray(entries)
      } catch (err) {
        assert.fail('Unexpected code path')
      }
    })
  })
  describe('#getDbEntriesByCategory', () => {
    it('should throw error if input is not provided', async () => {
      try {
        await uut.getDbEntriesByCategory()
        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, 'category must be a string')
      }
    })
    it('should catch error', async () => {
      try {
        sandbox.stub(uut.orbitDB, 'getNode').throws(new Error('test error'))

        await uut.getDbEntriesByCategory('bch')
        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, 'test error')
      }
    })
    it('should get db entries', async () => {
      try {
        const entries = await uut.getDbEntriesByCategory('bch')
        assert.isArray(entries)
      } catch (err) {
        assert.fail('Unexpected code path')
      }
    })
  })
})
