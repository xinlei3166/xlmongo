const m = require('./connect')

m.updateOne('pic', {_id: '5f0eb289c6d7f27b8a498ed9', name: '测试'}, {$set:{name: '测试11111'}}).then(res => {
  console.log(res)
})

m.updateMany('pic', {name: '测试1'}, {$set:{name: '测试11111'}}).then(res => {
  console.log(res)
})

m.update('pic', [{oldData: {_id: '5f0eae133378f27ac488adcc', name: '测试1'}, newData: {$set:{name: '测试1111111111'}}},{oldData: {name: '测试2'}, newData: {$set:{name: '测试22222222'}}}]).then(res => {
  console.log(res)
})
