//var template = {  이랑 같은 의미이다.
module.exports = { //요것이 객체임
  html: function (title,list,body, control) {
    return `
    <!doctype html>
    <html>
    <head>
      <title>WEB2 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      ${list}
      ${control}
      ${body}
    </body>
    </html>
    `;
  },
  list: function (topics) {
    var list = '<ul>';
    var i = 0;
    while (i<topics.length) {
      list = list + `<li><a href="/?id=${topics[i].id}">${topics[i].title}</a></li>`; //topics[i].title이유는 topics[i]은 그냥 그 배열을 의미하며, topics[i].title하므로서 배열속 객체를 의미하게 된다.
      i = i + 1;
    }
    list = list+'</ul>';
    return list;
  },
  authorSelect: function (authors, author_id) {
    var tag = '';
    var i = 0; 
    while (i < authors.length) {
      var selected = '';
      if (authors[i].id === author_id) { //앞은 while문 안에서의 id, 뒤는 현재의 id
        selected = ' selected';
      }
      tag += `<option value = "${authors[i].id}"${selected}>${authors[i].name}</option>`;
      i++;
    }
    return `
    <select name="author">
     ${tag}
    </select>`
  }
}

//module.exports = template; template 객체를 모듈 밖에서 사용할 수 있게
