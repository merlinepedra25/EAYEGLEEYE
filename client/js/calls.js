/// CONSTANTS ///
var getData_endpoint = "../getalldataset"	//This is the endpoint called to get information from flask
var dataset = [] 	//This is the dataset object that will be acessed by getAllData
var colors = {'red':"#FF0000", 'black':"#000000",'yellow':'#FFFF00','blue':'#0000FF','green':'#008000'} //List of colors for our graphs
var chart_type = {'main':'usage'} //This dictionary specifies which type of graph we have set up initially for each chart.
/// FUNCTIONS ///

///TEMPORARY BULLSHIT
chartdata = {
	datasets: [{
	        label: 'Host 1',
	        data: [{ x: -10, y: 0 }, { x: 0, y: 10 }, { x: 10, y: 5 }],
	        fill: false,
	        borderColor: colors.red,
	        pointRadius: 3
	    	},
	    	{
	    	label: 'Host 2',
	        data: [{ x: -5, y: 0 }, { x: 1, y: 10 }, { x: 6, y: 5 }],
	        fill: false,
	        borderColor: colors.blue,
	        pointRadius: 1
	    	}
	    	]
}

options = {
        scales: {
            xAxes: [{
                type: 'linear',
                position: 'bottom'
            }]
        },
        animation: false
    }

//Function call to get the the data from the ../getalldataset endpoint in flask
function getAllData(){
	$.get( getData_endpoint, function( data ) {
	  console.log(data);

	  //Check if we need to add any more clients to the website.
	  if ((dataset.clients == undefined) || (data.clients.length > dataset.clients.length)){
	  	n = 0
	  	if (dataset.clients != undefined){ n = dataset.clients.length}

	  	for (i = n; i < data.clients.length; i++){
			addClient(data.clients[i])
			console.log("Created: "+data.clients[i].mac)	
	  	}

	  }

	  refreshClientGraphs(data)	//Refresh Client Graphs
	  dataset = data 	//Update Dataset
	  

	  //alert( "Load was performed." );
		  
	});	
}


//Add a client to the front-end
function addClient(client){
	//new_client = document.getElementById('template_client_infobox').cloneNode(true)
	new_client =$("#template_client_infobox")
	new_client = new_client.html()
	//Replacing IDs
	while (new_client.search("XXXX") != -1){
		new_client = new_client.replace("XXXX",client.mac)
	}


	//Replacing Placeholders
	//new_client = new_client.replace("XXNAMEXX",client.name)
	new_client = new_client.replace("XXMACXX",client.mac)
	new_client = new_client.replace("XXIPXX",client.ip)
	new_client = new_client.replace("XXOSXX",client.os)
	//new_client.replace("XXUSAGEXX",client.usage) <- TODO

	c = document.getElementById('client_list')
	c.innerHTML += new_client

	chart_type[client.mac] = 0 //Initialize Chart Type
}

function refreshClientGraphs(data){
	clients = data.clients
	//Refresh a graph with new datapoints
  	for (i = 0; i < clients.length; i++){
  		
  		//Chart Type: 0 - Total Send/Recv usage
  		if (chart_type[clients[i].mac] == 0){ 

  			sentpoints = []
  			recvpoints = []



			for (j = 0; j < clients[i]["report"].length; j++){
				report = clients[i]["report"]
				//X-Axis
				time = new Date(report[j][0]*1000)
				//time = time.getHours()*100+ time.getMinutes()+(time.getSeconds()/100)
				console.log(report)
				//Y-Axis
				sentpoints.push({x: time, y: report[j][1]["sent"]})
				recvpoints.push({x: time, y: report[j][1]["recv"]})
				//console.info(report)
			}

  			console.log(sentpoints)
	  		chartdata = {
				datasets: [
							{label: 'Sent',
					        data: sentpoints,
					        fill: false,
					        borderColor: colors.red,
					        pointRadius: 3},

					    	{label: 'Recieved',
					        data: recvpoints,
					        fill: false,
					        borderColor: colors.blue,
					        pointRadius: 1}
				    	]
			}

			options = {
				scales: {
					xAxes:[{
						type: 'time',
                		position: 'bottom',
						scaleLabel:{
							display:true,
							labelString:"Time"
						},
						time:{
							displayFormats:{
								millisecond: "h:mm:ss",
								second: "h:mm:ss",
								minute: "h:mm:ss",
								hour: "h:mm:ss"
							}
						}
					}],
					yAxes:[{
						scaleLabel:{
							display:true,
							labelString:"# of Packets"
						}
					}]
				},
				// scaleOverride: true,
		  //       scales: {
		  //           xAxes: [{
		  //           	scaleSteps:1,
				// 		scaleStepWidth: 10,
		  //               type: 'time',
		  //               position: 'bottom',
		                // time:{
		                // 	format: "h:mm:ss a",
		                // 	unit: "second",
		                // 	displayFormats:{
		                // 		second: "h:mm:ss a",
		                // 	}
			                //min: (new Date((new Date()).getHours()-1)),
			                //max: (new Date((new Date()).getHours()+1))
		        //         }

		        //     }]
		        // },
		        animation: false
		    }	



			new Chart(clients[i].mac+"_chart", {
		    type: 'line',
		    data: chartdata,
		    options: options
			});
		}

		//Chart Type: 1 - UDP/TCP
		else if (chart_type[clients[i].mac] == 1){

		}
		
		//Chart Type: 3 - Portwise Chart
		else if (chart_type[clients[i].mac] == 2){

		}

		//Chart Type: 4 - Portwise Chart
		else{
			//Some Default.
		}


	}
}



function setup(){
	//Setup
	//
}


//This schedules the getAllData to be ran every 5 sec.
var interval = window.setInterval(getAllData, 5000);

