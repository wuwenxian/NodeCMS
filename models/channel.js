var util = require('util');
var mongoose = require('./db_mongoose').getMongoose();
var Schema = mongoose.Schema;

var ObjectId = mongoose.Schema.ObjectId;

var modelTypeSchema = new Schema({
		_id : Number,
		title : String
	});

var ModelTypeModel = mongoose.model('modeltype', modelTypeSchema);

var channelSchema = new Schema({
		_id : Number,
		name : String,
		title : String,
		sortNo : Number,
		modelId : Number
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
	ChannelModel.find().sort({
		sortNo : 1
	}).exec(function (err, docs1) {
		if (err) {
			throw err;
		} else {
			ModelTypeModel.populate(docs1, {
				path : 'modelId',
				model : 'modeltype'
			}, function (err, docs2) {
				callback(docs2);
			})
		}
	});
}

//------获取页面模型类型模板列表-------
exports.getModelTypeList = function (callback) {
	ModelTypeModel.find().sort({
		_id : 1
	}).exec(function (err, docs) {
		if (err) {
			throw err;
		} else {
			callback(docs);
		}
	});
}

exports.addModelType = function () {
	var arr_model = new Array({
			_id : 1,
			title : '文章模型'
		}, {
			_id : 2,
			title : '产品模型'
		}, {
			_id : 3,
			title : '内容模型'
		});
	var item;
	for (item in arr_model) {
		console.log(arr_model[item]);
		var modelType = new ModelTypeModel(arr_model[item]);
		modelType.save(function (err) {
			if (err)
				throw err;
		});
	}
}
