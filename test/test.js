const Mongo = require('../dist/xlmongo.cjs')

const m = new Mongo({
  host: 'localhost',
  port: '27017',
  db: 'ft',
  user: 'ft',
  password: '123456',
})

afterAll(async () => {
  m.pool.drain().then(function () {
    // 在应用程序中只调用一次, 关闭并停止使用此池。
    m.pool.clear()
  })
})

describe('insert', () => {
  test('insertOne', () => {
    return m.insertOne('pic', { name: '测试', url: '测试.png' }).then((res) => {
      expect(res).toHaveProperty('_id')
    })
  })

  test('insertMany', () => {
    return m
      .insertMany('pic', [
        { name: '测试1', url: '测试1.png' },
        { name: '测试2', url: '测试2.png' },
      ])
      .then((res) => {
        expect(res).toContainEqual({ _id: expect.anything(String) })
      })
  })
})

describe('delete', () => {
  test('deleteOne', () => {
    return m
      .deleteOne('pic', { _id: '5f0d86399086556e10c15aca' })
      .then((res) => {
        if (res) {
          expect(res).toHaveProperty('n')
          expect(res.n).toBeGreaterThan(0)
        }
      })
  })

  test('deleteMany', () => {
    return m.deleteMany('pic', { name: '测试2' }).then((res) => {
      if (res) {
        expect(res).toHaveProperty('n')
        expect(res.n).toBeGreaterThan(0)
      }
    })
  })

  test('delete', () => {
    return m.find('pic', { name: '测试' }, { limit: 2 }).then((r) => {
      return m.delete('pic', r.data).then((res) => {
        if (res) {
          expect(res).toHaveProperty('n')
          expect(res.n).toBeGreaterThan(0)
        }
      })
    })
  })
})

describe('update', () => {
  test('updateOne', () => {
    return m
      .updateOne(
        'pic',
        { _id: '5f0eb289c6d7f27b8a498ed9', name: '测试' },
        { $set: { name: '测试11111' } }
      )
      .then((res) => {
        if (res) {
          expect(res).toHaveProperty('n')
          expect(res.n).toBeGreaterThan(0)
        }
      })
  })

  test('updateMany', () => {
    return m
      .updateMany('pic', { name: '测试1' }, { $set: { name: '测试11111' } })
      .then((res) => {
        if (res) {
          expect(res).toHaveProperty('n')
          expect(res.n).toBeGreaterThan(0)
        }
      })
  })

  test('update', () => {
    return m
      .update('pic', [
        {
          oldData: { _id: '5f0d9aed902de86fa2e1b006', name: '测试' },
          newData: { $set: { name: '测试1111111111' } },
        },
        {
          oldData: { _id: '5f0d9cc885121c6feff7772d', name: '测试' },
          newData: { $set: { name: '测试22222222' } },
        },
      ])
      .then((res) => {
        if (res) {
          expect(res).toHaveProperty('n')
          expect(res.n).toBeGreaterThan(0)
        }
      })
  })
})

describe('find', () => {
  const obj = {
    _id: expect.anything(String),
    name: expect.anything(String),
    url: expect.anything(String),
  }
  test('findOne', () => {
    return m
      .findOne('pic', { _id: '5f0eb289c6d7f27b8a498ed9', name: '测试11111' })
      .then((res) => {
        if (res) {
          expect(res).toMatchObject(obj)
        }
      })
  })

  test('find', () => {
    return m.find('pic', { name: '测试11111' }).then((res) => {
      expect(res.total).toBeGreaterThanOrEqual(0)
      if (res.data.length) {
        expect(res.data).toContainEqual(obj)
      } else {
        expect(res).toEqual([])
      }
    })
  })

  test('find limit', () => {
    return m.find('pic', { name: '测试' }, { limit: 2 }).then((res) => {
      expect(res.total).toBeGreaterThanOrEqual(0)
      if (res.data.length) {
        expect(res.data).toContainEqual(obj)
      } else {
        expect(res).toEqual([])
      }
    })
  })
})
