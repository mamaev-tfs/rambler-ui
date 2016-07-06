/* eslint strict: ['off'] */
// 1. Клонируем ветку gh-pages в определенную папку
// 2. Собираем через вебкак + gulp папку

'use strict'

const mkdirp = require('mkdirp')
const gulp = require('gulp')
const del = require('del')
const copy = require('gulp-copy')
const cp = require('child_process')
const path = require('path')
const webpack = require('webpack-stream')
const ghpages = require('gh-pages')
const webpackConfig = require('./webpack/config')
const buildGhPagesDir = __dirname + '/build-gh-pages'
const buildDir = __dirname + '/build'
const webpackSrc = __dirname + '/src/app.js'
const versionsFile = __dirname + '/versions.json'
const argv = require('minimist')(process.argv)
const config = require('./config')
const exec = (str) => {
  return cp.execSync(str).toString().trim()
}


gulp.task('gh-pages', ['webpack'], function () {
  // версии, для которых создаем папки

  const remoteUrl =  exec('git config --get remote.origin.url')
  const versions = argv.versions || ''
  const folders = versions.split(',')
  const message = argv.message || 'Update gh-pages'

  exec(`rm -rf ${buildGhPagesDir}`)
  exec(`
    git clone -b gh-pages ${config.ghPagesRepo} ${buildGhPagesDir};
  `)

  folders.forEach(function (folder) {
    const resFolder = path.join(buildGhPagesDir, folder)
    exec(`rm -rf ${resFolder}`)
    exec(`cp -r ${buildDir} ${resFolder}`)
  })

  exec(`cp ${versionsFile} ${buildGhPagesDir}/`)
  try {
    exec(`ln -sf ${buildGhPagesDir}/stable/* ${buildGhPagesDir}`)
  } catch (e) {
    console.error(e)
  }

  exec(`
    cd ${buildGhPagesDir};
    git commit -am '${message}';
    git push origin gh-pages:gh-pages;
  `)

})

gulp.task('webpack', ['clean'], function () {
  return gulp.src(webpackSrc)
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest(buildDir))
})

gulp.task('clean', function () {
  return del(buildDir)
})