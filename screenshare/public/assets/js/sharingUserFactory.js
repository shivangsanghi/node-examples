(function(){
 	var sharingUser = function(){
 		var _isSender,
 			_isReceiver,
 			_id,
 			_username,
 			_peerId="";
		return {
			isSender: function(isSender){
				if(typeof isSender === "boolean"){
					_isSender = isSender;
				}
				else{
					return _isSender;
				}
			},

			isReceiver: function(isReceiver){
				if(typeof isReceiver === "boolean"){
					_isReceiver = isReceiver;
				}	
				else{
					return _isReceiver;
				}
			},

			id: function(id){
				if(typeof id === "string"){
					_id = id;
				}	
				else{
					return _id;
				}
			},

			username: function(username){
				if(typeof username === "string"){
					_username = username;
				}	
				else{
					return _username;
				}
			},

			peerId: function(peerId){
				if(typeof peerId === "string"){
					_peerId = peerId;
				}	
				else{
					return _peerId;
				}
			}
		};
	}	
	module.exports = sharingUser;
})();