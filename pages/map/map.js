// pages/maps/map.js

const app = getApp();
 
// // 引入SDK核心类
// var QQMapWX = require('../../libs/qqmap-wx-jssdk');
 
// // 实例化API核心类
// var qqmapsdk = new QQMapWX({
//   key: '74YBZ-OBEWF-Y7EJQ-N3MTN-HHVLS-ASFTO' // 必填
// });

Page({
	data: {
		longitude: '',
		latitude: '',
	},
	onLoad() {
		this.Location()
	},
	regionchange(e) {
		// 地图发生变化的时候，获取中间点，也就是用户选择的位置toFixed

		if (e.type == 'end' && (e.causedBy == 'scale' || e.causedBy == 'drag')) {
			var that = this;

			this.mapCtx = wx.createMapContext("map4select");

			this.mapCtx.getCenterLocation({

				type: 'gcj02',

				success: function(res) {

					console.log(res, 11111)   //移动后，新位置的经纬度

					that.setData({

						latitude: res.latitude,

						longitude: res.longitude,

						circles: [{

							latitude: res.latitude,

							longitude: res.longitude,

							color: '#FF0000DD',

							fillColor: '#d1edff88',

							radius: 3000, //定位点半径

							strokeWidth: 1
						}]
					})
				}
			})
		}
	},
	//定位到自己的位置事件
	my_location: function(e) {
		var that = this;
		that.onLoad();
	},
	Location: function() {
			var that = this;
		wx.getLocation({
			type: "gcj02",
			success: function(res) {
				that.setData({
					latitude: res.latitude,
					longitude: res.longitude
				})
			}
		})
	}
})