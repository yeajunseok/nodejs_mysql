var mysql      = require('mysql');
var connection = mysql.createConnection({ //node.js가 mysql 서버에 접속하려면 정보를 전달하는 부분.
  host     : '100.100.100.111',
  user     : 'root',
  password : '1qaz@WSX3edc',
  database : 'opentutorials' //mysql에서 use opentutorials 랑 같은 의미
});

connection.connect();

connection.query('SELECT * FROM topic', function (error, results, fields) {
  if (error) {
    console.log(error);
  }
  console.log(results);
});

connection.end();
//이 과정들은 mysql에 접속하려는 모든 클라이언트들은 모두 하게되어있다.
//node.js도 mysql서버에 대해는 클라이언트로서 동작하게 되는 것이다.
