/*
  Unit tests for the OrbitDb Adapter.
*/

const assert = require('chai').assert
const sinon = require('sinon')

const OrbitDBLib = require('../../../src/adapters/orbit-db')
const OrbitDBMock = require('../mocks/orbit-db-mock')

describe('#OrbitDb-adapter', () => {
  let uut
  let sandbox

  beforeEach(() => {
    uut = new OrbitDBLib()
    uut.orbit_lib = new OrbitDBMock()
    sandbox = sinon.createSandbox()
  })

  afterEach(() => sandbox.restore())

  describe('#startOrbit', () => {
    it('should throw an error if ipfs instance is not provided', async () => {
      try {
        await uut.startOrbit()

        assert.fail('Unexpected code path')
      } catch (err) {
        assert.include(err.message, 'The ipfs node must be an object')
      }
    })
    it('should return orbit db instance', async () => {
      const result = await uut.startOrbit({ ipfs: {} })

      assert.isObject(result)
    })
  })
  describe('#getNode', () => {
    it('should return orbit db node', async () => {
      await uut.startOrbit({ ipfs: {} })
      const dbNode = await uut.getNode()
      assert.isObject(dbNode)
    })
  })
})
