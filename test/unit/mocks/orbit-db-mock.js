/*
  Mocks for the orbit-db modules
*/

class OrbitDb {
  constructor () {
    this.id = 'id'
  }

  async createInstance () {
    return {
      identity: {
        id: 'Orbit-db-id'
      },
      docs: () => {
        return new DB()
      }
    }
  }

  async getNode () {
    return new DB()
  }
}
class DB {
  constructor () {
    this.id = 'db id'
  }

  load () {
    return true
  }

  get () {
    return []
  }

  query (entries) {
    return []
  }
}

module.exports = OrbitDb
