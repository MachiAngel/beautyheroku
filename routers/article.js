const express = require('express')
const Router = express.Router()

const beauty = require('../controller/beauty')

Router.get('/:id/images', (req, res) => { beauty.getBeautyArticleImagesById(req, res) })
Router.get('/list', (req, res) => { beauty.getLatestBeautyArticles(req, res) })
Router.get('/list2', (req, res) => { beauty.getLatestBeautyArticles2(req, res) })
Router.get('/randomimage', (req, res) => { beauty.getRandomImage(req, res) })
Router.get('/:id', (req, res) => { beauty.getBeautyArticleById(req, res) })
Router.get('/test', (req, res) => { res.json({test:'test'}) })


module.exports = Router