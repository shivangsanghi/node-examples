var UserList = require('./userlist');
var Util = require('util');
var Path = require('path');

/*Provide globally available modules and variables*/
var Global = {
    'userList': new UserList(),
    /*Array filter function does not return instance of that class, else it return object.
	* arr = array from where to find item
	* property = on which property item will be searched
	* value = what will be the value for that property
    */
    'filter': function(arr,property,value){
    	for (var i = 0; i < arr.length; i++) {
    		var item = arr[i];
    		if(item[property] == value){
    			return item;
    		}
    	};
    	return null
    },
    /*Nodejs Util module*/
    Util: Util,
    Path: Path
};

module.exports = Global;