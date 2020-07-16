const m = require('./connect')

m.deleteOne('pic', {_id: '5f0d9ceefb161e6ff8e2bb1c'}).then(res => {
  console.log(res)
})

m.deleteMany('pic', {name: '测试2'}).then(res => {
  console.log(res)
})

m.find('pic', {name: '测试'}, {limit: 2}).then(r => {
  m.delete('pic', r.data).then(res => {
    console.log(res)
  })
})
