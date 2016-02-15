/*
 * Sender creates an peer connection
 * Sender creates an offer and sets its local descrition(onIceCandidate callback is also called and sent to the receiver)
 * Offer/candidate is sent to the receiver via signalling
 * Receiver add that ice candidate in its peer connection
 * Receiver received the offer and sets its remote description
 * Receiver creates an answer, sets its local description and send the answer to the sender
 */
(function() {
    var screenShareController = function($scope, screenShareService, eventManager, signallingService, sharingUser) {
        var pc, //peer connection
            minWidth = 1280,
            maxWidth = 1280,
            minHeight = 780,
            maxHeight = 780;

        $scope.selectedApp = null;
        $scope.sharingUser = sharingUser;

        $scope.$watch(function() {
                return sharingUser.peerId()
            },
            function(newVal) {
                if (newVal) {
                    // if receiver is changed then get the available window sources
                    screenShareService.getSources().then(function(data) {
                        $scope.availableSharingApps = data;
                    });
                }
            });

        $scope.selectApp = function(app) {
            $scope.selectedApp = app;
            if (sharingUser.peerId()) {
                signallingService.send("share screen", {
                    peerId: sharingUser.peerId()
                });
            }
        }

        signallingService.connect()
        // Whenever the server emits 'share screen', open a confirm dailog
        .add('share screen', function(data) {
            var accept = window.confirm('Do you accept screen sharing from ' + data.username);
            // data.id is the id of the user who wants to share the screen.
            if (accept) {
                sharingUser.peerId(data.id)
                sharingUser.isReceiver(true);
                signallingService.send("share screen status", {
                    status: 'accepted',
                    senderId: data.id
                });
            } else {
                signallingService.send("share screen status", {
                    status: 'rejected',
                    senderId: data.id
                });
            }
        })

        // event returning the status whether receiver accepted or rejected the sharing request
        .add('share screen status', function(data) {
            if (data.status === 'accepted') {
                alert("'" + data.username + "' accepted the sharing content.");
                // Start the sharing when receiver acknowledge to receive                
                startSharing();
            } else {
                sharingUser.isSender(false);
                sharingUser.peerId('');            
                alert("'" + data.username + "' rejected the sharing content.");
            }
        })

        .add('ice candidate received', function(data) {
            console.log('---------Ice Candidates Received-------------');
            for (var candidate in data.candidate) {
                pc.addIceCandidate(new RTCIceCandidate(data.candidate[candidate]));
            }
        })

        // setting the remote description of receiver and started the receiving
        .add('offer received', function(offer) {
            console.log('---------Offer Received-------------');
            sharingUser.peerId(offer.senderId);            
            $scope.startReceiving(offer);
        })

        // setting the remote description of sender sent by receiver
        .add('answer received', function(answer) {
            console.log('---------Answer Received-------------');            
            pc.setRemoteDescription(new RTCSessionDescription(answer.sdp));
        })

        // closing the connection when receiver closed his connection        
        .add('close peer connection', function(answer) {
            pc.close();
        });


        function startSharing() {
            // List of all ice candidates
            console.log('---------Started Sharing-------------');
            var iceCandidates = [];
            if (pc) {
                pc.close();
            }
            pc = new webkitRTCPeerConnection({}); //configuration to be passed                

            // send any ice candidates to the other peer
            pc.onicecandidate = function(evt) {
                console.log('---------On Ice Candidates-------------');
                if (evt.candidate) {
                    iceCandidates.push(evt.candidate);
                }
                // When all ice candidates are available then notify the receiver     
                else {
                    signallingService.send('share ice candidate', {
                        "candidate": iceCandidates,
                        "peerId": sharingUser.peerId()
                    });
                }
            };

            // get the local stream, set it in the local scope variable and send it
            navigator.webkitGetUserMedia({
                    audio: false,
                    video: {
                        mandatory: {
                            chromeMediaSource: 'desktop',
                            chromeMediaSourceId: $scope.selectedApp.id,
                            minWidth: minWidth,
                            maxWidth: maxWidth,
                            minHeight: minHeight,
                            maxHeight: maxHeight
                        }
                    }
                }, function(stream) {
                    console.log('---------Adding Stream To Connection-------------');
                    pc.addStream(stream);
                    // creating an offer to be sent to receiver
                    pc.createOffer(function(offer) {
                        console.log('---------Offer Created-------------');
                        pc.setLocalDescription(offer, function() {
                            console.log('---------Set Local Description-------------');
                            signallingService.send('share offer', {
                                "sdp": pc.localDescription,
                                "peerId": sharingUser.peerId(),
                                "senderId": sharingUser.id()
                            });
                        }, function(error) {});
                    }, function(error) {}, {});
                },
                function(error) {
                    console.log("Start Sharing error:: " + e.message);
                });
        }

        $scope.startReceiving = function(offer) {
            console.log('---------Started Receiving-------------');
            if (pc) {
                pc.close();
            }
            pc = new webkitRTCPeerConnection({}); //configuration to be passed                
            
            pc.setRemoteDescription(new RTCSessionDescription(offer.sdp), function() {
                    console.log('---------Set Remote Description-------------');
                    // answering to the offer given by the sender.
                    pc.createAnswer(function(answer) {
                            console.log('---------Create Answer-------------');
                            pc.setLocalDescription(answer, function() {
                                console.log('---------Set Local Description-------------');
                                signallingService.send('share answer', {
                                    "sdp": pc.localDescription,
                                    "senderId": offer.senderId
                                });
                            }, function(e) {
                                console.log(e);
                            });
                        },
                        function(e) {
                            console.log(e);
                        });
                },
                function(e) {
                    console.log(e);
                });

            // once remote stream arrives, show it in the remote video element
            pc.onaddstream = function(evt) {
                $scope.$apply(function() {
                    console.log('---------On Add Stream-------------');
                    $scope.remoteStream = evt.stream;
                });
            };
        }

        // close the current peer connections and report the sender to close his connection 
        $scope.stopReceiving = function() {
            pc.close();
            signallingService.send('close sender peer connection', {
                "senderId": sharingUser.id()
            });
        }

        $scope.getAllAvailableApps = function() {
            screenShareService.getSources().then(function(data) {
                $scope.availableSharingApps = data;
            });
        }
    }
    screenShareController.$inject = ['$scope', 'screenShareService', 'eventManager', 'signallingService', 'sharingUser'];
    module.exports = screenShareController;
})();