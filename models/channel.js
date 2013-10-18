var util = require('util');
var mongoose = require('./db_mongoose').getMongoose();
var Schema = mongoose.Schema;
var Schema2 = mongoose.Schema;
var ObjectId = mongoose.Schema.ObjectId;

var modelTypeSchema = new Schema2({
		_id : ObjectId,
		title : String
	});

var ModelTypeModel = mongoose.model('modelType', modelTypeSchema);

var channelSchema = new Schema({
		_id : Number,
		name : String,
		title : String,
		sortNo : Number,
		modelId : ObjectId
		// modelId : {
		// type : Number,
		// ref : 'modelType'
		// }
	});

var ChannelModel = mongoose.model('channel', channelSchema);

//------新增频道------
exports.add = function (channel, callback) {

	ChannelModel.find().sort({
		_id : -1
	}).limit(1).exec(function (err, doc) {
		if (err) {
			throw err;
		} else {
			if (doc.length > 0) {
				channel._id = Number(doc[0].id) + 1;
			} else {
				channel._id = 1;
			}
			var newChannel = new ChannelModel(channel);
			console.log(doc);
			console.log(channel._id);

			newChannel.save(function (err) {
				if (err) {
					util.log("fail:" + err);
					callback(err);
				} else {
					return callback(null);
				}
			});
		}
	});
}

//------获取频道列表------
exports.getList = function (callback) {
	// ChannelModel.find().sort({
	// sortNo : 1
	// }).populate('id').exec(function (err, docs) {
	// if (err) {
	// throw err;
	// } else {
	// callback(docs);
	// }
	// });
	ChannelModel.find().sort({
		sortNo : 1
	}).exec(function (err, docs1) {
		if (err) {
			throw err;
		} else {
			ModelTypeModel.populate(docs1, {
				path : 'modelId',
				model : 'modelType'
			}, function (err, docs2) {
				callback(docs2);
			})
		}
	});
}
