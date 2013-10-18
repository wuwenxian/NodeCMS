var mongodb = require('./db');

function Category(cate) {
	this.title = cate.title;
	this.seoTitle = cate.seoTitle;
	this.seoKey = cate.seoKey;
	this.seoDesc = cate.seoDesc;
	this.photo = cate.photo; //图片路径
	this.orderNo = cate.orderNo; //顺序序号
}

module.exports = Category;

//------- 保存category--------
Category.prototype.save = function (callback) {
	var cate = {
		title : this.title,
		seoTitle : this.seoTitle,
		seoKey : this.seoKey,
		seoDesc : this.seoDesc,
		photo : this.photo,
		orderNo : this.orderNo
	};
	mongodb.open(function (err, db) {
		if (err) {
			return callback(err);
		}
		db.collection('category', function (err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			collection.insert(cate, {
				safe : true
			}, function (err, cate) {
				mongodb.close();
				callback(null);
			});
		});
	});
};

//------- 读取一个category--------
Category.getOne = function (title, callback) {

	mongodb.open(function (err, db) {
		if (err) {
			return callback(err);
		}

		db.collection('category', function (err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			collection.findOne({
				title : title
			}, function (err, cate) {
				mongodb.close();
				if (cate) {
					return callback(null, cate);
				}
				callback(err);
			});
		});
	});
};
