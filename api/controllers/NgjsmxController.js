/**
 * NgjsmxController
 *
 * @description :: Server-side logic for managing ngjsmxes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index: function (req,res) {
		return res.view('ngjsmx/index',{title: '13º Meetup Angular Js Mexico'});
	}
};

