var spawn = require('child_process').exec;
hugo.on('new', function(data){
  spawn('start  "D:/BLOG/Typora/Typora.exe" ' + data.path);
});