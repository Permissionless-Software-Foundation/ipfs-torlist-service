/*
  REST API library for /entry route.
*/

// Public npm libraries.
const Router = require('koa-router')

// Local libraries.
const OrbitDbRESTController = require('./controller')

let _this

class OrbitDbRouter {
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

    const dependencies = {
      adapters: this.adapters,
      useCases: this.useCases
    }

    // Encapsulate dependencies.
    this.orbitDbRESTController = new OrbitDbRESTController(dependencies)

    // Instantiate the router and set the base route.
    const baseUrl = '/orbitdb'
    this.router = new Router({ prefix: baseUrl })

    _this = this
  }

  attach (app) {
    if (!app) {
      throw new Error(
        'Must pass app object when attaching REST API controllers.'
      )
    }

    // Define the routes and attach the controller.
    this.router.get('/', _this.orbitDbRESTController.getDbEntries)
    this.router.get(
      '/c/:category',
      _this.orbitDbRESTController.getDbEntriesByCategory
    )

    // Attach the Controller routes to the Koa app.
    app.use(_this.router.routes())
    app.use(_this.router.allowedMethods())
  }
}

module.exports = OrbitDbRouter
