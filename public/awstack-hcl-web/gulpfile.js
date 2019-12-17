'use strict'

let gulp = require('gulp')
//通用模块
gulp.task("move",function(){
  //公用html
  gulp.src([
    './src/**/*.html',
    //'./src/*.html',
    './src/**/*.xlsx'
    ])
    .pipe(gulp.dest('./built'))

  //第三方js库
  gulp.src('./src/frontend_static/**/*.*')
    .pipe(gulp.dest('./built/frontend_static'))

  //配置
  gulp.src('./src/js/config.js')
    .pipe(gulp.dest('./built/js'))
})

gulp.task('default', ['move'])
gulp.task('private', ['move'])

