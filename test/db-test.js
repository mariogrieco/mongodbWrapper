'use strict'

const test = require('ava')
const Db = require('../')
const uuid = require('uuid-base62')
const config = {
  name: `demo_${uuid.v4()}`
}
let client = {}

test.before('db connection', async t => {
  client = new Db(config)
  let r = await client.connect()
  let db = await client.dbCreate()

  t.true(db, 'could not create db')
  t.true(r, 'could not connect to db ')
})

test('listDatabases', async t => {
  let r = await client.listDatabases()
  t.true(r)
})

test.after('db Drop', async t => {
  let r = await client.dbDrop()
  let e = await client.disconnect()

  t.truthy(r)
  t.true(e)
})
