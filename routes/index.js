
exports.index = function(req, res){
	var http = require('http');
	var Client = require('node-rest-client').Client;
	var client = new Client();

	// Fetching Data from client (Pivotol) grails where db is mysql
	client.get("http://swatikasat.cfapps.io/gumballs.json", 
			function(data, response){
	            
	            var ar={};
	            
	            ar=data;
	            console.log(typeof ar);
	            console.log(ar[0].id);
	            var htmlVariable=[];
	            htmlVariable.push(ar[0].modelNumber);
	            htmlVariable.push(ar[0].serialNumber);
	            htmlVariable.push("NoCoinState");
	            htmlVariable.push(ar[0].countGumballs);
	            
	           
	            res.render('index', { message: htmlVariable });
	            
	        });
	
	
};

exports.GumballAction=function(req,res){
	
	var event=req.param('event');
	var state=req.param('state');
	var count=req.param('count');
	var modelNumber=req.param('modelNumber');
	var serialNumber=req.param('serialNumber');
	
	//Code for insert Quater
	if(event==='InsertQuater' && state==='NoCoinState'){
		
		//change state to has a coin
		state='HasACoin';
		var htmlVariable=[];
		
		//push all variable to htmlvariable which is rendered.
		htmlVariable.push(modelNumber);
		htmlVariable.push(serialNumber);
		htmlVariable.push(state);
		htmlVariable.push(count);
		//send the page to client.
		res.render('index', {message: htmlVariable});
		
	}
	//Code for Turn the Crank
	if(event==='TurnTheCrank' && state==='HasACoin'){
		var htmlVariableInPost=[];
		var Client = require('node-rest-client').Client;
		var client = new Client();
		
		//Take previous client state.
		client.get("http://swatikasat.cfapps.io/gumballs.json", function(data, response){
			var ar={};
            
            ar=data;
            
            var count=ar[0].countGumballs;
            
            if(count!==0){
            	count=count-1;
            	var args = {
            			  data: { countGumballs: count},
            			  headers:{"Content-Type": "application/json"} 
            			};
            	//Updating the state of machine
            	client.put("http://swatikasat.cfapps.io/gumballs/1", args, function(data,response) {
            	      
            	    console.log(data);
            	    // pushing the response to HTML page
            	    console.log(response);
            	    var htmlVariable=[];
            	    htmlVariable.push(modelNumber);
            	    htmlVariable.push(serialNumber);
            	    htmlVariable.push("NoCoinState");
            	    htmlVariable.push(count);
            		res.render('index', { message: htmlVariable});
            	});
            	
            }
			
			
		});
		
		
	}
	
};