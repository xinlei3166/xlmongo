# Mongodb连接池和SQL语句封装

## 安装
```js
npm install xlmongo
yarn add xlmongo
```

## 初始化
```js
const Mongo = require('xlmongo')

const m = new Mongo({
  host: 'localhost',
  port: '27017',
  db: 'ft',
  user: 'ft',
  password: '123456'
})
```

## 插入文档
```js
m.insertOne('pic', { name: '测试', url: '测试.png' }).then(res => {
  console.log(res)
})

m.insertMany('pic', [{ name: '测试1', url: '测试1.png' }, { name: '测试2', url: '测试2.png' }]).then(res => {
  console.log(res)

  m.pool.drain().then(function() { // 在应用程序中只调用一次, 关闭并停止使用此池。
    m.pool.clear()
  })
})
```

## 删除文档
```js
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
```

## 更新文档
```js
m.updateOne('pic', {_id: '5f0eb289c6d7f27b8a498ed9', name: '测试'}, {$set:{name: '测试11111'}}).then(res => {
  console.log(res)
})

m.updateMany('pic', {name: '测试1'}, {$set:{name: '测试11111'}}).then(res => {
  console.log(res)
})

m.update('pic', [{oldData: {_id: '5f0eae133378f27ac488adcc', name: '测试1'}, newData: {$set:{name: '测试1111111111'}}},{oldData: {name: '测试2'}, newData: {$set:{name: '测试22222222'}}}]).then(res => {
  console.log(res)
})
```

## 查询文档
```js
m.findOne('pic', {_id: '5f0eb289c6d7f27b8a498ed9', name: '测试11111'}).then(res => {
  console.log(res)
})

m.find('pic', {name: '测试11111'}).then(res => {
  console.log(res)
})

m.find('pic', {name: '测试'}, {limit: 2}).then(res => {
  console.log(res)
})

m.find('pic', {name: '测试'}, { project: { _id: 0, name: 1}}).then(res => {
  console.log(res)
})

m.findOne('pic', {name: '测试'}, { projection: { _id: 0, name: 1}}).then(res => {
  console.log(res)
})
```
