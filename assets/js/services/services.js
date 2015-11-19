(function(){
    ngjsmx = angular.module('ngjsmx');

    ngjsmx.factory('sailsIO',['$window', function(window){
        var ws = window.io.socket;

        ws.on('deviceData', function (data) {
            console.log(data);
        });

        var newRoomHandler = function( resData, jwres){
            console.log(resData);
        };

        var clearRoomHandler = function( resData, jwres){
            console.log(resData);
        };

//        var clearRoomHandler = function( resData, jwres){
//            console.log(resData);
//        };

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
            updateState: function(data){
                ws.get('/device',{m: 'updateState', data: data});
//                console.log(data);
            }
        };
    }]);
    ngjsmx.service('ThreeModel', ThreeModel);
})();