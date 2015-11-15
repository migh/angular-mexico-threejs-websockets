(function(){
    ngjsmx = angular.module('ngjsmx');

    ngjsmx.directive('deviceManager', function() {
        var deviceManagerObject = {
            restrict: 'A',
            controller: ['$window', '$scope', 'sailsIO', function(window, s, ws){
                console.log('Inside device manager');
                self = this;

                var joinCb = function( res, rwjson ){
                    self.socketId = res.id;
                    console.log(self.socketId);
                };

                ws.joinRoom(joinCb);

                this.getSocketId = function () {
                    return self.socketId;
                }
            }]
        };

        return deviceManagerObject;
    });

    ngjsmx.directive('deviceState',['$window', function(window) {
        var deviceStateObject = {
            restrict: 'A',
            require: '^^deviceManager',
            link: function(s,e,a, devManager) {
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
                console.log('Inside dotMap');
            },
            templateUrl: '../../ngTemplates/map.html'
        };

        return deviceMapObject;
    }]);

    ngjsmx.directive('dotSensors',['$window', function(window) {
        var deviceSensorsObject = {
            restrict: 'A',
            require: '^^deviceManager',
            link: function(s,e,a) {
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

                    var watcherId = window.navigator.geolocation.watchPosition(success, error, {enableHighAccuracy: true});
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

                if (window.navigator.geolocation){
                    getGeolocation();
                }
                window.addEventListener('deviceorientation', handleOrientation);
            },
            templateUrl: '../../ngTemplates/sensors.html'
        };

        return deviceSensorsObject;
    }]);
})();