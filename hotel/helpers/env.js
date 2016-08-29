exports.database = function(){
  if(process.env.NODE_ENV == "production"){
    return 'database'
  } else {
    return 'localhost'
  }
}

exports.auth = function(){
  if(process.env.NODE_ENV == "production"){
    return 'auth'
  } else {
    return 'localhost'
  }
}

exports.search = function(){
  if(process.env.NODE_ENV == "production"){
    return 'search'
  } else {
    return 'localhost'
  }
}
