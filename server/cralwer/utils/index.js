const fs = require('fs')

exports.saveFile = (src, mes) => new Promise((res, rej) => {
  fs.writeFile(src, JSON.stringify(mes, null, 4),function(err){
      if(err) rej()
      else res()
  });
})

exports.readFile = (src) => new Promise((res, rej) => {
  fs.readFile(src, 'utf8', function(err, data){
      if(err) rej()
      else res(JSON.parse(data))
  });
})

exports.sleep = (t = 500) => new Promise(res => {
  setTimeout(res, t)
})
