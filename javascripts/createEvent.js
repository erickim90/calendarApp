/**
 * Created by Kobe on 11/17/2016.
 */
$( document ).ready(function() {
	(function(){
		var sidebarCreate   = document.querySelector(".sidebar-create-event");
		var sliderCreateBtn = document.querySelector('#slider-create-btn');
		var sidebarOverlay  = document.querySelector(".sidebar-overlay");
		var createEventForm = document.querySelector('#createEventForm');
		var formElements    = document.querySelectorAll('.form-element');

		sidebarOverlay.addEventListener('click',function(){
			sidebarCreate.classList.remove('sidebar-show');
			sidebarOverlay.classList.add('hide');
		});

		sliderCreateBtn.addEventListener('click',function(){
			sidebarCreate.classList.add('sidebar-show');
			sidebarOverlay.classList.remove('hide');
		});

		//FORM COLLECTION
		createEventForm.addEventListener('submit',function(e) {

			e.preventDefault();

			var obj = {};

			formElements.forEach(function(x){
				if(x.value === ''){
					// console.log('ignore...');
				}
				else if(x.type === 'radio'){
					if(x.checked){
						obj[x.name] = x.value;
					}
				}
				else if(x.type === 'checkbox'){
					obj[x.name] = x.value;
					// if(x.checked){
					// 	if(obj[x.name]){
					// 		obj[x.value].push(x.value)
					// 	}
					// 	else{
					// 		obj[x.name] = [x.value]
					// 	}
					// }
				}
				else if(x.type === 'datetime-local'){
					obj[x.name] = new Date(x.value)
				}
				else{
					obj[x.name] = x.value;
				}
			});
			$.ajax({
				method: "POST",
				url: "http://thiman.me:1337/eric",
				data: obj,
				success: function( msg ) {},
				error: function( msg ) {console.log('Something went horribly wrong');}
			})
		});
	}());
});

// var Ajax = function(url,method, data,success,failure){
// 	var xhr = new XMLHttpRequest();
//
// 	xhr.onreadystatechange = function(){
// 		if (self.readyState === 4 && self.status === 200){
// 			// the request is complete, parse data and call callback
// 			var response = JSON.parse(self.responseText);
// 			success(response);
// 		}else if (self.readyState === 4) { // something went wrong but complete
// 			failure();
// 		}
// 	}
//
// 	xhr.open(method,url,true)
// 	xhr.send();
// };
// var calEvents = window.calEvents = [
// 	{
// 		_id:'00001',
// 		date: "2016-11-11",
// 		endTime: "14:22",
// 		event_name: "Herpderp",
// 		repeat_days: ['Sun','Mon','Tue'],
// 		repeat_value: "None",
// 		startTime: "11:11"
// 	},
// 	{
// 		_id:'00002',
// 		date: "2016-11-11",
// 		endTime: "14:22",
// 		event_name: "Event 2",
// 		repeat_days: ['Sun','Mon'],
// 		repeat_value: "None",
// 		startTime: "11:11"
// 	},
// 	{
// 		_id:'00003',
// 		date: "2016-11-11",
// 		endTime: "14:22",
// 		event_name: "Event 3",
// 		repeat_days: ['Mon','Tue'],
// 		repeat_value: "None",
// 		startTime: "11:11"
// 	}
// ];
// var Ajax = {
// 	xhr : null,
// 	request : function (method, url, data, success, failure){
// 		this.xhr = new XMLHttpRequest();
// 		// 0   Unsent
// 		// 1   Opened
// 		// 2   Headers received
// 		// 3   Loading
// 		// 4   Complete
// 		var self = this.xhr;
//
// 		self.onreadystatechange = function () {
// 			if (self.readyState === 4 && self.status === 200){
// 				// the request is complete, parse data and call callback
// 				var response = JSON.parse(self.responseText);
// 				success(response);
// 			}else if (self.readyState === 4) { // something went wrong but complete
// 				failure();
// 			}
// 		};
// 		this.xhr.open(method,url,true);
// 		if(method === "GET"){
// 			this.xhr.send();
// 		}
// 		else if(method === "POST"){
// 			this.xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
// 			this.xhr.send(JSON.stringify(data));
// 		}
// 		else{
// 			throw "Invalid HTTP request"
// 		}
// 	}
// };
// Ajax.request( "POST", "/createEvent", obj, function(data){
// 	console.log("Request was Succesful ", data);
// },function(){
// 	console.log("XHR request unsuccessful");
// });
