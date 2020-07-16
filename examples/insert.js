const m = require('./connect')

m.insertOne('pic', { name: '测试', url: '测试.png' }).then(res => {
  console.log(res)
})

m.insertMany('pic', [{ name: '测试1', url: '测试1.png' }, { name: '测试2', url: '测试2.png' }]).then(res => {
  console.log(res)

  m.pool.drain().then(function() { // 在应用程序中只调用一次, 关闭并停止使用此池。
    m.pool.clear()
  })
})

