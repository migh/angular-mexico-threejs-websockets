(function(){
    ngjsmx = angular.module('ngjsmx');

    ngjsmx.factory('sailsIO',['$window', function(window){
        var ws = window.io.socket;

        var newRoomHandler = function( resData, jwres){
            console.log(resData);
        };

        var clearRoomHandler = function( resData, jwres){
            console.log(resData);
        };

        return {
            createRoom: function(){
                ws.get('/device',{m: 'new'}, newRoomHandler);
            },
            clearRoom: function(){
                ws.get('/device',{m: 'clear'}, clearRoomHandler);
            },
            joinRoom: function(cb){
                ws.get('/device',{m: 'join'}, cb);
            },
            updateState: function(){

            }
        };
    }]);
})();