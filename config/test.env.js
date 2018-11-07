'use strict'
const merge = require('webpack-merge')
const devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"testing"',
  BASE_API: '"http://101.201.152.181:9011"',
  BASE_API1: '"http://school.quxueabc.com/foreign_test/"',
  BASE_API_APP: '"http://101.201.152.181:9189"'
})
