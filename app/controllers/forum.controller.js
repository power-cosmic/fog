var Thread = require('../models/forums/thread'),
    Post = require('../models/forums/post'),
    MongoClient = require('mongodb').MongoClient,
    ObjectId = require('mongodb').ObjectID,
    url = "mongodb://localhost/fog-test";

var User = require('../models/users/user'),
    Post = require('../models/forums/post'),
    Thread = require('../models/forums/thread');

exports.postReply = function(req, res) {
  MongoClient.connect(url, function(err, db) {

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

        db.collection('threads').update(
          {_id: threadId},
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

exports.readThread = function(req, res) {
  res.render('forums/pages/forum-thread', {
    thread: req.thread
  });
};

exports.threadById = function(req, res, next, id) {

  MongoClient.connect(url, function(err, db) {

    var cursor = db.collection('threads').findOne({}, function(err, thread) {
      req.thread = new Thread().fromMongo(thread);
      db.close();
      next();
    });

  });
};
