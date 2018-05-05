   socket.on('txn', function(value){

		console.log("txn socket.on");
	if ($("#ul-txn").children().length>15) {
		$( "#ul-txn li:last-child" ).remove();
	}
	$( "#ul-txn" ).first().prepend( "<li>"+value+"</li>" );
   });