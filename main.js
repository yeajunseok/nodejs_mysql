var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js'); // 모듈을 갖고 올 떄는 requiret사용한다.
var path = require('path');
var sanitizeHtml = require('sanitize-html'); //node_modules이 모듈에서 sanitize-html를 찾는다.
var mysql = require('mysql'); //mysql 모듈을 갖고옴

var db = mysql.createConnection({
  host     : '100.100.100.111',
  user     : 'root',
  password : '1qaz@WSX3edc',
  database : 'opentutorials' //mysql에서 use opentutorials 랑 같은 의미
});

db.connect();

var app = http.createServer(function(request,response){ //request에는 웹브라우저가 보낸 정보들, response 응답할떄 우리가 웹 브라우저에게 보낼 정보들
  //웹 서버가 만들어. request는 클라->서버로, response는 서버->클 ex_200코드값
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;

    if(pathname === '/') {
      if(queryData.id === undefined) {
        db.query(`SELECT * FROM topic`, function(error, topics){
          var title = 'Welcoml';
          var de = 'Hello, Node.js';
          var list = template.list(topics);
          var html = template.html(title,list,
            `<h2>${title}</h2>${de}`,
            `<a href="/create">create</a>`
          );
          response.writeHead(200);
          response.end(html);
        });
      } else {
        db.query(`SELECT * FROM topic`, function(error, topics){
          if(error){
            throw error; //error를 콘솔에 보여주면서 애플리케이션을 직시 종료 시칸다.
          }
          //console.log(topics);
          db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?`, [queryData.id], function(error2, topic){ //where id=?, [queryData.id] 인 이유는 보안을 위해서
            if(error2){
              throw error2;
            }
            console.log(topic);
            //console.log(topic); //배열로 들어온다.
            console.log(topic[0].title);
            var title = topic[0].title;
            var de = topic[0].description;
            var list = template.list(topics);
            var html = template.html(title,list,
              `<h2>${title}</h2>
              ${de} 
              <p>by ${topic[0].name}</p>`,
              `<a href="/create">create</a>
               <a href="/update?id=${queryData.id}">update</a>
               <form action="delete_process" method="post" >
                <input type="hidden" name="id" value="${queryData.id}">
                <input type="submit" value="delete">
              </form>`
            );
            response.writeHead(200);
            response.end(html);
          })
        });
      }
    } else if(pathname === '/create') {
      db.query(`SELECT * FROM topic`, function(error, topics){
        db.query(`SELECT * FROM author`, function (error2, authors) {
          var title = 'create';
          var list = template.list(topics);
          var html = template.html(title,list,
            `<form action="http://localhost:3000/create_process" method="post">
              <p><input type="text" name="title" placeholder="title"></p>
              <p>
                <textarea name="description" placeholder="description"></textarea>
              </p>
              <p>
                ${template.authorSelect(authors)}
              </p>
              <p>
                <input type="submit">
              </p>
            </form>`,
            `<a href="/create">create</a>`
          );
          response.writeHead(200);
          response.end(html);
        });
      });
    } else if(pathname === '/create_process') {
      var body='';  //post형식으로 받은 데이터를 이렇게 받는다.
      request.on('data', function(data) { //request에는 웹브라우저가 보낸 정보들이있다, 요청한 정보안에 post정보가 있기 때문이다.
        body = body + data;
      });
      request.on('end', function() {
        var post = qs.parse(body);
        db.query(`
          INSERT INTO topic (title, description, created, author_id) 
          VALUES(?,?,NOW(),?)`, 
          [post.title, post.description, post.author], function(error, result){
          if (error) {
            throw error;
          }
          response.writeHead(302, {Location: `/?id=${result.insertId}`}); //리다이렉션, 사용자가 create_process에서 다른 페이지로 팅겨저 버리는거... 302는 페이지를 다른 쪽으로 리다이렉션 하는것.
          response.end();
        })
      });
    } else if (pathname === '/update') {
      db.query(`SELECT * FROM topic`, function(error, topics) {
        if(error){
          throw error;
        }
        db.query(`SELECT * FROM topic WHERE id=?`, [queryData.id], function(error2, topic){
          if (error2) {
            throw error2;
          }
          db.query(`SELECT * FROM author`, function (error2, authors) {
            var list = template.list(topics);
            var html = template.html(topic[0].title,list,
              `
              <form action="http://localhost:3000/update_process" method="post">
                <input type="hidden" name="id" value="${topic[0].id}">
                <p><input type="text" name="title" placeholder="title" value="${topic[0].title}"></p>
                <p>
                  <textarea name="description" placeholder="description">${topic[0].description}</textarea>
                </p>
                <p>
                  ${template.authorSelect(authors, topic[0].author_id)}
                </p>
                <p>
                  <input type="submit">
                </p>
              </form> `,
              `<a href="/create">create</a> <a href="/update?id=${topic[0].id}">update</a>`);
            response.writeHead(200);
            response.end(html);
          });
          
        });
      });
    } else if (pathname === "/update_process") {
      var body='';  //post형식으로 받은 데이터를 이렇게 받는다.
      request.on('data', function(data) { //request에는 웹브라우저가 보낸 정보들이있다, 요청한 정보안에 post정보가 있기 때문이다.
        body = body + data;
      });
      request.on('end', function() {
        var post = qs.parse(body);
        db.query('UPDATE topic SET title=?, description=?, author_id=? WHERE id=?', [post.title, post.description, post.author, post.id], function(error, result){
          response.writeHead(302, {Location: `/?id=${post.id}`}); //리다이렉션, 사용자가 create_process에서 다른 페이지로 팅겨저 버리는거... 302는 페이지를 다른 쪽으로 리다이렉션 하는것.
          response.end();
        })
      });
    } else if (pathname === "/delete_process") {
      var body='';  //post형식으로 받은 데이터를 이렇게 받는다.
      request.on('data', function(data) { //request에는 웹브라우저가 보낸 정보들이있다, 요청한 정보안에 post정보가 있기 때문이다.
        body = body + data;
      });
      request.on('end', function() {
        var post = qs.parse(body);
        var id = post.id;
        var filteredId = path.parse(id).base;
        db.query(`DELETE FROM topic WHERE id=?`, [post.id], function(error, result) {
          if (error) {
            throw error;
          }
          response.writeHead(302, {Location: `/`}); //리다이렉션, 사용자가 create_process에서 다른 페이지로 팅겨저 버리는거... 302는 페이지를 다른 쪽으로 리다이렉션 하는것.
          response.end();
        })
      });
    } else {
      response.writeHead(404);
      response.end('Not found');
    }
});
app.listen(3000);
