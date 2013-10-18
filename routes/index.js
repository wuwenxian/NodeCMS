
/*
 * GET home page.
 */
var crypto = require('crypto');
var Category = require('../models/category.js');
var Channel = require('../models/channel.js');

// exports.index = function (req, res) {
// res.render('index', {
// title : 'Express'
// });
// };

module.exports = function (app) {
	//----首页
	app.get('/', function (req, res) {
		res.render('index', {
			title : 'NodeCMS by Express'
		});
	});

	//-----后台管理首页---------
	app.get('/admin', function (req, res) {
		res.render('admin/admin_index', {
			title : '后台管理'
		});
	});

	//-----添加（或编辑）分类页面（get）-----
	app.get('/admin/addCate', function (req, res) {
		res.render('admin/admin_cate_add', {
			title : '后台管理',
			success : req.flash('success').toString(),
			error : req.flash('error').toString()
		});
	});

	//-----添加（或编辑）分类页面（post）-----
	app.post('/admin/addCate', function (req, res) {
		var newCate = new Category({
				title : req.body.title,
				seoTitle : req.body.seoTitle,
				seoKey : req.body.seoKey,
				seoDesc : req.body.seoDesc,
				photo : req.body.photo,
				orderNo : req.body.orderNo
			});
		Category.getOne(newCate.title, function (err, cate) {
			if (cate) {
				req.flash('error', '该分类已存在！');
				return res.redirect('/admin/addCate');
			}
			//如果该分类不存在则新增该分类
			newCate.save(function (err) {
				if (err) {
					req.flash('error', err);
					return res.redirect('/admin/addCate');
				}
				req.flash('success', '新增分类成功！');
				res.redirect('/admin/addCate');
			});
		});
	});

	//-----添加（或编辑）频道页面（get）-------
	app.get('/admin/setting/sys_channel_edit', function (req, res) {
		res.render('admin/setting/sys_channel_edit', {
			title : '',
			success : req.flash('success').toString(),
			error : req.flash('error').toString()
		});
	});

	//-----添加（或编辑）频道页面（post）-------
	app.post('/admin/setting/sys_channel_edit', function (req, res) {
		var newChannel = {
			// _id : 2,
			name : req.body.txtName,
			title : req.body.txtTitle,
			modelId : req.body.ddlModelId,
			sortNo : req.body.txtSortNo
		};
		Channel.add(newChannel, function (err) {
			if (err) {
				req('error', err);
				return res.redirect('/admin/setting/sys_channel_edit');
			} else {
				req.flash('success', '新增频道成功！');
				res.redirect('/admin/setting/sys_channel_edit');
			}
		});
	});

	//-------频道列表-------
	app.get('/admin/setting/sys_channel_list', function (req, res) {
		Channel.getList(function (docs) {
			console.log(typeof docs);
			console.log(docs);
			res.render('admin/setting/sys_channel_list', {
				channelList : docs
			});
		});
	})
}
