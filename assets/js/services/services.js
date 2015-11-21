(function(){
    ngjsmx = angular.module('ngjsmx');

    ngjsmx.factory('sailsIO',['$window', function(window){
        var ws = window.io.socket;

        var deviceDataFn = function (data) {
            console.log(data);
        };

        ws.on('deviceData', function(data){ deviceDataFn(data) });

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
            },
            setDeviceDataFn: function(fn){
                deviceDataFn = fn;
            }
        };
    }]);
    ngjsmx.service('ThreeModel', ThreeModel);
})();