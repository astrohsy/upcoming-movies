// app/routes.js

// grab the nerd model we just created
var User = require('./models/users.js');
var Stat = require('./models/status.js');

// Configuration created
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

     // 회원가입
     app.post('/api/setup', function(req, res) {
       var newUser = new User({
         name : req.body.name,
         password: req.body.password,
         admin : true
       });

       var newStat = new Stat({
         name : req.body.name,
         genre : ['Action', 'Adventure', 'Comedy', 'Fantasy', 'Sci-Fi','Music', 'Documentary', 'Biography', 'Mystery','Thriller', 'Drama', 'Romance', 'Crime']
       });

       newUser.save(function(err) {
         if (err) throw err;

         newStat.save(function(err) {
           if(err) throw err;

           console.log('User saved successfully');
           res.json({ success: true });
         })
       });
     });


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
               expiresIn: 2440 // 24 hours
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

     app.post('/api/status/update', function(req, res) {

       /*
       Stat.remove({name : req.body.username })
        var newStat = new Stat({
        name : req.body.username,
        genre: req.body.genres,
      });


      newStat.save(function(err, res) {
        if(err) console.log('/api/status/update error');
      });

        console.log('User saved successfully');
        res.json({ success: true });

        */

        console.log('User saved successfully');
        Stat.update({name : req.body.username}, {$set: {genre : req.body.genres}}, function(err, user) {
          if(err) return err;
        });
     });

     app.post('/api/status/get', function(req, res) {
       Stat.findOne({name : req.body.name}, function(err, db_res) {
         if(err) {
           consoloe.log('api/status/get error');
           res.json({
             success : false
           });
         }

         if(db_res) {
           res.json({
             success : true,
             genre : db_res.genre
           });
         }
         else {
           res.json({
             success: true,
             genre : ['Action', 'Adventure', 'Comedy', 'Fantasy', 'Sci-Fi','Music', 'Documentary', 'Biography', 'Mystery','Thriller', 'Drama', 'Romance', 'Crime']
           });
         }
       });
     })



     app.get('/api/reviews', function(req, res) {
       res.json({
         reviews : movieInfos
       });
     });

     // route to return all users
     app.get('/api/users', function(req, res) {
       User.find({}, function(db_err, db_res) {
         res.json({status : db_res.status});
       });
     });

     // frontend routes =========================================================
     app.get('*', function(req, res) {
       res.sendfile('./public/index.html')
     })
 };
