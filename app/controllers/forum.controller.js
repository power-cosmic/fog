var Thread = require('../models/forums/thread'),
    Post = require('../models/forums/post'),
    User = require('../models/users/user'),
    MongoClient = require('mongodb').MongoClient,
    ObjectId = require('mongodb').ObjectID,
    parseUrl = require('url').parse,
    database = require('../../config/config').db;

exports.postReply = function(req, res) {
  MongoClient.connect(database, function(err, db) {

    var reply = req.body,
        threadId = ObjectId(req.body.inThread);

    /*
     * Grab the thread from the db, and put the reply
     * in the correct location in the reply tree.
     * The save it again. I hope there's a cleaner
     * way to do this
     */
    db.collection('threads').findOne({_id: threadId}, function(err, doc) {
      if (doc) {

        /*
         * construct the js version of the thread and get the post
         * we are replying to
         */
        var thread = new Thread().fromMongo(doc);
        var replyTo = thread.getPost(reply.replyTo);

        // currently tyler gets credit for all posts
        replyTo.addReply(new Post('thoffma7', reply.content));

        db.collection('threads').update({_id: threadId},
          thread.toMongo(),
          function(err, result) {
            if (err) {
              console.log('error:', err);
            }
            db.close();
            res.json({status: 'success'});
        });
      } else {
        console.log('couldn\'t find thread');
        db.close();
        res.json({
          status: 'failure',
          message: 'invalid thead id'
        });
      }
    });

  });
};

exports.list = function(req, res) {
  getThreadsInRange(req.url, function(threads) {
    res.render('forums/pages/forum-list', {
      threads: threads
    });
  });
};

exports.new = function(req, res) {
  res.render('forums/pages/new-thread');
};

exports.create = function(req, res) {
  req.body.user = 'thoffma7';
  var body = new Thread().fromMongo(req.body);
  MongoClient.connect(database, function(err, db) {
    db.collection('threads').insertOne(
      body.toMongo()
    , function(err, result) {
      if (err) {
        db.close();
        res.json({status: 'failure'});
      } else {
        db.close();
        res.json({status: 'success'});
      }
    });
  });
};

exports.readThread = function(req, res) {
  res.render('forums/pages/forum-thread', {
    thread: req.thread
  });
};

var getThreadsInRange = function(url, callback) {
  var params = parseUrl(url, true).query,
      start = params.start || 0,
      count = params.count || 10;

  MongoClient.connect(database, function(err, db) {

    var cursor = db.collection('threads').find({}, {limit: count});
    var threads = [];

    cursor.each(function(err, doc) {
      if (doc) {
        threads.push(new Thread().fromMongo(doc));
      } else {
        db.close();
        callback(threads);
      }
    });

  });

};

exports.threadById = function(req, res, next, id) {

  MongoClient.connect(database, function(err, db) {

    try {
      id = new ObjectId(id);
      db.collection('threads').findOne({_id: new ObjectId(id)}, function(err, thread) {
        req.thread = thread? new Thread().fromMongo(thread): null;
        db.close();
        next();
      });
    } catch(e) {
      console.log('invalid id: ' + id);
      next();
    }

  });
};
