/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

var time = new Date();
var testVariable = {storedMessageData: []};
var idCounter = 0;
var messageIdProperty = 'message_id';
var uniqueID = function() {
  idCounter++;
  var response = idCounter.toString();
  while (response.length < 6) {
    response = '0' + response;
    // console.log('STRING LENGTH' + response);
  }

  return response;
};

var requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  var defaultCorsHeaders = {
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'access-control-allow-headers': 'content-type, accept, authorization',
    'access-control-max-age': 10 // Seconds.
  };
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/
  // Do some basic logging.

  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  // The outgoing status.
  // var statusCode = 200;

  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;
  // response.writeHead(statusCode, headers);
  // Tell the client we are sending them plain text.
  //
  headers['Content-Type'] = 'application/json';
  // You will need to change this if you are sending something

  // other than plain text, like JSON or HTML.
  // console.log('type:', request.method);
  if (request.url !== '/classes/messages') {
    response.writeHead(404, headers);
    response.end();
  }


  if (request.method === 'GET' && request.url === '/classes/messages') {

    response.writeHead(200, headers);
    response.end(JSON.stringify(testVariable.storedMessageData));

  } else if (request.method === 'POST') {
    var messageNum = uniqueID();
    newMessage = [];
    request.on('data', (chunk) => {
      newMessage.push(chunk);

    }).on('end', () => {
      console.log(testVariable.storedMessageData);
      newMessage = JSON.parse(Buffer.concat(newMessage).toString());
      newMessage[messageIdProperty] = messageNum;

      testVariable.storedMessageData.push(newMessage);
      console.log(testVariable.storedMessageData);

      response.writeHead(201, headers);
      response.end(JSON.stringify(testVariable.storedMessageData));
    });


  } else if (request.method === 'OPTIONS') {

    response.writeHead(200, headers);
    response.end(JSON.stringify(testVariable.storedMessageData));
  }

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.


  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.

};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.


module.exports.requestHandler = requestHandler;