'use strict';
var https_service = require('request'),
    url = require('url'),
    config = require('../../../package.json').config,
    mongoose = require('mongoose'),
    User = mongoose.model('User');

exports.oauth2 = function( request, response, next) {
    var venmoUrl = 'https://api.venmo.com/v1/oauth/access_token';
    var parsedUrl = url.parse(request.url, true)
    //var authCode = parsedUrl.query.code; 
    var userId = request.body.userId; 
    var authCode = request.body.venmoCode; 
    console.log(request.body);
    var data = {
      "client_id": "1608",
      "client_secret": "CxVegjzgjB5UteXBqnpMCFZkbKb9dGTc",
      "code": authCode
    };
    console.log('In OAUTH2 :');
    console.log(data);
    https_service({
      method: "POST",
      url : venmoUrl, 
      form :  data
    }, function(err, resp, body){
        var body = JSON.parse( body );
        if(err || body.error || !body.access_token) {
          console.log('INVALID ACCESS:', body.error.message, '( Code ', body.error.code, ')');
          response.redirect(301, '/login');
        } else {
          console.log("AUTH SUCCESSFUL");
          request.body = body;
          request.userId = userId;
          next();
        }
    });
};

exports.router_auth = function(request, response, next) {
  //get id from request, check session_token
  var id = request.params.userId || request.query.userId || request.body.userId;
  var token = request.params.session_token || request.query.session_token || request.body.session_token;
  User.findById(id, "session_token", function(err, user) {
    if(err) {
      console.log("ERROR: ", err);
      response.send(404, 'Error authenticating');
    }
    else if (!user || user.session_token !== token) {
      response.send(401, 'Not Authorized - ' +  token);
    } else {
      request.authenticated_user = user;
      next();
    }
  });
};
