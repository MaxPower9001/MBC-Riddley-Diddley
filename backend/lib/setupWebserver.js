var TX_GET_RECV   = "Get received for url ";


module.exports = {
    createApplicationServer: function (config, ipaddr, port) {
        var express = require('express');
        
        var app = express();

        app.use(express.static('./'));

        app.get("/",function(req,res,next){
           console.info(TX_GET_RECV + req.originalUrl);
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


        var httpserver = require('http').Server(app);
        httpserver.listen(port, ipaddr);
        console.log("Server is listening on " + ipaddr + ":" + port);

        return httpserver;
    }
};
