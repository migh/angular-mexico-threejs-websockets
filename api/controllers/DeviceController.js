/**
 * DeviceController
 *
 * @description :: Server-side logic for managing devices
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index: function(req,res){
		// Pos and ori are strings and should be processed here
		res.view('device/index',{
			pos: req.param('position'),
			ori: req.param('orientation')
		});
	}
};

