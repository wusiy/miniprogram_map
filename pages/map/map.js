// pages/maps/map.js

const app = getApp();
var loc = new String();
loc = '';

// 引入SDK核心类
var QQMapWX = require('../../libs/qqmap-wx-jssdk');
 
// 实例化API核心类
var qqmapsdk = new QQMapWX({
  key: '74YBZ-OBEWF-Y7EJQ-N3MTN-HHVLS-ASFTO' // 必填
});

Page({

  formSubmit(e) {
    var _this = this;
    qqmapsdk.reverseGeocoder({
      //位置坐标，默认获取当前位置，非必须参数
      /**
       * 
       //Object格式
        location: {
          latitude: 39.984060,
          longitude: 116.307520
        },
      */
      /**
       *
       //String格式
        location: '39.984060,116.307520',
      */
      
      location: e.detail.value.reverseGeo || loc, //获取表单传入的位置坐标,不填默认当前位置,示例为string格式
      //get_poi: 1, //是否返回周边POI列表：1.返回；0不返回(默认),非必须参数
        get_poi: 1,
      
      success: function(res) {//成功后的回调
        console.log(res);
        var res = res.result;
        var mks = [];
        
        //当get_poi为0时或者为不填默认值时，检索目标位置，按需使用
          mks.push({ // 获取返回结果，放到mks数组中
            title: res.address + "\r"+ res.formatted_addresses.recommend,
           id: 0,
           latitude: res.location.lat,
           longitude: res.location.lng,
            iconPath: '../../utils/res/mark.png',//图标路径
           width: 20,
            height: 20,
           callout: { //在markers上展示地址名称，根据需求是否需要
              content: res.address + "\n\r"+ res.formatted_addresses.recommend,
              color: '#000',
            display: 'ALWAYS'
          }
          });
        
           //当get_poi为1时，检索当前位置或者location周边poi数据并在地图显示，可根据需求是否使用
          for (var i = 0; i < res.poi_count; i++) {
             
            mks.push({ // 获取返回结果，放到mks数组中
                title: res.pois[i].address + "\r" + res.pois[i].title,
                id: res.pois[i].id,
                latitude: res.pois[i].location.lat,
                longitude: res.pois[i].location.lng,
                iconPath: './resources/placeholder.png', //图标路径
                width: 20,
                height: 20
                
            })
            }

            //弹出对话列表框点选地点 最多显示6条
            wx.showActionSheet({ 
              itemList: [res.pois[0].address + "\r" + res.pois[0].title + "\r" + res.pois[0]._distance + "米", 
                          res.pois[1].address + "\r" + res.pois[1].title + "\r" + res.pois[1]._distance + "米",
                          res.pois[2].address + "\r" + res.pois[2].title + "\r" + res.pois[2]._distance + "米",
                          res.pois[3].address + "\r" + res.pois[3].title + "\r" + res.pois[3]._distance + "米",
                          res.pois[4].address + "\r" + res.pois[4].title + "\r" + res.pois[4]._distance + "米",
                          res.pois[5].address + "\r" + res.pois[5].title + "\r" + res.pois[5]._distance + "米"],
              success: function (res1) {
                if (!res1.cancel) {
                  console.log(res1.tapIndex)

                  wx.showToast({
                    title: '成功选择 ' + res.pois[res1.tapIndex].address + " " +  res.pois[res1.tapIndex].title + " " + res.pois[res1.tapIndex]._distance + "米",
                    icon: 'none',
                    duration: 2000
                  })
                }
              }
            });
        
        _this.setData({ //设置markers属性和地图位置poi，将结果在地图展示
          markers: mks,
          poi: {
            latitude: res.location.lat,
            longitude: res.location.lng
          }
        });
      },
      fail: function(error) {
        console.error(error);
      },
      complete: function(res) {
        console.log(res);
      }
    })
  },


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
          loc = res.latitude + "," + res.longitude

					that.setData({

						latitude: res.latitude,

						longitude: res.longitude

						//circles: [{

							//latitude: res.latitude,

							//longitude: res.longitude,

							// color: '#FF0000DD',

							// fillColor: '#d1edff88',

							// radius: 3000, //定位点半径

							// strokeWidth: 1
						//}]
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
        console.log(res, 11111)   //移动后，新位置的经纬度
        loc = res.latitude + "," + res.longitude
				that.setData({
					latitude: res.latitude,
					longitude: res.longitude
				})
			}
		})
	}
})