/*
This file contains the route handler for REST API calls associated with
writing to the OrbitDB database.
*/

// const Blacklist = require('../../models/blacklist')
// const orbitDB = require('../../lib/orbitdb')
const crypto = require('crypto')
// const BCHJS = require('../../lib/bch')
// const config = require('../../../config')
let _this

class OrbitDbController {
  constructor (localConfig = {}) {
    // Dependency Injection.
    this.adapters = localConfig.adapters
    if (!this.adapters) {
      throw new Error(
        'Instance of Adapters library required when instantiating /entry REST Controller.'
      )
    }
    this.useCases = localConfig.useCases
    if (!this.useCases) {
      throw new Error(
        'Instance of Use Cases library required when instantiating /entry REST Controller.'
      )
    }

    // Encapsulate dependencies
    this.BlacklistModel = this.adapters.localdb.Blacklist
    // this.userUseCases = this.useCases.user
    this.crypto = crypto
    _this = this
  }

  /**
   * @api {get} /orbitdb Get all the data in the OrbitDB
   * @apiPermission public
   * @apiName getDbEntries
   * @apiGroup OrbitDB
   *
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X GET https://tor-list-api.fullstack.cash/orbitdb
   * curl -H "Content-Type: application/json" -X GET http://localhost:5003/orbitdb
   *
   * @apiSuccess {Object[]} entries Array of orbitdb data
   * @apiSuccess {string} users._id entry unique id
   * @apiSuccess {String} entry.entry site url
   * @apiSuccess {String} entry.slpAddress the slp address related to the site
   * @apiSuccess {String} entry.description a brief explanation of what's the site for
   * @apiSuccess {String} entry.signature site's signature
   * @apiSuccess {String} entry.category site's category
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "entries": [{
   *          "_id": "QmbYHhnXEdmdfUDzZKeEg7HyG2f8veaF2wBrYFcSHJ3mvd",
   *          "entry": "example.com",
   *          "category" : "simpleledger:qzl6k0wvdd5ky99hewghqdgfj2jhcpqnfqtaqr70rp",
   *          "signature" : "this is the sample page",
   *          "slpAddress" : "signature",
   *          "description" : "bch"
   *       }]
   *     }
   *
   */
  async getDbEntries (ctx) {
    try {
      const entries = await _this.useCases.entry.getDbEntries()

      ctx.body = { entries }
    } catch (err) {
      _this.handleError(ctx, err)
    }
  }

  /**
   * @api {get} /orbitdb/c/:category Get all the data in the OrbitDB
   * @apiPermission public
   * @apiName getDbEntriesByCategory
   * @apiGroup OrbitDB
   *
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X GET https://tor-list-api.fullstack.cash/orbitdb/c/bch
   * curl -H "Content-Type: application/json" -X GET http://localhost:5003/orbitdb/c/bch
   *
   * @apiSuccess {Object[]} entries Array of orbitdb data
   * @apiSuccess {string} users._id entry unique id
   * @apiSuccess {String} entry.entry site url
   * @apiSuccess {String} entry.slpAddress the slp address related to the site
   * @apiSuccess {String} entry.description a brief explanation of what's the site for
   * @apiSuccess {String} entry.signature site's signature
   * @apiSuccess {String} entry.category site's category
   *
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "entries": [{
   *          "_id": "QmbYHhnXEdmdfUDzZKeEg7HyG2f8veaF2wBrYFcSHJ3mvd",
   *          "entry": "example.com",
   *          "category" : "simpleledger:qzl6k0wvdd5ky99hewghqdgfj2jhcpqnfqtaqr70rp",
   *          "signature" : "this is the sample page",
   *          "slpAddress" : "signature",
   *          "description" : "bch"
   *       }]
   *     }
   *
   */
  async getDbEntriesByCategory (ctx) {
    try {
      // Get the entries of the DB.
      const category = ctx.params.category

      const filteredEntries = await _this.useCases.entry.getDbEntriesByCategory(
        category
      )
      // Return the entries.
      ctx.body = { entries: filteredEntries }
    } catch (err) {
      _this.handleError(ctx, err)
    }
  }

  // DRY error handler
  handleError (ctx, err) {
    console.log('err', err.message)
    // If an HTTP status is specified by the buisiness logic, use that.
    if (err.status) {
      if (err.message) {
        ctx.throw(err.status, err.message)
      } else {
        ctx.throw(err.status)
      }
    } else {
      // By default use a 422 error if the HTTP status is not specified.
      ctx.throw(422, err.message)
    }
  }
}

module.exports = OrbitDbController
