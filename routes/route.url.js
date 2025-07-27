const express = require("express");
const {generateShortUrl,FetchUrl,Anayltics}=require('../controllers/urlController')
const router= express.Router();

router.post("/",generateShortUrl);
router.get("/:shortId",FetchUrl);
router.get("/analytics/:shortId",Anayltics);

module.exports=router;