var serve = require('koa-static');
const body = require('koa-better-body')
var koa = require('koa');
var fs = require('fs');
var path = require('path');
var router = require('koa-router')();
var app = koa();

// var OSS = require('ali-oss');
// var client = new OSS({
//     region: '',
//     accessKeyId: '',
//     accessKeySecret: ''
// });


app.use(function *(next){
  yield next;
  if (this.body || !this.idempotent) return;
  this.body = 'page not found';
});


app.use(serve(__dirname + '/public'));

router.post('/upload', body(), function * (next) {
    console.log(3333);
    var res;
    var files = JSON.parse(JSON.stringify({files: this.request.files})).files;
    if(files.length>0){ 
        for(var item in files){ 
            var tmpath = files[item]['path'];  
            var filename = files[item]['name'];
            var size = files[item]['size'];
            var ext ='.'+filename.split(".")[filename.split(".").length-1];
            var uploadname = parseInt(Math.random()*100) + Date.parse(new Date()).toString() + ext;
            var newpath = path.join('public/upload', uploadname);
            console.log(newpath);
            fs.writeFileSync(newpath,fs.readFileSync(tmpath));
            
            if(size>2*1024*1024){
                res = {
                    "res" : false,
                    "code" : 200,
                    "msg" : "文件过大",
                    "url" : "",
                }
            }else{
                // client.useBucket('test-fm');
                // var result = yield client.put(uploadname,tmpath);
                // console.log(result);
                res = {
                    "res" : true,
                    "code" : 200,
                    "msg" : "上传成功",
                    "url" : newpath.replace("public",""),
                }
            }
        }  
    }
    this.body = res;
    this.response.header["content-type"] = 'text/html;charset=utf-8';
    console.log(this.body)
    yield next;
})


app.use(router.routes())
app.listen(3002);
console.log('listening on port 3001');