/**
 * NgjsmxController
 *
 * @description :: Server-side logic for managing ngjsmxes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var _ = require('lodash');

var socketMaster;
var socketList = [];

module.exports = {
	// Visor
	index: function (req, res) {
		return res.view('ngjsmx/index',{title: '13º Meetup Angular Js Mexico: Angular JS, WebGL y WebSockets'});
	},
	control: function (req, res) {

        if ( req.isSocket ) {
            var m = req.param('m');
            var socket = req.socket;
            var socketId = sails.sockets.id(socket);

            switch(m){
                case 'new':
                    sails.sockets.join( socket, 'visor' );

                    socketMaster = {id: socketId, socket: socket};

                    // There is an error if you try to send socket as json to client
                    // ls: _.map(socketList, function(n){return n.id;})
                    res.json({
                        id: socketId
                    });
                    break;
                case 'clear':
                    // Don't use sails.sockets.subscribers 'cause I don't know how to get the socket object from the id
                    while (socketList.length > 0) {
                        sails.sockets.leave( socketList.pop().socket, 'visor');
                    }
                    // subscribers should be one after removing all but the master which is not listed
                    res.json({socketList: socketList, subscribers: sails.sockets.subscribers('visor')});
                    break;
                case 'join':
                    sails.sockets.join( req.socket, 'visor' );
                    // todo: there should be some kind of polling, devices are added but never removed
                    // it's about removing them when the window closes, not when reset is clicked
                    socketList.push({id: socketId, socket: socket});
                    res.json({
                        id: socketId
                    });
                    break;
                case 'updateState':
                    break;
                default:
            }

        } else {
            return res.view('ngjsmx/control',{title: 'Dot Control'});
        }
	}
};

