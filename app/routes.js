// app/routes.js

// grab the nerd model we just created
var User = require('./models/users');
var jwt  = require('jsonwebtoken');
var config = require('../config/db.js');
var reviewCrawler = require('./scaraping.js');
var movieInfos = require('../server.js')

 module.exports = function(app, movieInfos) {

     // server routes ===========================================================
     // handle things like api calls
     // authentication routes


     app.set('superSecret', config.secret);
     // sample api route

     app.post('/api/authenticate', function(req, res) {

       // Find the User
       User.findOne(
         { name: req.body.name },
          function(err, user) {

         if (err) throw err;

         if(!user) {
           res.json( { success: false, message: 'Authentication Failed. User not found'});
           console.log('not allowed');
         }
         else if(user) {

           // 비밀번호 확인
           if (user.password != req.body.password) {
             console.log('not2 allowed');
             res.json({ success: false, message: 'Authentication Failed. Wrong Password'});
           }
           else {
             // 유저 확인 됨.
             console.log('allowed');

             var token = jwt.sign(user, app.get('superSecret'), {
               expiresIn: 1440 // 24 hours
             });

             res.json({
               success: true,
               message: 'Enjoy your token!',
               token: token
             });
           }
         }
       });
     });


     app.use('/api', function(req, res, next) {
       var token = req.body.token || req.query.token || req.headers['x-access-token'];
       if (token) {
         // secret and exp 검사
         jwt.verify(token, app.get('superSecret'), function(err, decoded) {
           if (err) {
             return res.json({ success: false, message: 'Failed to authenticate the token'});
           }
           else {
             req.decoded = decoded;
             next();
           }
         });
       }
       else {
         return res.status(403).send({
           success: false,
           message: 'No token provided'
         });
       }

     });


     app.get('/api/reviews', function(req, res) {

       //-----------

       //-------------------------
       console.log(movieInfos.movieInfos);
       res.json({
         reviews : movieInfos
       });
     });


     // route to return all users
     app.get('/api/users', function(req, res) {
       User.find({}, function(err, users) {
         res.json(users);
       });
     });

     // User Db handle requests =================================================
     app.post('/api/setup', function(req, res) {
       var newUser = new User({
         name : req.body.name,
         password: req.body.password,
         admin : true
       });

       newUser.save(function(err) {
         if (err) throw err;

         console.log('User saved successfully');
         res.json({ success: true });
       });
     });

     // frontend routes =========================================================
     app.get('*', function(req, res) {
       res.sendfile('./public/index.html')
     })
 };
