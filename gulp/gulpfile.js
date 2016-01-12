var gulp = require('gulp');
var fs = require('fs');
// var sanghiUtil = require('sanghi-utilities');
// console.log(sanghiUtil);
var currentDir = process.cwd();
var utils = {
	log: function(str){
		console.log(str);
		fs.appendFile('log.txt', '\n'+str, function (err) {
		  if (err) throw err;
		});
	},
	isFile: function(path){
		var stats = fs.lstatSync(path);
		return stats.isFile();
	},
	isDirectory: function(path){
		var stats = fs.lstatSync(path);
		return stats.isDirectory();
	},
	getFolderTree: function(folderPath, folderTree){
		if(this.isDirectory(folderPath)){
			var dir = fs.readdirSync(folderPath);
			for (var i = dir.length - 1; i >= 0; i--) {
				var file = dir[i];
				if(utils.isFile(folderPath + '/' + file)){		
					folderTree.files = folderTree.files ? folderTree.files : [];	  		
					folderTree.files.push(file);
				}
				else if(utils.isDirectory(folderPath + '/' + file)){
					folderTree.folders = folderTree.folders ? folderTree.folders : {};	  		
					folderTree.folders[file] = {};
					utils.getFolderTree(folderPath + '/' + file, folderTree.folders[file]);
				}	
  			};
		} 
		else{
			utils.log('Path "'+folderPath+'" is not a directory.');
		}
	}
}
gulp.task('default',['folderTree'], function() {

});

/*Clear the data of log.txt file*/
gulp.task('clearLog', function() {
	fs.appendFile('log.txt', '', {'flag':'w'}, function (err) {
	  if (err) throw err;
	});
});

gulp.task('folderTree',function(){
	// console.log('foldername: '+ process.argv);
	// return;
	var folderTree = {};
	utils.getFolderTree(currentDir+'/', folderTree);
	utils.log(JSON.stringify(folderTree));
  //   gulp.watch('./**.*.js',function(event){
  //   	folderTree = [];
		// utils.getFolderTree(currentDir+'/project', folderTree);
		// utils.log(folderTree);
  //   }); 
});