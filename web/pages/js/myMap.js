(function() {
  // 1. 实例化对象
  var myChart = echarts.init(document.querySelector(".map .chart"));
  // 2. 指定配置和数据
  // 2. 指定配置和数据
 

  var geoCoordMap = {
    "成都": [103.9526, 30.7617],
    "雅安":[103.053851,30.016292],
    "北海":[109.125094,21.48576],
    "曲靖":[103.803298,25.496929],
    "深圳": [114.5435, 22.5439],
    "汕尾":[115.433579,22.817381],
    "昆明":[102.9199, 25.4663],
    "昭通":[103.723223,27.344083],
    "广州": [113.5107, 23.2196],
    "来宾":[109.219119,23.756017],
    "西宁":[101.4038, 36.8207],
    "海东":[102.415326,36.480633],
    "绥化":[126.973346,46.660823],
    "大兴安岭":[124.149765,50.420761],
    "乌鲁木齐":[87.9236, 43.5883],
    "张掖":[100.456122,38.935208],
    "北京":[116.4551, 40.2539],
    "葫芦岛":[120.836213,40.716488],

	};
  var XAData = [
    [{ name: "成都" }, { name: "雅安", value: 50 }],
    [{ name: "成都" }, { name: "北海", value: 30 }],
    [{ name: "成都" }, { name: "曲靖", value: 24 }],
    [{ name: "深圳" }, { name: "汕尾", value: 32 }],
    [{ name: "昆明" }, { name: "昭通", value: 20 }],
    [{ name: "广州" }, { name: "来宾", value: 5 }]

  ];

  var XNData = [
    [{ name: "西宁" }, { name: "海东", value: 40 }],
    [{ name: "乌鲁木齐" }, { name: "张掖", value: 12 }]
  ];

  var YCData = [
    [{ name: "绥化" }, { name: "大兴安岭", value: 35 }],
    [{ name: "北京" }, { name: "葫芦岛", value: 10 }]
  ];

  var planePath =
    "path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z";
  //var planePath = 'arrow';
  var convertData = function(data) {
    var res = [];
    for (var i = 0; i < data.length; i++) {
      var dataItem = data[i];

      var fromCoord = geoCoordMap[dataItem[0].name];
      var toCoord = geoCoordMap[dataItem[1].name];
      if (fromCoord && toCoord) {
        res.push({
          fromName: dataItem[0].name,
          toName: dataItem[1].name,
          coords: [fromCoord, toCoord],
          value: dataItem[1].value
        });
      }
    }
    return res;
  };

  var color = ["#fff", "#ffff40", "#ccff00"]; //航线的颜色
  var series = [];
  [
    ["南部", XAData],
    ["西部", XNData],
    ["北部", YCData]
  ].forEach(function(item, i) {
    series.push(
      {
        name: item[0] + " Top3",
        type: "lines",
        zlevel: 1,
        effect: {
          show: true,
          period: 6,
          trailLength: 0.7,
          color: "red", //arrow箭头的颜色
          symbolSize: 3
        },
        lineStyle: {
          normal: {
            color: color[i],
            width: 0,
            curveness: 0.2
          }
        },
        data: convertData(item[1])
      },
      {
        name: item[0] + " Top3",
        type: "lines",
        zlevel: 2,
        symbol: ["none", "arrow"],
        symbolSize: 10,
        effect: {
          show: true,
          period: 6,
          trailLength: 0,
          symbol: planePath,
          symbolSize: 0
        },
        lineStyle: {
          normal: {
            color: color[i],
            width: 1,
            opacity: 0.6,
            curveness: 0.2
          }
        },
        data: convertData(item[1])
      },
      {
        name: item[0] + " Top3",
        type: "effectScatter",
        coordinateSystem: "geo",
        zlevel: 2,
        rippleEffect: {
          brushType: "stroke"
        },
        label: {
          normal: {
            show: true,
            position: "right",
            formatter: "{b}"
          }
        },
        symbolSize: function(val) {
          return val[2] / 8;
        },
        itemStyle: {
          normal: {
            color: color[i]
          },
          emphasis: {
            areaColor: "#2B91B7"
          }
        },
        data: item[1].map(function(dataItem) {
          return {
            name: dataItem[1].name,
            value: geoCoordMap[dataItem[1].name].concat([dataItem[1].value])
          };
        })
      }
    );
  });
  var option = {
    tooltip: {
      trigger: "item",
      formatter: function(params, ticket, callback) {
        if (params.seriesType == "effectScatter") {
          return "线路：" + params.data.name + "" + params.data.value[2];
        } else if (params.seriesType == "lines") {
          return (
            params.data.fromName +
            ">" +
            params.data.toName +
            "<br />" +
            params.data.value
          );
        } else {
          return params.name;
        }
      }
    },
    geo: {
      map: "china",
      label: {
        emphasis: {
          show: true,
          color: "#fff"
        }
      },
      roam: true,
      //   放大我们的地图
      zoom: 1,
      itemStyle: {
        normal: {
          areaColor: "rgba(43, 196, 243, 0.42)",
          borderColor: "rgba(43, 196, 243, 1)",
          borderWidth: 1
        },
        emphasis: {
          areaColor: "#2B91B7"
        }
      }
    },
    series: series
  };
    myChart.setOption(option);
  window.addEventListener("resize", function() {
    myChart.resize();
  });
})();
(function() {
  // 1. 实例化对象
  var myChart = echarts.init(document.querySelector(".map .click"));
  var mypie = echarts.init(document.querySelector(".pie .chart"));
  var myline = echarts.init(document.querySelector(".line .chart"));
  var myline1 = echarts.init(document.querySelector(".line1 .chart"));
  // 2. 指定配置和数据
  var option = {
    dataRange: {
      show: false,
      x: 'left',
      y: 'bottom',
      splitList: [
        {start: 5, end: 5, color: 'orange'},//当值为5时，区域背景
        {start: 10, end: 10, color: '#ff6300'},//当值为10时，区域背景
        {start: 15, end: 15, color: '#ccc'},//当值为15时，区域背景
      ],
    },
    
    series : [
      {
        name: '市场分布',
        type: 'map',
        mapType: 'china',
          //hoverable: false,
          roam: false,
          itemStyle:{
                  normal:{label:{show:true}},
                  emphasis:{label:{show:false}}
              },
          data:[],
      }
  ],animation:false
  };
  var originoption=option
  var ini_data=[];//初始化省份数组
    var provArr = ['河北', '河南', '云南', '辽宁', '黑龙江', '湖南', '安徽','山东'];
    //正则省份，将省与市的字眼去掉，框架不识别
    for(var i=0;i<provArr.length;i++){
      var str = provArr[i];
      var re = /省|市/g;  //全局匹配
      var str2 ={name:str.replace(re,''),value: 5};//拼接对象数组
      ini_data.push(str2);
  }
  option.series[0].data=ini_data;//将拼接好的数组赋给参数集合
  myChart.setOption(option);//跟新图表
  //鼠标滑过事件
  var testStr=','+provArr.join(",")+","; 
  myChart.on('hover', function (param){
      if(testStr.indexOf(","+param.name+",")!=-1){
          return false;
      }else{
          param.value=15;
          myChart.setOption(option);
      }
  });
  
  //点击事件
  myChart.on('click', function (params) {//点击事件
          select_province(params.name);
          if(params.name=='云南')
          {
            option = {
              series: [
                {
                  data: [
                    { value: 10, name: "火车站" },
                    { value: 40, name: "市场" },
                    { value: 2, name: "学校" },
                    { value: 20, name: "医院" },
                    { value: 12, name: "其他" }
                  ]
                }
              ]
            };
            // 使用刚指定的配置项和数据显示图表。
            mypie.setOption(option);
            option = {
              series: [
                {
                  name: "被拐儿童数量",
                  type: "line",
                  // 是否让线条圆滑显示
                  smooth: true,
                  data:  [50, 52, 50, 35, 30]
                },
                {
                  name: "找回儿童数量",
                  type: "line",
                  smooth: true,
                  data:[24,20,30,32,45]
                }
              ]
            };
            // 使用刚指定的配置项和数据显示图表。
            myline.setOption(option);
            option = {
              series: [
                {
                  name: "被拐",
                  type: "line",
                  smooth: true,
                  symbol: "circle",
                  symbolSize: 5,
                  data: [29,62,34,24,38,0,44,39,5,49,46,25,7,89,12,72,97,68,6,59,43,16,2,60,55,92,64,61,42,56]
                },
                {
                  name: "找回",
                  type: "line",
                  smooth: true,
                  symbol: "circle",
                  symbolSize: 5,
                  showSymbol: false,
                  data: [5 ,64, 95 ,48 ,21, 60 ,37, 0 ,4 ,98 ,36 ,17 ,51 ,68 ,14 ,76 ,54 ,16 ,49 ,77 ,39 ,40 ,59 ,66 ,80 ,11 ,15 ,24 ,10 ,55]
                }
              ]
            };
            // 使用刚指定的配置项和数据显示图表。
            myline1.setOption(option);
            option=originoption;
          }
          if(params.name=='湖南')
          {
            option = {
              series: [
                {
                  data: [
                    { value: 48, name: "火车站" },
                    { value: 4, name: "市场" },
                    { value: 31, name: "学校" },
                    { value: 37, name: "医院" },
                    { value: 3, name: "其他" }
                  ]
                }
              ]
            };
            // 使用刚指定的配置项和数据显示图表。
            mypie.setOption(option);
            option = {
              series: [
                {
                  name: "被拐儿童数量",
                  type: "line",
                  // 是否让线条圆滑显示
                  smooth: true,
                  data:  [41 ,11 ,32, 7, 27]
                },
                {
                  name: "找回儿童数量",
                  type: "line",
                  smooth: true,
                  data:[3,2,33,45,32]
                }
              ]
            };
            // 使用刚指定的配置项和数据显示图表。
            myline.setOption(option);
            option = {
              series: [
                {
                  name: "被拐",
                  type: "line",
                  smooth: true,
                  symbol: "circle",
                  symbolSize: 5,
                  data: [76,33,16,30,37,25,53,31,23,41,51,72,54,74,69,88,94,6,48,90,75,62,26,42,77,35,4,39,11,89]
                },
                {
                  name: "找回",
                  type: "line",
                  smooth: true,
                  symbol: "circle",
                  symbolSize: 5,
                  showSymbol: false,
                  data: [53,33,86,26,36,92,22,21,9,77,32,88,19,61,41,70,68,40,31,55,95,97,12,14,8,87,75,30,42,85]
                }
              ]
            };
            // 使用刚指定的配置项和数据显示图表。
            myline1.setOption(option);
            option=originoption;
          }
          if(params.name=='安徽')
          {
            option = {
              series: [
                {
                  data: [
                    { value: 7, name: "火车站" },
                    { value: 31, name: "市场" },
                    { value: 39, name: "学校" },
                    { value: 28, name: "医院" },
                    { value: 46, name: "其他" }
                  ]
                }
              ]
            };
            // 使用刚指定的配置项和数据显示图表。
            mypie.setOption(option);
            option = {
              series: [
                {
                  name: "被拐儿童数量",
                  type: "line",
                  // 是否让线条圆滑显示
                  smooth: true,
                  data:  [28,27,19,38,14]
                },
                {
                  name: "找回儿童数量",
                  type: "line",
                  smooth: true,
                  data:[19,41,18,37,12]
                }
              ]
            };
            // 使用刚指定的配置项和数据显示图表。
            myline.setOption(option);
            option = {
              series: [
                {
                  name: "被拐",
                  type: "line",
                  smooth: true,
                  symbol: "circle",
                  symbolSize: 5,
                  data: [94,52,31,19,48,24,35,13,90,72,92,88,18,91,34,38,97,33,82,96,83,16,63,74,55,50,75,42,23,67]
                },
                {
                  name: "找回",
                  type: "line",
                  smooth: true,
                  symbol: "circle",
                  symbolSize: 5,
                  showSymbol: false,
                  data: [93,76,95,97,41,16,3,36,33,57,34,88,21,82,35,14,77,29,24,26,43,46,10,31,58,71,85,20,83,28]
                }
              ]
            };
            // 使用刚指定的配置项和数据显示图表。
            myline1.setOption(option);
            option=originoption;
          }
          if(params.name=='河南')
          {
            option = {
              series: [
                {
                  data: [
                    { value: 44, name: "火车站" },
                    { value: 8, name: "市场" },
                    { value: 1, name: "学校" },
                    { value: 19, name: "医院" },
                    { value: 48, name: "其他" }
                  ]
                }
              ]
            };
            // 使用刚指定的配置项和数据显示图表。
            mypie.setOption(option);
            option = {
              series: [
                {
                  name: "被拐儿童数量",
                  type: "line",
                  // 是否让线条圆滑显示
                  smooth: true,
                  data:  [5,13,14,40,0]
                },
                {
                  name: "找回儿童数量",
                  type: "line",
                  smooth: true,
                  data:[28,43,27,47,2]
                }
              ]
            };
            // 使用刚指定的配置项和数据显示图表。
            myline.setOption(option);
            option = {
              series: [
                {
                  name: "被拐",
                  type: "line",
                  smooth: true,
                  symbol: "circle",
                  symbolSize: 5,
                  data: [77,82,46,60,19,23,44,45,99,73,50,40,65,7,16,0,68,41,28,49,81,1,37,29,48,70,20,52,92,61]
                },
                {
                  name: "找回",
                  type: "line",
                  smooth: true,
                  symbol: "circle",
                  symbolSize: 5,
                  showSymbol: false,
                  data: [94,69,3,30,20,13,51,53,32,62,52,2,5,34,77,65,75,96,95,29,36,66,46,59,60,22,24,68,21,97]
                }
              ]
            };
            // 使用刚指定的配置项和数据显示图表。
            myline1.setOption(option);
            option=originoption;
          }
          if(params.name=='山东')
          {
            option = {
              series: [
                {
                  data: [
                    { value: 19, name: "火车站" },
                    { value: 17, name: "市场" },
                    { value: 24, name: "学校" },
                    { value: 42, name: "医院" },
                    { value: 2, name: "其他" }
                  ]
                }
              ]
            };
            // 使用刚指定的配置项和数据显示图表。
            mypie.setOption(option);
            option = {
              series: [
                {
                  name: "被拐儿童数量",
                  type: "line",
                  // 是否让线条圆滑显示
                  smooth: true,
                  data:  [38,27,2,0,18]
                },
                {
                  name: "找回儿童数量",
                  type: "line",
                  smooth: true,
                  data:[3,15,18,47,30]
                }
              ]
            };
            // 使用刚指定的配置项和数据显示图表。
            myline.setOption(option);
            option = {
              series: [
                {
                  name: "被拐",
                  type: "line",
                  smooth: true,
                  symbol: "circle",
                  symbolSize: 5,
                  data: [72,81,25,18,45,3,27,67,94,2,75,37,76,62,54,97,88,6,13,86,33,61,22,40,57,74,82,20,83,28]
                },
                {
                  name: "找回",
                  type: "line",
                  smooth: true,
                  symbol: "circle",
                  symbolSize: 5,
                  showSymbol: false,
                  data: [61,2,19,83,54,35,62,7,21,31,88,56,94,98,90,26,64,67,46,33,24,85,29,92,63,66,84,30,81,45]
                }
              ]
            };
            // 使用刚指定的配置项和数据显示图表。
            myline1.setOption(option);
            option=originoption;
          }
          if(params.name=='河北')
          {
            option = {
              series: [
                {
                  data: [
                    { value: 28, name: "火车站" },
                    { value: 6, name: "市场" },
                    { value: 32, name: "学校" },
                    { value: 35, name: "医院" },
                    { value: 37, name: "其他" }
                  ]
                }
              ]
            };
            // 使用刚指定的配置项和数据显示图表。
            mypie.setOption(option);
            option = {
              series: [
                {
                  name: "被拐儿童数量",
                  type: "line",
                  // 是否让线条圆滑显示
                  smooth: true,
                  data:  [38,18,23,45,48]
                },
                {
                  name: "找回儿童数量",
                  type: "line",
                  smooth: true,
                  data:[13,40,8,1,46]
                }
              ]
            };
            // 使用刚指定的配置项和数据显示图表。
            myline.setOption(option);
            option = {
              series: [
                {
                  name: "被拐",
                  type: "line",
                  smooth: true,
                  symbol: "circle",
                  symbolSize: 5,
                  data: [33,75,45,62,10,85,29,38,26,65,19,70,66,28,89,82,71,52,1,0,18,68,42,93,9,81,56,86,25,49]
                },
                {
                  name: "找回",
                  type: "line",
                  smooth: true,
                  symbol: "circle",
                  symbolSize: 5,
                  showSymbol: false,
                  data: [10,14,38,28,79,7,41,95,2,47,70,35,42,55,58,32,68,37,66,18,84,25,71,54,57,17,4,0,99,27]
                }
              ]
            };
            // 使用刚指定的配置项和数据显示图表。
            myline1.setOption(option);
            option=originoption;
          }
          if(params.name=='辽宁')
          {
            option = {
              series: [
                {
                  data: [
                    { value: 7, name: "火车站" },
                    { value: 33, name: "市场" },
                    { value: 20, name: "学校" },
                    { value: 43, name: "医院" },
                    { value: 16, name: "其他" }
                  ]
                }
              ]
            };
            // 使用刚指定的配置项和数据显示图表。
            mypie.setOption(option);
            option = {
              series: [
                {
                  name: "被拐儿童数量",
                  type: "line",
                  // 是否让线条圆滑显示
                  smooth: true,
                  data:  [10,49,37,5,25]
                },
                {
                  name: "找回儿童数量",
                  type: "line",
                  smooth: true,
                  data:[18,13,36,28,48]
                }
              ]
            };
            // 使用刚指定的配置项和数据显示图表。
            myline.setOption(option);
            option = {
              series: [
                {
                  name: "被拐",
                  type: "line",
                  smooth: true,
                  symbol: "circle",
                  symbolSize: 5,
                  data: [43,29,41,45,35,80,13,34,58,40,27,0,2,25,93,3,22,44,32,76,91,19,89,59,71,83,82,14,92,57]
                },
                {
                  name: "找回",
                  type: "line",
                  smooth: true,
                  symbol: "circle",
                  symbolSize: 5,
                  showSymbol: false,
                  data: [68,91,75,25,21,64,36,99,65,80,42,20,50,13,73,90,44,93,40,98,24,94,19,6,70,31,84,55,57,8]
                }
              ]
            };
            // 使用刚指定的配置项和数据显示图表。
            myline1.setOption(option);
            option=originoption;
          }
          if(params.name=='黑龙江')
          {
            option = {
              series: [
                {
                  data: [
                    { value: 15, name: "火车站" },
                    { value: 20, name: "市场" },
                    { value: 41, name: "学校" },
                    { value: 12, name: "医院" },
                    { value: 13, name: "其他" }
                  ]
                }
              ]
            };
            // 使用刚指定的配置项和数据显示图表。
            mypie.setOption(option);
            option = {
              series: [
                {
                  name: "被拐儿童数量",
                  type: "line",
                  // 是否让线条圆滑显示
                  smooth: true,
                  data:  [8,40,47,18,24]
                },
                {
                  name: "找回儿童数量",
                  type: "line",
                  smooth: true,
                  data:[15,1,41,16,35]
                }
              ]
            };
            // 使用刚指定的配置项和数据显示图表。
            myline.setOption(option);
            option = {
              series: [
                {
                  name: "被拐",
                  type: "line",
                  smooth: true,
                  symbol: "circle",
                  symbolSize: 5,
                  data: [46,32,62,74,66,33,19,10,57,60,14,6,36,96,30,15,4,39,83,89,12,84,68,69,63,98,2,43,17,9]
                },
                {
                  name: "找回",
                  type: "line",
                  smooth: true,
                  symbol: "circle",
                  symbolSize: 5,
                  showSymbol: false,
                  data: [16,40,38,99,24,88,33,83,69,21,22,71,64,95,84,63,29,44,72,89,45,4,36,90,5,81,66,57,82,76]
                }
              ]
            };
            // 使用刚指定的配置项和数据显示图表。
            myline1.setOption(option);
            option=originoption;
          }
  });
  //初始化省颜色
  function ini_province(){
      var ini_len=option.series[0].data.length;
      for(var i=0;i<ini_len;i++){
          //初始化颜色
          option.series[0].data[i].value=5;
          myChart.setOption(option);
      }
      
  }
  //选中省颜色
  function select_province(province_name){
      var len=option.series[0].data.length;
      for(var i=0;i<len;i++){
          if(option.series[0].data[i].name==province_name){//如果匹配正确
              //先归零
              ini_province();
              //改变颜色
              option.series[0].data[i].value=10;
              myChart.setOption(option);
          }
      }
      
  }
  window.addEventListener("resize", function() {
    myChart.resize();
  });
})();
