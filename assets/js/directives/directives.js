(function(){
    ngjsmx = angular.module('ngjsmx');

    ngjsmx.directive('threeModel', ['$window', 'ThreeModel', 'sailsIO', function(window,ThreeModel, ws) {
        var threeModelObject = {
            restrict: 'A',
            link: function (s,e,a) {
                var ngl = window.angular.element;
                var container = e[0];

                var processAspectRatio = function(aspectRatio) {
                    var aR = aspectRatio.split(':',2);
                    return {
                        width: aR[0],
                        height: aR[1]
                    }
                };

                s.refreshId = 'Nadie';

                if ( ! Detector.webgl ) {
                    Detector.addGetWebGLMessage();
                    container.innerHTML = "";
                } else {
                    var canvas = window.document.createElement('canvas');
                    var aspectRatioAttr = a.aspectRatio || '16:9';
                    var aspectRatio = processAspectRatio(aspectRatioAttr);
                    var canvasProperties = {
                        element: canvas,
                        width: container.clientWidth,
                        height: Math.round( (container.clientWidth * ( aspectRatio.height / aspectRatio.width )) )
                    };

                    ngl(canvas).css({ width: canvasProperties.width+'px', height: canvasProperties.height+'px' });
                    container.appendChild(canvas);

                    ThreeModel.init(canvasProperties);

                    var onDataFn = function(data) {
                        // We are currently ignoring position data
                        ThreeModel.setMarkerPosition(data.id, data.orientation);

                        s.$apply(function () {
                            s.refreshId = data.id;
                        });
                    };

                    ws.setDeviceDataFn(onDataFn);
                }
            },
            templateUrl: '../../ngTemplates/threemodel.html'
        };

        return threeModelObject;
    }]);

    ngjsmx.directive('userList', function() {
        var userListObject = {
            restrict: 'A',
            link: function (s,e,a) {
                console.log('Inside User List');
            }
        };

        return userListObject;
    });

    ngjsmx.directive('deviceManager', function() {
        var deviceManagerObject = {
            restrict: 'A',
            controller: ['$window', '$scope', 'sailsIO', function(window, s, ws){
                console.log('Inside device manager');
                self = this;

                var joinCb = function( res, rwjson ){
                    self.socketId = res.id;
                    s.$emit('idReady',{id: self.socketId});
                };

                ws.joinRoom(joinCb);
            }]
        };

        return deviceManagerObject;
    });

    ngjsmx.directive('deviceState',['$window', function(window) {
        var deviceStateObject = {
            restrict: 'A',
            require: '^^deviceManager',
            link: function(s,e,a, devManager) {
                s.state = 'No Conectado';
                s.id = null;

                var socketReady = function (ev,data) {
                    s.state = 'Conectado';
                    s.id = data.id;
                };

                s.$on('idReady', socketReady);
            },
            templateUrl: '../../ngTemplates/state.html'
        };

        return deviceStateObject;
    }]);

    ngjsmx.directive('deviceMap',['$window', function(window) {
        var deviceMapObject = {
            restrict: 'A',
            require: '^^deviceManager',
            link: function(s,e,a) {
            },
            templateUrl: '../../ngTemplates/map.html'
        };

        return deviceMapObject;
    }]);

    ngjsmx.directive('deviceSensors',['$window', 'sailsIO', function(window, ws) {
        var deviceSensorsObject = {
            restrict: 'A',
            require: '^^deviceManager',
            link: function(s,e,a) {
                var watcherId;
                // Update interval in milliseconds
                var updateInterval = 2000;
                var socketId;

                s.orientation = {};
                s.orientation.absolute = 'NA';
                s.orientation.alpha = 'NA';
                s.orientation.beta = 'NA';
                s.orientation.gamma = 'NA';

                s.geolocation = {};
                s.geolocation.lat = 'NA';
                s.geolocation.lng = 'NA';

                var getGeolocation = function(){
                    var success = function(position){
                        s.$apply(function(){
                            s.geolocation.lat  = position.coords.latitude;
                            s.geolocation.lng = position.coords.longitude;
                        });
                    };

                    var error = function(){
                        // todo: some better approach
                        console.error('Geolocation not enabled');
                    };

                    watcherId = window.navigator.geolocation.watchPosition(success, error, {enableHighAccuracy: true});
                };

                // All this could be inside a sensors service
                var handleOrientation = function (ev) {
                    s.$apply(function(){
                        s.orientation.absolute = ev.absolute;
                        s.orientation.alpha = ev.alpha;
                        s.orientation.beta = ev.beta;
                        s.orientation.gamma = ev.gamma;
                    });
                };

                window.addEventListener('deviceorientation', handleOrientation);

                if (window.navigator.geolocation){
                    getGeolocation();
                }

                var getData = function (id) {
                    return {
                        id: id,
                        orientation: {
                            absolute: s.orientation.absolute,
                            alpha: s.orientation.alpha,
                            beta: s.orientation.beta,
                            gamma: s.orientation.gamma
                        },
                        location: {
                            lat: s.geolocation.lat,
                            lng: s.geolocation.lng
                        }
                    };
                }
                var intervalId;

                var socketReady = function (ev,data) {
                    socketId = data.id;
                    intervalId = window.setInterval(function(){
                        ws.updateState(getData(socketId));
                    },updateInterval);
                };

                s.$on('idReady', socketReady);

            },
            templateUrl: '../../ngTemplates/sensors.html'
        };

        return deviceSensorsObject;
    }]);
})();