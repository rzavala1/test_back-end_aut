const express=require('express');
const adsRouter=require('./ads.router');

function routerApi(app){
  const router=express.Router();
  app.use('/api/v1',router);
  router.use('/ads',adsRouter);
}

module.exports=routerApi;
