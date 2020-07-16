const createPool = require('./pool')
const { ObjectId } = require('mongodb')

class Mongo {
  constructor(connection, opts) {
    const { host, port, db, user, password } = connection
    const _port = port || 27017
    const _opts = opts || { max: 10, min: 2 }
    const _url = `mongodb://${user}:${password}@${host}:${_port}/${db}`
    this.db = db
    this.pool = createPool(_url, _opts)
  }

  // 从连接池获取连接
  async acquire() {
    let connect
    try {
      connect = await this.pool.acquire()
      return connect
    } catch (e) {
      throw Error('pool acquire error.')
    } finally {
      this.pool.release(connect)
    }
  }

  // 获取collection
  async collection(collection) {
    const connect = await this.acquire()
    if (connect) {
      return connect.db(this.db).collection(collection)
    }
  }

  // 执行语句
  async execute(collection, fn, err) {
    const c = await this.collection(collection)
    if (c) {
      try {
        return await fn(c)
      } catch (e) {
        console.log(`${err || 'execute'}: Error,`, e)
      }
    }
  }

  formatData(data) {
    if(data._id) {
      data._id = ObjectId(data._id)
    }
    return data
  }

  // 合并语句链条
  async chain(chain, k, v) {
    if (v){
      return await chain[k](v)
    }
  }

  // 插入一条数据
  async insertOne(collection, data) {
    return await this.execute(collection, async (c) => {
      const res = await c.insertOne(data)
      if (res.result.n > 0 && res.ops.length > 0) {
        return { id: res.insertedId }
      }
    }, 'insertOne')
  }

  // 插入多条数据
  async insertMany(collection, arr) {
    return await this.execute(collection, async (c) => {
      const res = await c.insertMany(arr)
      const length = arr.length
      if (res.result.n === length && res.ops.length === length) {
        return Object.values(res.insertedIds).map(id => ({ id }))
      }
    }, 'insertMany')
  }

  // 删除一条数据
  async deleteOne(collection, data) {
    return await this.execute(collection, async (c) => {
      const res = await c.deleteOne(this.formatData(data))
      if (res.result.n > 0) {
        return { n: res.result.n }
      }
    }, 'deleteOne')
  }

  // 删除匹配到的多条数据
  async deleteMany(collection, data) {
    return await this.execute(collection, async (c) => {
      const res = await c.deleteMany(this.formatData(data))
      if (res.result.n > 0) {
        return { n: res.result.n }
      }
    }, 'deleteMany')
  }

  async _delete(c, data) {
    const res = await c.deleteOne(this.formatData(data))
    if (res.result.n > 0) {
      return { n: res.result.n }
    }
  }

  // 删除多条数据
  async delete(collection, arr) {
    return await this.execute(collection, async (c) => {
      const all = await Promise.all(arr.map(x => this._delete(c, x)))
      const n = all.reduce((n, res) => {
        if (res) return n + res.n
      }, 0)
      return { n }
    }, 'delete')
  }

  // 修改一条数据
  async updateOne(collection, oldData, newData) {
    return await this.execute(collection, async (c) => {
      const res = await c.updateOne(this.formatData(oldData), newData)
      if (res.result.n > 0) {
        return { n: res.result.n }
      }
    }, 'updateOne')
  }

  // 修改匹配到得多条数据
  async updateMany(collection, oldData, newData) {
    return await this.execute(collection, async (c) => {
      const res = await c.updateMany(this.formatData(oldData), newData)
      if (res.result.n > 0) {
        return { n: res.result.n }
      }
    }, 'updateMany')
  }

  async _update(c, oldData, newData) {
    const res = await c.updateOne(this.formatData(oldData), newData)
    if (res.result.n > 0) {
      return { n: res.result.n }
    }
  }

  // 修改多条数据
  async update(collection, arr) {
    return await this.execute(collection, async (c) => {
      const all = await Promise.all(arr.map(x => this._update(c, x.oldData, x.newData)))
      const n = all.reduce((n, res) => {
        if (res) return n + res.n
      }, 0)
      return { n }
    }, 'update')
  }

  // 查询一条数据
  async findOne(collection, data) {
    return await this.execute(collection, async (c) => {
      return await c.findOne(this.formatData(data))
    }, 'findOne')
  }

  // 查询多条数据
  async find(collection, data, params={}) {
    const keys = ['sort', 'order', 'limit']
    return await this.execute(collection, async (c) => {
      let cursor = c.find(this.formatData(data))
      for (let [key, value] of Object.entries(params)) {
        if (!keys.includes(key)) {
          throw Error('Cursor Methods Params Error')
        } else {
          cursor = await this.chain(cursor, key, value)
        }
      }
      const _data = await cursor.toArray()
      const _total = await cursor.count()
      return { total: _total, data: _data }
    }, 'findOne')
  }
}

module.exports = Mongo
