(function(){
    ngjsmx = angular.module('ngjsmx',[]);

    ngjsmx.constant('NGMX',{
        version: '0.0.1'
    });

    ngjsmx.controller('visorCtrl',['$window', 'sailsIO', '$scope', function(window, ws, s){
        ws.createRoom();

        s.reset = function(){
            ws.clearRoom();
        };
    }])
})();