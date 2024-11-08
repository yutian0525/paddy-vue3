<template>
  <div
      ref="dataMap"
      class="main-map-chart"
      style="width: 100%; height: 100%"
  />
</template>

<script>
import '../../assets/china'
import * as echarts from 'echarts'

let chart = null

export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    list: {
      type: Array,
      default: () => [],
      required: true
    }
  },
  data() {
    return {
      config: {}
    }
  },
  methods: {
    initChart() {
      if (chart !== null && chart !== undefined) {
        chart.dispose()
      }
      chart = echarts.init(this.$refs.dataMap)
      this.setOptions()
    },
    setOptions() {
      const option = {
        tooltip: {
          triggerOn: 'click',
          formatter: function (params) {
            console.log('Tooltip params:', params);
            let value = params.value;
            if (value === null || value === undefined) {
              value = '无数据';
            }
            return params.seriesName + '<br />' + params.name + '：' + value + ' mm';
          },
        },
        title: {
          text: this.title,
          top: 50,
          left: 'center',
          textStyle: {
            fontWeight: 'bolder',
            fontSize: 24,
            color: '#BCBCBF'
          }
        },
        visualMap: {
          min: 0,
          max: 500,
          left: 26,
          bottom: 40,
          showLabel: true,
          textStyle: {
            color: 'rgba(255,255,255,0.51)'
          },
          pieces: [
            {gt: 400, label: '> 400 mm', color: '#0A2C4C'},
            {gte: 300, lte: 400, label: '300 - 400 mm', color: '#1E4D77'},
            {gte: 200, lt: 300, label: '200 - 300 mm', color: '#336699'},
            {gte: 100, lt: 200, label: '100 - 200 mm', color: '#6699CC'},
            {gt: 0, lt: 100, label: '< 100 mm', color: '#99CCFF'},
          ],
          show: true,
        },
        geo: {
          map: 'china',
          roam: true,
          scaleLimit: {
            min: 1,
            max: 3,
          },
          zoom: 1.23,
          top: 120,
          label: {
            normal: {
              show: true,
              fontSize: '14',
              color: 'rgba(255,255,255,0.7)',
            },
          },
          itemStyle: {
            normal: {
              areaColor: '#323c48',
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
              borderColor: 'rgba(0, 0, 0, 0.2)',
            },
            emphasis: {
              areaColor: '#1E1D3C',
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              borderWidth: 0,
            },
          }
        },
        series: [
          {
            name: 'Precipitation (mm)',
            type: 'map',
            geoIndex: 0,
            data: this.formatData(this.list)
          }
        ],
      }
     /* console.log('ECharts Option:', option);*/
      chart.setOption(option);
    },
    formatData(list) {
      return list.map(item => {
       /* console.log('MapProvince:', item.name, 'MapPrecipitation:', item.value);*/
        return {
          name: item.name,
          value: parseFloat(item.value) // 将字符串转换为数值
        };
      });
    }
  },
  watch: {
    list: {
      handler(newValue, oldValue) {
        if (newValue !== oldValue) {
          this.setOptions()
        }
      },
      deep: true
    }
  },
  mounted() {
    this.initChart()
  },
  beforeDestroy() {
    if (chart) {
      chart.dispose()
    }
  }
}
</script>
