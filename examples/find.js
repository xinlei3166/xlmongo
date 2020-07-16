const m = require('./connect')

m.findOne('pic', {_id: '5f0eb289c6d7f27b8a498ed9', name: '测试11111'}).then(res => {
  console.log(res)
})

m.find('pic', {name: '测试11111'}).then(res => {
  console.log(res)
})

m.find('pic', {name: '测试'}, {limit: 2}).then(res => {
  console.log(res)
})
