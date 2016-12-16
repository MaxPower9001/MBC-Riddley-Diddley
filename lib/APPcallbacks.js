var TX_INFO_CADS_APPCALLBacks  = "[INFO CaDS][AppCallbacks] "
var TX_GET_RECV   = "Get received for url ";


module.exports = {
    createApplicationServer: function (config) {
        var express = require('express');
        
        //var router = express.Router();
        var path = config.workspace;
        var app = express();
        
        // router.use(function (req,res,next) {
        //   next();
        // });
        
        app.use(express.static(path +'/'));

        app.get("/",function(req,res,next){
           console.info(TX_INFO_CADS_APPCALLBacks + TX_GET_RECV + req.originalUrl);
           next();
        });

         app.get('/smartphone', function (req, res) {
             console.log("smartphone.html served");
             res.sendFile(path + '/public/smartphone/smartphone.html');
         });
        
        // app.get('/fernseher', function (req, res) {
        //     console.log("fernseher.html served");
        //     res.sendFile(__dirname + '/public/fernseher/fernseher.html');
        // });
        
        //app.use("/",router);
                
        // catch 404 and forward to error handler
        // app.use(function (req, res, next) {
        //   var err = new Error('Not Found');
        //   err.status = 404;
        //   next(err);
        // });

        return app;
    }
};
