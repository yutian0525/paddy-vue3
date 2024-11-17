<template>
  <div class="container">
    <!-- 顶部 -->
    <div class="top-header">
<!--      <div class="title">-->
<!--        <h1>{{ title }}</h1>-->
<!--        <div class="top-header-tip">-->
<!--          <div class="last-update-time">-->
<!--            更新时间：{{ timestampToTime()}}-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
    </div>
    <div class="main-content">
      <el-row>
        <el-col :span="18">
          <!-- 中间信息开始 -->
          <div class="statistics-content">
            <!-- 中间左侧开始 -->
            <div class="main-inner">
              <el-row>
                <el-col :span="7">
                  <chart-card
                    title="各省粮食产量排名（TOP 10）单位：万吨"
                    :customClass="`chart-item-bottom-sep`"
                  >
                    <province-ranking-bar-chart
                      ref="topCountRankChart"
                      :data="top10ProvinceData"
                      style="width: 100%; height: 380px"
                    />
                  </chart-card>
                  <!-- 占比 -->
                  <chart-card
                    title="占比"
                    :customClass="`chart-item-bottom-sep`"
                  >
                    <basic-proportion-chart
                      ref="basicProportionChart"
                      :data="basicData"
                      style="width: 100%; height: 120px"
                    />
                  </chart-card>
                  <chart-card title="水稻进出口额">
                    <current-confirmed-compare-bar-chart
                      ref="importandexportBarChart"
                      :data="ImportAndExportChartData"
                      style="width: 100%; height: 310px"
                    />
                  </chart-card>
                </el-col>
                <el-col :span="17">
                  <!-- 顶部基本统计信息开始 -->
                  <div class="basic-header flex">
                    <!-- 顶部统计信息开始 -->
                    <div class="top-basic-info">
                      <basic-data-item-label
                        label="耕地面积"
                        :config="defaultDataConfig.arableLandArea"
                        :inCrValue="basicData.arableLandAreaIncr"
                      />
                      <basic-data-item-label
                        label="粮食总产量"
                        :config="defaultDataConfig.totalGrainOutput"
                        :inCrValue="basicData.totalGrainOutputIncr"
                      />
                      <!-- 绿化覆盖率 -->
                      <basic-data-item-label
                        label="绿化覆盖率"
                        :config="defaultDataConfig.greeningRate"
                        :inCrValue="basicData.greeningRateIncr"
                      />
                      <!-- 农业人口 -->
                      <basic-data-item-label
                        label="农业人口"
                        :config="defaultDataConfig.agriculturalPopulation"
                        :inCrValue="basicData.agriculturalPopulationIncr"
                      />
                      <!-- 机械化率 -->
                      <basic-data-item-label
                        label="机械化率"
                        :config="defaultDataConfig.mechanizationRate"
                        :inCrValue="basicData.curedIncr"
                      />
                      <!-- 死亡人数 -->
                      <basic-data-item-label
                        label="水稻进口"
                        :config="defaultDataConfig.agriculturalImports"
                        :inCrValue="basicData.agriculturalImportsIncr"
                      />
                    </div>
                    <!-- 顶部统计信息结束 -->
                  </div>
                  <!-- 顶部基本统计信息开始 -->
                  <div class="main-inner-map-wraper">
                    <!-- 地图 -->
                    <div class="map">
                      <data-map
                        ref="dataMap"
                        title=""
                        :list="mapDataList"
                        style="width: 100%; height: 100%"
                      />
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
            <!-- 中间左侧结束 -->
          </div>
          <!-- 中间信息结束 -->
        </el-col>
        <el-col :span="6">
          <!-- 右侧区域开始 -->
          <div class="main-right">
            <!-- 农作物销售与库存情况 -->
            <chart-card
              title="农作物销售与库存情况"
              :innerClass="`import-and-export-rate-chart`"
              :customClass="`chart-item-bottom-sep`"
            >
              <cured-and-dead-rate-chart
                ref="RateChart"
                :data="rate"
                title="销售率"
                style="width: 280px; height: 130px"
              />
            </chart-card>
            <chart-card title="水热变化" :customClass="`chart-item-bottom-sep`">
              <basic-trend-chart
                :data="TemperatureAndPerData"
                ref="temandperTrendChart"
                style="width: 100%; height: 320px"
              />
            </chart-card>
            <chart-card title="">
              <div slot="title" class="province-table-title flex">
                最新农业消息
              </div>
               <dv-scroll-board
                  :config="provinceConfirmedCountBoardConfig"
                  style="width: 100%; height: 360px"
                />
            </chart-card>
          </div>
          <!-- 右侧区域结束 -->
        </el-col>
      </el-row>
    </div>
    <!-- 其他页面 -->
    <div class="province-data-table-wrapper">
      
        <div slot="title" class="province-data-modal-title">
          <p>各省数据表</p>
          <span class="province-data-modal-update-time"
            >（更新时间：{{ basicData.updateTime }}）</span
          >
        </div>
    </div>
  </div>
</template>
<script >
import ChartCard from '../components/ChartCard'
import DataMap from '../components/DataMap'
import CuredAndDeadRateChart from '../components/StoreAndSoldChart'
import BasicDataItemLabel from '../components/BasicData'
import BasicTrendChart from '../components/BasicTrendChart'
import ProvinceRankingBarChart from '../components/ProvinceRankingBarChart'
import ImportAndExportBarChart from '../components/ImportAndExportBarChart'
import BasicProportionChart from '../components/BasicProportionChart'
import AgricultureService from '../api/AgriculturData'
import topBar from '../components/topBar/topBar.vue'


const formatter = (number) => {
  const numbers = number.toString().split('').reverse()
  const segs = []
  while (numbers.length) segs.push(numbers.splice(0, 3).join(''))
  return segs.join(',').split('').reverse().join('')
}
// 数据样式
const getNumberStyle = (color = '#228B22', fontSize = 30, fontWeight = 'bolder') => {
  return {
    fontSize: fontSize,
    fill: color,
    fontWeight: fontWeight
  }
}

const initBasicConfig = (data) => {
  let arableLandArea = data ? [data.arableLandArea] : 0
  let totalGrainOutput = data ? [data.totalGrainOutput] : 0
  let greeningRate = data ? [data.greeningRate] : 0
  let agriculturalPopulation = data ? [data.agriculturalPopulation] : 0
  let mechanizationRate = data ? [data.mechanizationRate] : 0
  let agriculturalImports = data ? [data.agriculturalImports] : 0
  return {
    totalGrainOutput: {
      number: [totalGrainOutput],
      content: '{nt}',
      formatter,
      style: getNumberStyle()
    },
    arableLandArea: {
      number: [arableLandArea],
      content: '{nt}',
      formatter,
      style: getNumberStyle('#228B22')
    },
    greeningRate: {
      number: [greeningRate],
      content: '{nt}',
      formatter,
      style: getNumberStyle()
    },
    agriculturalPopulation: {
      number: [agriculturalPopulation],
      content: '{nt}',
      formatter,
      style: getNumberStyle()
    },
    mechanizationRate: {
      number: [mechanizationRate],
      content: '{nt}',
      formatter,
      style: getNumberStyle('#228B22')
    },
    agriculturalImports: {
      number: [agriculturalImports],
      content: '{nt}',
      formatter,
      style: getNumberStyle()
    }
  }
}

const initProvinceConfirmedCountBoardConfig = (resultList = []) => {
  return {
    data: resultList,
    align: ['center'],
    rowNum: 10,
    index: false,
    headerBGC: '',
    oddRowBGC: '',
    evenRowBGC: '',
    carousel: 'single'  
  }
}
export default {
  components: {
    ChartCard,
    DataMap,
    CuredAndDeadRateChart,
    BasicDataItemLabel,
    BasicTrendChart,
    ProvinceRankingBarChart,
    CurrentConfirmedCompareBarChart: ImportAndExportBarChart,
    BasicProportionChart
  },
  data () {
    return {
      title: '全国农业大数据平台',
      provinceTableDialogVisible: false,
      aboutDialogVisible: false,
      commonData: {},
      basicData: {
        arableLandArea: 0,
        arableLandAreaIncr: 0,
        totalGrainOutput: 0,
        totalGrainOutputIncr: 0,
        greeningRate: 0,
        greeningRateIncr: 0,
        agriculturalPopulation: 0,
        agriculturalPopulationIncr: 0,
        mechanizationRate: 0,
        mechanizationRateIncr: 0,
        agriculturalImports: 0,
        agriculturalImportsIncr: 0,
        updateTime: '-',
      },
      defaultDataConfig: initBasicConfig(),
      cureRateConfig: {
        data: [0],
        shape: 'round'
      },
      deadRateConfig: {
        data: [0],
        shape: 'round'
      },
      countryRankingTakeTurnChartConfig: {
        data: [],
        waitTime: 2000,
        unit: '单位',
        valueFormatter ({ value }) {
          const reverseNumber = (value + '').split('').reverse()
          let valueStr = ''

          while (reverseNumber.length) {
            const seg = reverseNumber.splice(0, 3).join('')
            valueStr += seg
            if (seg.length === 3) valueStr += ','
          }

          return valueStr.split('').reverse().join('')
        }
      },
      provinceConfirmedCountBoardConfig: initProvinceConfirmedCountBoardConfig(),
      provinceDataList: [],
      trendDataList: [],
      confirmedCountList: [],
      top10ProvinceData: {
        provinceList: [],
        valueList: []
      },
      TemperatureAndPerData: {
        dateList: [],
        temperatureDataList: [],
        percipitationDataList: []
      },
      ImportAndExportChartData: {
        dateList: [],
        Importedcountlist: [],
        Exportedcountlist: []
      },
      rate: {
        SoldRate: 0,
        StoredRate: 0
      },
      areaData: {},
      mapDataList: []
    }
  },
  methods: {
    queryBasicData () {
      let self = this
      AgricultureService.getOverall().then((res) => {
        if (!res.success) {
          console.log('错误:' + res.info)
          return
        }
        self.basicData = res.data
        self.setBasicData(res.data)
      })
    },
    queryProvinceDataList () {
      let self = this
      AgricultureService.getProvinceDataList().then((res) => {
        if (!res.success) {
          console.log('错误:' + res.info)
          return
        }
        /*console.log('省份数据:', res.data)*/
        self.provinceDataList = res.data
        self.setAreaChartData(res.data)
        self.setProvinceRankingData(res.data)
        self.setProvinceComfirmedCountBoardData(res.data)
        self.setMapData(res.data)
      })
    },
    queryTrendDataList () {
      let self = this
      AgricultureService.getDailyList().then((res) => {
        if (!res.success) {
          // TODO 错误处理...
          console.log('错误:' + res.info)
          return
        }
        self.trendDataList = res.data
        // 重置图表数据
        self.setTrendData(res.data)
      })
    },
    setProvinceRankingData (areaList) {
      let provinceList = []
      let dataValueList = []
      for (let i = 0; i < 10; i++) {
        provinceList.push(areaList[i].provinceLabel)
        dataValueList.push(areaList[i].grainOutput)
      }
      let data = {
        provinceList: provinceList,
        valueList: dataValueList
      }
      this.top10ProvinceData = data
    },
    setTrendData (data) {
      let dateList = []
      let percipitationList = []
      let temperatureList = []
      let count = 7
      let sevenDayDateList = []
      let exportedCountList = []
      let importedCountList = []

      // 解析 percipitationList 和 temperatureList
      for (let i = data.percipitationList.length - 1; i >= 0; i--) {
        dateList.push(data.percipitationList[i][0])
        percipitationList.push(data.percipitationList[i][1])
      }
      for (let i = data.temperatureList.length - 1; i >= 0; i--) {
        temperatureList.push(data.temperatureList[i][1])
      }

      // 获取最近7天的日期
      for (let i = 0; i < count && i < dateList.length; i++) {
        sevenDayDateList.push(dateList[i])
      }

      // 获取最近7天的 importedCountList 和 exportedCountList
      for (let i = 0; i < count && i < data.importedCountList.length; i++) {
        importedCountList.push(data.importedCountList[i][1])
      }
      for (let i = 0; i < count && i < data.exportedCountList.length; i++) {
        exportedCountList.push(data.exportedCountList[i][1])
      }

      this.TemperatureAndPerData = {
        dateList: dateList,
        temperatureDataList: temperatureList,
        percipitationDataList: percipitationList,
      }
      this.ImportAndExportChartData = {
        dateList: sevenDayDateList,
        Importedcountlist: importedCountList,
        Exportedcountlist: exportedCountList,
      }

      console.log('进口数据:', this.ImportAndExportChartData.Importedcountlist)
      console.log('出口数据:', this.ImportAndExportChartData.Exportedcountlist)
    }
    ,
    setProvinceComfirmedCountBoardData (areaList) {
      let resultList = areaList.map(item => {
        return [item.provinceLabel, item.confirmedCount, item.curedCount, item.deadCount]
      })
      // 重新生成，否则无法刷新状态
      this.provinceConfirmedCountBoardConfig = initProvinceConfirmedCountBoardConfig(resultList)
    },
    setAreaChartData (areaList) {
      let confirmedCountList = []
      let provinceList = []
      let curedCountList = []
      let deadCountList = []
      areaList.forEach(item => {
        provinceList.push(item.provinceLabel)
        confirmedCountList.push(item.confirmedCount)
        curedCountList.push(item.curedCount)
        deadCountList.push(item.deadCount)
      })
      this.areaData = {
        provinceList: provinceList,
        confirmedCountList: confirmedCountList,
        curedCountList: curedCountList,
        deadCountList: deadCountList
      }
    },
    setMapData (dataList) {
      this.mapDataList = dataList.map(item => {
        return {
          name: item.provinceLabel,
          value: item.precipitation
        }
      })
      /*console.log('地图数据:', this.mapDataList)*/
    },
    provinceTableDialogShowHandler () {
      this.provinceTableDialogVisible = true
    },
    provinceTableDialogClose () {
      this.provinceTableDialogVisible = false
    },
    aboutDialogShowHandler () {
      this.aboutDialogVisible = true
    },
    aboutDialogClose () {
      this.aboutDialogVisible = false
    },
    setBasicData (data) {
      let config = initBasicConfig(data)
      this.defaultDataConfig = config
      this.rate = {
        SoldRate: data.soldrate,
        StoredRate: data.storedrate
      }
    },
    startQueryData () {
      this.queryBasicData()
      this.queryProvinceDataList()
      this.queryTrendDataList()
    },
    initAllChart() {
      this.$refs.dataMap.initChart()
      this.$refs.RateChart.initChart()
      this.$refs.temandperTrendChart.initChart()
      this.$refs.topCountRankChart.initChart()
      this.$refs.importandexportBarChart.initChart()
      this.$refs.basicProportionChart.initChart()
    },
    timestampToTime() {
      const date = new Date(Date.now());
      const Y = date.getFullYear();
      const M = (date.getMonth() + 1).toString().padStart(2, '0');
      const D = date.getDate().toString().padStart(2, '0');
      const h = date.getHours().toString().padStart(2, '0');
      const m = date.getMinutes().toString().padStart(2, '0');
      const s = date.getSeconds().toString().padStart(2, '0');
      return `${Y}-${M}-${D} ${h}:${m}:${s}`;
    }
  },
  mounted () {
    this.initAllChart()
    this.startQueryData()

    let self = this
    // 定义定时器，隔 5 秒刷新一次
    this.timer = setInterval(() => {
      self.startQueryData()
    }, 5000)
  },
  beforeDestroy() {
    clearInterval(this.timer)
  }

}
</script>
<style>
.container {
  position: relative;
}
h1 {
  font-size: 35px;
  font-weight: bold;
  padding: 20px;
}
.flex {
  display: flex;
}
.top-header {
  position: relative;
  margin-bottom: 10px;
}
.top-header-tip {
  font-size: 14px;
  position: absolute;
  padding: 20px 20px;
  text-align: right;
  top: 0;
  right: 0;
}
.title {
  min-width: 350px;
}
.chart-card {
  background: #0f142b;
  border-radius: 10px;
  margin: 0 20px;
}
.main-inner-map-wraper {
  height: 100%;
  margin: 0 20px;
}
.map {
  width: 99%;
  height: 840px;
  padding: 20px 10px 10px 10px;
}
.province-scroll-board-wrapper {
  padding-top: 10px;
  padding-bottom: 10px;
}
.chart-item-bottom-sep {
  margin-bottom: 20px;
}
.province-table-title {
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  padding: 10px 10px 10px 20px;
  text-align: left;
}
.basic-incr-trend-chart-wrapper {
  padding-bottom: 10px;
}
.sub-title,
.last-update-time,
.province-scroll-board-wrapper ::v-deep .dv-scroll-board .header,
.province-scroll-board-wrapper ::v-deep .dv-scroll-board .rows {
  font-size: 14px;
}
.province-scroll-board-wrapper ::v-deep .dv-scroll-board .rows {
  color: #bcbcbf;
}
.province-data-modal-title {
  color: #000;
  font-size: 20px;
  font-weight: bold;
}
.province-data-modal-update-time {
  color: #58585a;
  font-size: 16px;
  font-weight: normal;
  padding-top: 10px;
  display: block;
}
.import-and-export-rate-chart {
  display: flex;
  justify-content: space-around;
}
.top-basic-info {
  display: flex;
}
.dv-scroll-ranking-board .ranking-column .inside-column {
  background: linear-gradient(90deg, #29bfff, #a231ff, #0deccd, #29bfff);
}
.chart-item-container {
  margin: 0 10px;
}
.about-wraper {
  position: fixed;
  bottom: 20px;
  right: 20px;
}
</style>