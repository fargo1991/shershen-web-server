
module.exports.failPhoneConflict = function(res) {
  res.status(409);
  res.send({success: false, errMsg: 'Номер телефона уже занят'})
}

module.exports.failMailConflict = function(res){
  res.status(409);
  res.send({ success : false, errMsg : 'Почтовый адрес уже занят'})
}

module.exports.failLoginConflict = function(res){
  res.status(409);
  res.send({ success : false, errMsg : 'Login уже занят'})
}

module.exports.successResponse = function(res, obj){
  res.status(200);
  res.send({ success : true, obj : obj })
}

module.exports.failResponse = function(res) {
  res.status(500);
  res.send({ success: false, msg : 'Ошибка сервера'})
}

module.exports.invalidRequest = function (res, msg) {
  res.status(400);
  res.send({ success : false, msg : msg })
}
module.exports.notFound = function(res){
  res.status(404);
  res.send({ success : false, msg : 'Запрашиваемый ресурс не найден'})
}