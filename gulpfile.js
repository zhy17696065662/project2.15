var gulp=require('gulp');
var sass=require('gulp-sass');
var server=require('gulp-webserver');
var fs=require('fs');
var path=require('path');
var url=require('url');
var data=require('./src/datas/data.json');
var clean=require('gulp-clean-css');
var uglify=require('gulp-uglify');
var babel=require('gulp-babel');
var htmlmin=require('gulp-htmlmin');
var imagemin=require('gulp-imagemin')

//编译scss
gulp.task('scss',function(){
    return gulp.src('./src/scss/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./src/css/'))
})
//起服务
gulp.task('servers',function(){
    return gulp.src('./src/')
    .pipe(server({
        port:8888,
        open:true,
        livereload:true,
        host:'192.168.0.88',
        middleware:function(req,res,next){
            var pathname=url.parse(req.url).pathname;
            if(pathname=='/favicon.ico'){
                return res.end('')
            }else if(pathname=='/data/one'){
                res.end(JSON.stringify({code:1,data:data}))
            }else{
                var pathname=pathname=='/'?'index.html':pathname;
                res.end(fs.readFileSync(path.join(__dirname,'src',pathname)))
            }
        }
    }))
})
//监听scss
gulp.task('watch',function(){
    gulp.watch('./src/scss/*.scss',gulp.series('scss'))
})
//开发环境
gulp.task('dev',gulp.series('scss','servers','watch'))

//压缩css
gulp.task('ycss',function(){
    return gulp.src('./src/css/*.css')
    .pipe(clean())
    .pipe(gulp.dest('./bulid/css/'))
})
//压缩js
gulp.task('yjs',function(){
    return gulp.src('./src/js/*.js')
    .pipe(babel({
        presets:'es2015'
    }))
    .pipe(uglify())
    .pipe(gulp.dest('./bulid/js/'))
})
//复制压缩后的js
gulp.task('clones',function(){
    return gulp.src('./src/js/common/*.js')
    .pipe(gulp.dest('./bulid/js/common/'))
})
//压缩html
gulp.task('yhtml',function(){
    return gulp.src('./src/*.html')
    .pipe(htmlmin({
    collapseWhitespace: true
    }))
    .pipe(gulp.dest('./bulid/'))
})
//压缩图片
gulp.task('yimg',function(){
    return gulp.src('./src/img/*.jpg')
    .pipe(imagemin({
        optimizationLevel: 5
    }))
    .pipe(gulp.dest('./bulid/img/'))
})
//线上环境
gulp.task('devs',gulp.parallel('ycss','yjs','yimg','clones'))
