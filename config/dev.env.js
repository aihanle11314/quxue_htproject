'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://123.56.225.41:9011"',
  BASE_API_TEST: '"http://101.201.152.181:9011"',
  BASE_API1: '"http://school.quxueabc.com/foreign/"',
  BASE_API1_TEST: '"http://school.quxueabc.com/foreign_test/"',
  BASE_API_APP: '"http://english.talk.quxueabc.com"',
  BASE_API_APP_TEST: '"http://101.201.152.181:9189"'
})
