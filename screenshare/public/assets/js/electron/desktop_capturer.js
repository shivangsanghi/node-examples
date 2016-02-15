(function(){
  
  var desktopCapturer = require('electron').desktopCapturer;

  

  function gotStream(stream) {
    var myVideo = document.getElementById('myVideo'); 
  	myVideo.src = URL.createObjectURL(stream);
  }

  function getUserMediaError(e) {
    console.log('getUserMediaError');
  }
})();