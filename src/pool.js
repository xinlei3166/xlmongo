const pool = require('generic-pool')
const MongodbClient = require('mongodb').MongoClient

const factory = function(url) {
  return {
    create: function() {
      return new Promise((resolve, reject) => {
        MongodbClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 10000}, function(err, client) {
          if (err) {
            reject(err)
          } else {
            resolve(client)
          }
        })
      })
    },
    destroy: function(db) {
      db.close()
    }
  }
}

const opts = {
  max: 10, // maximum size of the pool
  min: 2, // minimum size of the pool
  acquireTimeoutMillis: 10000
}

function createPool(url, _opts) {
  return pool.createPool(factory(url), {...opts, ..._opts})
}

module.exports = createPool

/*const myPool = pool.createPool(factory, opts)
const promise = myPool.acquire()

promise
  .then(function(client) {
    client.query('select * from foo', [], function() {
      // return object back to pool
      myPool.release(client)
    })
  })
  .catch(function(err) {
    // handle error - this is generally a timeout or maxWaitingClients
    // error
  })


myPool.drain().then(function() {
  myPool.clear()
})*/
