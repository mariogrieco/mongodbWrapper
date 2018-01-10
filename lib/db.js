'use strict'

const MongoClient = require('mongodb').MongoClient

class db {
  constructor (config = {}) {
    this.name = config.name || 'myproyect'
    this.host = config.host || 'localhost'
    this.port = config.port || '27017'
    this.uri = `mongodb://${this.host}:${this.port}`
    this.connected = false
    this.conn = false
  }

  async connect () {
    if (this.connected) return new Error('already set connection')

    try {
// connect(url, user, password)
      this.conn = await MongoClient.connect(this.uri)
      this.connected = true

      return true
    } catch (err) {
      return new Error(err)
    }
  }

  async dbCreate () {
    if (!this.connected) return new Error('not connected')
    try {
      let dbConn = this.conn.db(this.name)
      let r = await dbConn.collection('test').insert({
        'demo': 'test'
      })

      return (r.insertedCount === 1)
    } catch (err) {
      return new Error(err)
    }
  }

  async dbDrop () {
    if (!this.connected) return new Error('not connected')
    try {
      let r = await this.conn.db(this.name).dropDatabase()

      return r
    } catch (err) {
      return new Error(err)
    }
  }

  async listDatabases () {
    if (!this.connected) return new Error('not connected')
    try {
// esto esta raro
      let adminDb = this.conn.db('admin').admin()
      let r = await adminDb.listDatabases()

      r = r.databases.map((db) => {
        return db.name
      })

      if (r.indexOf(this.name) !== -1) {
        return true
      } else {
        return new Error(`${this.name} not fount in [${r}]`)
      }
    } catch (err) {
      return new Error(err)
    }
  }

  async disconnect () {
    if (!this.connected) return new Error('not connected')
    try {
      this.conn.close()
      this.connected = false

      return true
    } catch (err) {
      return new Error(err)
    }
  }
}

module.exports = db
