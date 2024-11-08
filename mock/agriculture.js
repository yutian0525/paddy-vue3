// 不使用固定数据，使用 Mock 生成模拟数据
// import overAllData from '../data/covid19-overall.json'
/*const provinceData = require('../data/covid19-province.json')*/
const Mock = require('mockjs');
const Random = Mock.Random;

// 定义所有省份的列表
const allProvinces = [
  '北京', '天津', '河北', '山西', '内蒙古', '辽宁', '吉林', '黑龙江', '上海', '江苏',
  '浙江', '安徽', '福建', '江西', '山东', '河南', '湖北', '湖南', '广东', '广西',
  '海南', '重庆', '四川', '贵州', '云南', '西藏', '陕西', '甘肃', '青海', '宁夏', '新疆'
];

// 声明一个空的 province 数组
const provinceData = [];

// 生成不重复的省份数据
for (let i = 0; i < allProvinces.length; i++) {
  const province = allProvinces[i];
  provinceData.push({
    precipitation: Random.float(0, 500, 2, 2).toString(),
    countryLabel: "中国",
    countryName: "China",
    temperature: Random.float(-30, 50, 2, 2).toString(),
    provinceLabel: province,
    provinceName: null,
    updateTime: null,
    grainOutput: Random.integer(1000, 10000).toString()
  });
}

// 生成随机日期范围
const generateDateRange = (startDate, endDate) => {
  const dates = [];
  let currentDate = new Date(startDate);
  const end = new Date(endDate);

  while (currentDate <= end) {
    dates.push(formatDate(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

const formatDate = (date) => {
  return date.toISOString().split('T')[0].replace(/-/g, '-').substring(5);
};

const startDate = new Date('2021-05-16');
const endDate = new Date('2021-07-15');

const dateArray = generateDateRange(startDate, endDate);

// 生成随机数据
const generateRandomData = () => {
  const temperatureList = dateArray.map(date => [date, Random.integer(-40, 40)]);
  const exportedCountList = dateArray.map(date => [date, Random.integer(90000, 120000)]);
/*  const confirmedCountList = dateArray.map(date => [date, Random.integer(100000, 120000)]);*/
  const percipitationList = dateArray.map(date => [date, Random.integer(100, 1500)]);
  const importedCountList = dateArray.map(date => [date, Random.integer(5000, 7000)]);
 /* const noInFectCountList = dateArray.map(date => [date, Random.integer(300, 500)]);*/
/*  const currentConfirmedCountList = dateArray.map(date => [date, Random.integer(3000, 5000)]);*/

  return {
    success: true,
    code: 200,
    message: "操作成功",
    data: {
      temperatureList,
      exportedCountList,
      percipitationList,
      importedCountList,
    }
  };
};

// 导出模拟数据


module.exports = [
  {
    url: '/api/agriculture/overall',
    type: 'get',
    response: config => {
      return {
        success: true,
        code: 200,
        message: "操作成功",
        data: {
          arableLandArea: Random.integer(110000, 120000),
          arableLandAreaIncr: Random.integer(-100, 100),
          totalGrainOutput: Random.integer(100000, 110000),
          totalGrainOutputIncr: Random.integer(-100, 100),
          greeningRate: Random.float(90, 95, 0, 9),
          greeningRateIncr: Random.integer(-10, 10),
          agriculturalPopulation: Random.integer(3000, 4000),
          agriculturalPopulationIncr: Random.integer(0, 100),
          mechanizationRate: Random.float(1, 5, 0, 9),
          mechanizationRateIncr: Random.integer(-10, 10),
          agriculturalImports: Random.integer(6000, 8000),
          agriculturalImportsIncr: Random.integer(-100, 100),
          storedrate: Random.integer(0, 100),
          soldrate: Random.integer(0, 100),
          updateTime: Random.date('yyyy-MM-dd HH:mm:ss')
        }
      }
    }
  },
  {
    url: '/api/agriculture/area/latest/list',
    type: 'get',
    response: config => {
      return {
        success: true,
        code: 200,
        message: "操作成功",
        data: provinceData
      }
    }
  },
  {
    url: '/api/agriculture/list',
    type: 'get',
    response: config => {
      return generateRandomData();
    }
  }
];
