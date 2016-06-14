Jade
=========
Variables
------
#{ }
!{ } 

vs

= "hello " + test.title
!= "hello " + test.title

Mixins
-------
Use a mixin: +welcome
Create mixin:
- mixin outputRating(rating)
    - for (var i = 1; .....)
        span.gly.....
Include mixin file: include _includes/mixins

Remote DB
============
heroku addons:add mongolab
heroku addons:docs mongolab
heroku config | grep MONGODB_URI
mongodb://heroku_v8wrdl9v:7vvuo4rsli04uteajk166vb7dj@ds013414.mlab.com:13414/heroku_v8wrdl9v
mongodb://username:password@localhost:27027/database

//dump/restores
mongodump -h localhost:27017 -d Loc8r -o ~/Desktop/src/testexpress/mongodump/
mongorestore -h ds013414.mlab.com:13414 -d heroku_v8wrdl9v -u heroku_v8wrdl9v -p 7vvuo4rsli04uteajk166vb7dj ~/Desktop/src/testexpress/mongodump/Loc8r/
// Remote DB shell
mongo ds013414.mlab.com:13414/heroku_v8wrdl9v -u heroku_v8wrdl9v -p 7vvuo4rsli04uteajk166vb7dj

heroku config:set NODE_ENV=production
NODE_ENV=production nodemon
In application we can now access NODE_ENV with process.env.NODE_ENV

// Access remote DB when running locally
NODE_ENV=production MONGOLAB_URI=mongodb://heroku_v8wrdl9v:7vvuo4rsli04uteajk166vb7dj@ds013414.mlab.com:13414/heroku_v8wrdl9v nodemon

Mongoose
=============
.find
.findById
.findOne
.geoNear
.geoSearch

.exec

?lng=-119.678576&lat=36.811873