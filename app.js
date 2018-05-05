
'use strict';

// [START app]
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var data="";
var data2="";
var data3="";
var data4="";
var data5="";
var pluginArrayArg;


app.use(express.static(__dirname + '/public'));
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});



//Start the server
/*
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
console.log(`App listening on port ${PORT}`);
console.log('Press Ctrl+C to quit.');
});
*/

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
console.log(`App listening on port ${PORT}`);
console.log('Press Ctrl+C to quit.');
});

io.on('connection', function (socket) {
	console.log("A client is connected.");
	if (data!="") {
		io.emit('chart1', data);
	}
	if (data2!="") {
		io.emit('chart2', JSON.stringify(pluginArrayArg));
	}
	/*
	if (data3!="") {
		io.emit('chart3', data3);
	}*/
});

  // [START pubsub_listen_messages]
  // Imports the Google Cloud client library
  const PubSub = require(`@google-cloud/pubsub`);

  // Creates a client
  const pubsub = new PubSub();
  const pubsub2 = new PubSub();
  const pubsub3 = new PubSub();
  const pubsub4 = new PubSub();
  //const pubsub5 = new PubSub();
  
  const subscriptionName = 'db-subscription';
  const subscriptionName2 = 'db2-subscription';
  const subscriptionName3 = 'db3-subscription';
  const subscriptionName4 = 'txn-subscription';
  //const subscriptionName5 = 'news-subscription2';
  
  const timeout = 60;

  // References an existing subscription
  const subscription = pubsub.subscription(subscriptionName);
  const subscription2 = pubsub2.subscription(subscriptionName2);
  const subscription3 = pubsub3.subscription(subscriptionName3);
  const subscription4 = pubsub4.subscription(subscriptionName4);
  //const subscription5 = pubsub5.subscription(subscriptionName5);
  
  
  // subscription message handler
  const messageHandler = message => {
	    console.log(`Received message ${message.id}:`);
	    console.log(`\tData: ${message.data}`);
	    
	    data = `${message.data}`;
	    io.emit('chart1', data); 
	  
	    message.ack();
	  };
	  

	    
subscription.on(`message`, messageHandler);

// subscription message handler
const messageHandler4 = message => {
	    console.log(`Received message ${message.id}:`);
	    console.log(`\tData 4: ${message.data}`);
	    
	    data4 = `${message.data}`;
	    io.emit('txn', data4); 
	  
	    message.ack();
	  };
	  

	    
subscription4.on(`message`, messageHandler4);



// subscription3 message handler
const messageHandler3 = message => {
	    console.log(`Received message ${message.id}:`);

	    data3 = `${message.data}`;
	    io.emit('chart3', data3); 
	    
	    console.log(`\tData 3: ${data3}`);
	  
	    message.ack();
	  };
	  

	    
subscription3.on(`message`, messageHandler3);



// subscription2 message handler
		var arr = new Array();
	  const messageHandler2 = message => {
		    console.log(`\tData: ${message.id}`);

    
		    data2 = JSON.parse(`${message.data}`);

		    arr[data2.key] = data2.value;

		    pluginArrayArg = new Array();
		    
		    var max = 0;
		    
		    for (var i in arr) {
		    		if (i==0) {
		    			max = arr[i];
		    		} else {
		    			 
		    			if (arr[i]>max) {
		    				max = arr[i];
		    			}
		    		}
		    }
		    
		    var ratio = 20/max;

		    for (var i in arr) {
		    	var jsonArg1 = new Object();
		        jsonArg1.password = i;
		        jsonArg1.category = 'News';
		        jsonArg1.size = arr[i]*ratio+1;

		        pluginArrayArg.push(jsonArg1);
		    }
		    
		    io.emit('chart2', JSON.stringify(pluginArrayArg)); 	
		    console.log(`\tValue: ${data2}`);
		    message.ack();
		  };
		  
		  
		  subscription2.on(`message`, messageHandler2);




// [END app]

