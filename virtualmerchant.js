/*
    Copyright 2013, Play Sports Live
    Evalon gateway wrapper
    
*/

var https = Npm.require('https');
var querystring = Npm.require('querystring');

if (!VirtualMerchant)
  VirtualMerchant = {};

function setup_response_handler(req, callback) {
    if (typeof callback !== "function") {
        //console.log("missing callback");
        return;
    }
    req.on('response',
        function(res) {
            //console.log('res: ',res.body);
            var response = '';
            res.setEncoding('utf8');
            res.on('data',
                function(chunk) {
                    //console.log('chunk: ',chunk);
                    response += chunk;
            });
            res.on('end',
                function() {
                    var err = null;
                    try {
                        var rr = response;
                        response = response.split("\n");
                        var r = {};
                        response.forEach(function(value,key){
                            var s = value.split("=");
                            r[s[0]] = s[1];
                        });
                        if(r.errorCode){
                            err = new Error(r.errorMessage);
                            err.name = r.errorName;
                            err.code = r.errorCode;

                            r = null;
                        }
                        
                    }
                    catch(e) {
                        err = new Error(e);
                        response = null;
                    }
                    callback(err, r);
            });
        });
    req.on('error', function(error){
        callback(error);
    });
}

VirtualMerchant = function (options) {
    var defaults = options || {};

    function _request(method, path, data, callback) {

        
        data.ssl_merchant_id = options.merchant_id;
        data.ssl_user_id = options.user_id;
        data.ssl_pin = options.pin;
        data.ssl_show_form = false;
        data.ssl_result_format = 'ASCII';
        data.ssl_transaction_type = 'ccsale';


        var request_data = querystring.stringify(data);

        var request_options = {
              host: 'demo.myvirtualmerchant.com',
              port: '443',
              path: path,
              method: method,
              headers: {
                  //'Authorization': auth,
                  'Accept': 'application/xml',
                  'Content-Type': 'application/x-www-form-urlencoded',
                  'Content-Length': request_data.length
              }
          };

        var req = https.request(request_options);
       
        setup_response_handler(req, callback);
        req.write(request_data);
        req.end();
    }

    function post(path, data, callback) {
        _request('POST', path, data, callback);
    }

    function get(path, data, callback) {
        _request('GET', path, data, callback);
    }

    function del(path, data, callback) {
        _request('DELETE', path, data, callback);
    }

    function normalizeArguments() {
        var args = arguments[0];
        if(typeof args[0] == 'object' && typeof args[1] == 'function' && !args[2])
            return { count: args[0].count, offset: args[0].offset, cb: args[1] };
        else
            return { count: args[0], offset: args[1], cb: args[2] };
    }

    return {
        charges: {
            capture: function (data, cb) {
                if (typeof data === 'function') {
                    cb = data;
                    data = {};
                } 
                post("/VirtualMerchantDemo/process.do", data, cb);
            },
            
        }
    };
}