var mongodb = require('./db');

function Channel(channel) {
	this.name = channel.name;
	this.title = channel.title;
	this.modelId = channel.modelId;
	this.sortId = channel.sortId;
}

module.exports = Channel;

//----保存channel-----
Channel.prototype.save = function (callback) {
	var channel = {
		name : this.name,
		title : this.title,
		modelId : this.modelId,
		sortId : this.sortId
	};
	mongodb.open(function (err, db) {
		if (err) {
			return callback(err);
		}
		
		db.collection('channel', function (err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}

			//设置自增长id
			try {
				var cursor1 = collection.find();//.sort({$natural:-1}).limit(1)
				console.log(cursor1);
				if (cursor1.hasNext()) {
					console.log('hello');
					channel._id = cursor1.next()._id + 1;
				} else {
					channel._id = 1;
				}
			}catch(err){
				console.log(err);
				return callback(err);
			}

			collection.insert(channel, {
				safe : true
			}, function (err, channel) {
				mongodb.close();
				callback(null);
			});
		});
	});
}

//-------检查频道name和title是否有重复---------
Channel.exist = function (name, title, callback) {
	mongodb.open(function (err, db) {
		if (err) {
			return callback(err);
		}
		db.collection('channel', function (err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			collection.findOne({
				$or : [{
						'name' : name
					}, {
						'title' : title
					}
				]
			}, function (err, channel) {
				mongodb.close();
				if (channel) {
					return callback(null, channel);
				}
				return callback(err);
			});
		});
	});
}
