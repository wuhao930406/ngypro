export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      {
        path: '/user',
        redirect: '/user/login'
      },
      {
        path: '/user/login',
        name: 'login',
        component: './User/Login'
      },
      { path: '/user/register', name: 'register', component: './User/Register' },
      { path: '/user/forgot', name: 'forgot', component: './User/Forgot' },
      {
        path: '/user/register-result',
        name: 'register.result',
        component: './User/RegisterResult',
      },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['user'],
    routes: [
      // dashboard
      { path: '/', redirect: '/home' },
      {
        path: '/home',
        name: 'home',
        icon: 'home',
        component: './Home/Homepage',
      },
      {
        path: '/fastest',
        name: 'fastest',
        icon: "block",
        component: './Home/Fastest',
      },
      {
        path: '/device',//设备资产管理
        name: 'device',
        icon: 'desktop',
        routes: [
          {
            path: '/device/tzlist',
            name: 'tzlist',
            component: './Device/Tzlist',
          },
          {
            path: '/device/devicetzlist',
            name: 'devicetzlist',
            component: './Device/DeviceTzlist',
          },
          {
            path: '/device/devicetype',
            name: 'devicetype',
            component: './Device/DeviceType',
          },

          {
            path: '/device/devicego',
            name: 'devicego',
            component: './Device/DeviceGo',
          },
          {
            path: '/device/devicestep',
            name: 'devicestep',
            component: './Device/DeviceStep',
          },
        ],
      },

      {
        path: '/devices',//设备使用管理
        name: 'devices',
        icon: 'laptop',
        routes: [
          {
            path: '/devices/devicetzlists',
            name: 'devicetzlists',
            component: './Device/DeviceTzlists',
          },
          {
            path: '/devices/devicelvli',
            name: 'devicelvli',
            component: './Device/DeviceLvli',
          },
          {
            path: '/devices/verbnotice',
            name: 'verbnotice',
            component: './Verb/VerbNotice',
          },
          {
            path: '/devices/repairduty',
            name: 'repairduty',
            component: './Repair/RepairDuty',
          },
          {
            path: '/devices/repairsetting',
            name: 'repairsetting',
            component: './Repair/RepairSetting',
          },
          {
            path: '/devices/checksettings',
            name: 'checksettings',
            component: './Check/CheckSettings',
          },
          {
            path: '/devices/verbplanset',
            name: 'verbplanset',
            component: './Verb/VerbPlanSet',
          },

          {
            path: '/devices/devicetzlists/deviceRecord/:id/:key/:name',
            name: 'deviceRecord',
            hideInMenu: true,
            component: './Device/DeviceRecord',
          },
          {
            path: '/devices/devicetzlists/deviceknowledge/:id/:name',
            name: 'deviceknowledge',
            hideInMenu: true,
            component: './Device/DeviceKnowledge',
          },
          {
            path: '/devices/devicetzlists/devicerepair/:id/:name/:ifs',
            name: 'devicerepair',
            hideInMenu: true,
            component: './Device/DeviceRepair',
          },
          {
            path: '/devices/devicetzlists/devicerepair/:id/:name',
            name: 'devicerepair',
            hideInMenu: true,
            component: './Device/DeviceRepair',
          },
        ],
      },


      {
        path: '/verb',//维保管理
        name: 'verb',
        icon: 'safety-certificate',
        routes: [
          {
            path: '/verb/verblist',
            name: 'verblist',
            component: './Verb/Verb',
          },
          {
            path: '/verb/verbplan',
            name: 'verbplan',
            component: './Verb/VerbPlan',
          },
          {
            path: '/verb/verbmission',
            name: 'verbmission',
            component: './Verb/VerbMission',
          },
          {
            path: '/verb/verbmymission',
            name: 'verbmymission',
            component: './Verb/VerbMyMission',
            hideInMenu: true
          },


          {
            path: '/verb/verbmissionsee',
            name: 'verbmissionsee',
            component: './Verb/VerbMissionSee',
          },
          {
            path: '/verb/verbprosetting',
            name: 'verbprosetting',
            component: './Verb/VerbProSetting',
          },
        ],
      },
      {
        path: '/repair',//维修管理
        name: 'repair',
        icon: 'tool',
        routes: [
          {
            path: '/repair/repairlist',
            name: 'repairlist',
            component: './Repair/RepairList',
          },
          {
            path: '/repair/repairmylist',
            name: 'repairmylist',
            component: './Repair/RepairMyList',
            hideInMenu: true
          },
          {
            path: '/repair/autorepair',
            name: 'autorepair',
            component: './Repair/RepairAuto',
          },
          {
            path: '/repair/repairhistory',
            name: 'repairhistory',
            component: './Repair/RepairHistory',
          },
          {
            path: '/repair/repairtrouble',
            name: 'repairtrouble',
            component: './Repair/RepairTrouble',
          },
        ],
      },
      {
        path: '/spare',//备件管理
        name: 'spare',
        icon: 'api',
        routes: [
          {
            path: '/spare/sparelist',
            name: 'sparelist',
            component: './Spare/SpareList',
          },
          {
            path: '/spare/sparetype',
            name: 'sparetype',
            component: './Spare/SpareType',
          },
          {
            path: '/spare/spareget',
            name: 'spareget',
            component: './Spare/SpareGet',
          },
          {
            path: '/spare/spareleft',
            name: 'spareleft',
            component: './Spare/SpareLeft',
          },

          {
            path: '/spare/spareuseage',
            name: 'spareuseage',
            component: './Spare/SpareUseage',
          },
          {
            path: '/spare/spareoverview',
            name: 'spareoverview',
            component: './Spare/SpareOverView',
          },
          {
            path: '/spare/sparechange',
            name: 'sparechange',
            component: './Spare/SpareChange',
          },
          {
            path: '/spare/spareundo',
            name: 'spareundo',
            component: './Spare/SpareUnDo',
          },
          {
            path: '/spare/sparedone',
            name: 'sparedone',
            component: './Spare/SpareDone',
          },

          {
            path: '/spare/spareoverview/spareuseage/:id/:userid/:name',
            name: 'spareuseage',
            hideInMenu: true,
            component: './Spare/SpareUseage',
          },

        ],
      },
      {
        path: '/alldeviceknowledge',
        name: 'alldeviceknowledge',
        icon: "file",
        routes: [
          {
            path: '/alldeviceknowledge/deviceknowledges',
            name: 'deviceknowledges',
            component: './Device/DeviceKnowledge',
          },
          {
            path: '/alldeviceknowledge/charts',
            name: 'charts',
            component: './Device/DeviceCharts',
          }
        ]
      },
      {
        path: '/chart',//统计报表
        name: 'chart',
        icon: 'area-chart',
        routes: [
          {
            path: '/chart/chartrepair',
            name: 'chartrepair',
            component: './Chart/ChartRepair',
          },
          {
            path: '/chart/deviceanalyse',
            name: 'deviceanalyse',
            component: './Device/DeviceAnalyse',
          },
          {
            path: '/chart/deviceenegry',
            name: 'deviceenegry',
            component: './Device/DeviceEnegry',
          },
          {
            path: '/chart/chartmoee',
            name: 'chartmoee',
            component: './Chart/ChartMoee',
          },
          {
            path: '/chart/chartjia',
            name: 'chartjia',
            component: './Chart/ChartJia',
          },
          {
            path: '/chart/chartmttr',
            name: 'chartmttr',
            component: './Chart/ChartMTTR',
          },
          {
            path: '/chart/chartmtbf',
            name: 'chartmtbf',
            component: './Chart/ChartMTBF',
          },
        ],
      },
      {
        path: '/check',//点检管理
        name: 'check',
        icon: 'alert',
        routes: [
          {
            path: '/check/checkpoint',
            name: 'checkpoint',
            component: './Check/CheckPoint',
          },

          {
            path: '/check/checksetting',
            name: 'checksetting',
            component: './Check/CheckSetting',
          },
          {
            path: '/check/checkmession',
            name: 'checkmession',
            component: './Check/CheckMession',
          },
          {
            path: '/check/checkerror',
            name: 'checkerror',
            component: './Check/CheckError',
          },
          {
            path: '/check/checkmyerror',
            name: 'checkmyerror',
            component: './Check/CheckMyError',
          },
          {
            path: '/check/checkhistoryton',
            name: 'checkhistoryton',
            component: './Check/CheckHistoryTon',
          },
          {
            path: '/check/checkmession/checkmymession/:key',
            name: 'checkmymession',
            component: './Check/CheckMession',
            hideInMenu: true,
          },
          {
            path: '/check/checksetting/checkhistory/:id/:name',
            name: 'checkhistory',
            hideInMenu: true,
            component: './Check/CheckHistory',
          },
        ],
      },

      {
        path: '/asd',//点检管理
        name: 'asd',
        icon: 'alert',
        routes: [
          {
            path: '/asd/sensor',
            name: 'sensor',
            routes: [
              {
                path: '/asd/sensor/sensorchart/:id/:name',
                name: 'sensorchart',
                hideInMenu: true,
                component: './Asd/Sensor/SensorChart',
              },
              {
                path: '/asd/sensor/datagatechart/:id/:name',
                name: 'datagatechart',
                hideInMenu: true,
                component: './Asd/Sensor/DataGateChart',
              },
              {
                path: '/asd/sensor/sensorlist',
                name: 'sensorlist',
                component: './Asd/Sensor/SensorList',
              },
              {
                path: '/asd/sensor/sensortype',
                name: 'sensortype',
                component: './Asd/Sensor/SensorType',
              },
              {
                path: '/asd/sensor/sensorlink',
                name: 'sensorlink',
                component: './Asd/Sensor/SensorLink',
              },
            ],
          },
          {
            path: '/asd/datagate',
            name: 'datagate',
            routes: [
              {
                path: '/asd/datagate/datagatelist',
                name: 'datagatelist',
                hideInMenu: true,
                component: './Asd/DataGate/DataGateList',
              },
            ],
          },

        ],
      },
      {
        path: '/system',//系统设置
        name: 'system',
        icon: 'setting',
        routes: [
          {
            path: '/system/parts',
            name: 'parts',
            component: './System/Parts',
          },
          {
            path: '/system/group',
            name: 'group',
            component: './System/Group',
          },
          {
            path: '/system/form',
            name: 'form',
            component: './System/Form',
          },
          {
            path: '/system/jiagou',
            name: 'jiagou',
            component: './System/Company',
          },
          {
            path: '/system/supplier',
            name: 'supplier',
            component: './System/Supplier',
          },
          {
            path: '/system/staff',
            name: 'staff',
            component: './System/Staff',
          },
          {
            path: '/system/charactor',
            name: 'charactor',
            component: './System/Character',
          },
          {
            path: '/system/shuju',
            name: 'shuju',
            component: './System/DoCheck',
          },
        ],
      },
      /*admin*/
      {
        path: '/admin',//系统管理
        name: 'admin',
        icon: 'laptop',
        routes: [
          {
            path: '/admin/reglist',
            name: 'reglist',
            component: './Admin/RegList',
          },
          {
            path: '/admin/company',
            name: 'company',
            component: './Admin/Company',
          },
          {
            path: '/admin/company/devices/:id/:company',
            name: 'devices',
            hideInMenu: true,
            component: './Admin/Devices',
          },
        ],
      },
      // {
      //   component: '404',
      // },
    ],
  },
];
