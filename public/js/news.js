   socket.on('news', function(value){
	if ($("#ul-news").children().length>15) {
		$( "#ul-news li:last-child" ).remove();
	}
	$( "#ul-news" ).first().prepend( "<li>"+value+"</li>" );
   });