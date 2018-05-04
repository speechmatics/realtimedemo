const gulp = require('gulp')
const gutil = require('gulp-util')
const process = require('process')
const webpack = require('webpack')

const webpackConfig = require('./webpack.config')

gulp.task('build', done => {
  gutil.log(
    `${gutil.colors.magenta('[process.env.NODE_ENV]')} ${process.env.NODE_ENV}`
  )
  webpack(webpackConfig, (error, stats) => {
    if (error) throw new gutil.PluginError('webpack', error)
    stats
      .toString({ colors: true })
      .split('\n')
      .map(line => {
        gutil.log(`${gutil.colors.blue('[webpack]')} ${line}`)
      })
    done()
  })
})
