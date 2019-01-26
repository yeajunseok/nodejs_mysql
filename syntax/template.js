// \n은 줄 바꿈이다.
var name = 'k8805';
var letter = 'Dear '+name+'\n\nLorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. '+name+' Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa egoing qui officia deserunt mollit anim id est laborum. '+name;

//그러너 `~~~~`하면 더 쉽게 할 수 있다.
var letter = `Dear ${name}
Lorem ipsum dolor sit amet, 
consectetur adipisicing elit, 
sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
${name} Ut enim ad minim veniam, 
quis nostrud exercitation ullamco laboris 
nisi ut aliquip ex ea commodo consequat. 
${1000000+1000} Duis aute irure dolor in reprehenderit 
in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
Excepteur sint occaecat cupidatat non proident, 
sunt in culpa egoing qui officia deserunt mollit anim id est laborum. ${name}`;
console.log(letter);

var a = '1';