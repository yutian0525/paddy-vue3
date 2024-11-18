<template>
  <div ref="rateChart" style="width: 100%; height: 0"></div>
<!--    <img src="https://mypan.yutiantian.top/raw/temp/temp.png" alt="" style="width: 900px;height: 600px;">-->
</template>
<script>
let chart = null
export default {
  props: {
    title: String,
    data: Object,
  },
  data () {
    return {
      d: 99
    }
  },
  methods: {
    initChart () {
      if (null != chart && undefined != chart) {
        chart.dispose()
      }
      chart = this.$echarts.init(this.$refs.rateChart)
      this.setOptions()
    },
    setOptions() {
      let soldratedata = [this.data.SoldRate, this.data.SoldRate, this.data.SoldRate];
      let storeratedata = [this.data.StoredRate, this.data.StoredRate, this.data.StoredRate];
      let option = {
        title: [{
          text: (this.data.SoldRate).toFixed(2) + '{a|%}',
          textStyle: {
            fontSize: 20,
            fontFamily: 'Microsoft Yahei',
            fontWeight: 'normal',
            color: '#bcb8fb',
            rich: {
              a: {
                fontSize: 16,
              }
            }
          },
          x: '20px',
          y: '30%'
        },{
          text: (this.data.StoredRate).toFixed(2) + '{a|%}',
          textStyle: {
            fontSize: 20,
            fontFamily: 'Microsoft Yahei',
            fontWeight: 'normal',
            color: '#bcb8fb',
            rich: {
              a: {
                fontSize: 16,
              }
            }
          },
          x: '60%',
          y: '30%'
        }],
        graphic: [{
          type: 'group',
          left: '30px',
          top: '60%',
          children: [{
            type: 'text',
            z: 100,
            left: '10',
            top: 'middle',
            style: {
              fill: '#aab2fa',
              text: '销售率',
              font: '16px Microsoft YaHei'
            }
          }]
        },{
          type: 'group',
          left: '170px',
          top: '60%',
          children: [{
            type: 'text',
            z: 100,
            left: '10',
            top: 'middle',
            style: {
              fill: '#aab2fa',
              text: '库存率',
              font: '16px Microsoft YaHei'
            }
          }]
        }],
        series: [{
          type: 'liquidFill',
          radius: '80%',
          center: ['20%', '50%'],
          //  shape: 'roundRect',
          data: soldratedata,
          backgroundStyle: {
            color: {
              type: 'linear',
              x: 1,
              y: 0,
              x2: 0.5,
              y2: 1,
              colorStops: [{
                offset: 1,
                color: 'rgba(68, 145, 253, 0)'
              }, {
                offset: 0.5,
                color: 'rgba(68, 145, 253, .25)'
              }, {
                offset: 0,
                color: 'rgba(68, 145, 253, 1)'
              }],
              globalCoord: false
            },
          },
          outline: {
            borderDistance: 0,
            itemStyle: {
              borderWidth: 5,
              borderColor: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0,
                  color: 'rgba(69, 73, 240, 0)'
                }, {
                  offset: 0.5,
                  color: 'rgba(69, 73, 240, .25)'
                }, {
                  offset: 1,
                  color: 'rgba(69, 73, 240, 1)'
                }],
                globalCoord: false
              },
              shadowBlur: 10,
              shadowColor: '#000',
            }
          },
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 1,
                color: 'rgba(58, 71, 212, 0)'
              }, {
                offset: 0.5,
                color: 'rgba(31, 222, 225, .2)'
              }, {
                offset: 0,
                color: 'rgba(31, 222, 225, 1)'
              }],
              globalCoord: false
            },
          },
          label: {
            normal: {
              formatter: '',
            }
          }
        },
        // 死亡率
        {
          type: 'liquidFill',
          radius: '80%',
          center: ['70%', '50%'],
          //  shape: 'roundRect',
          data: storeratedata,
          backgroundStyle: {
            color: {
              type: 'linear',
              x: 1,
              y: 0,
              x2: 0.5,
              y2: 1,
              colorStops: [{
                offset: 1,
                color: 'rgba(68, 145, 253, 0)'
              }, {
                offset: 0.5,
                color: 'rgba(68, 145, 253, .25)'
              }, {
                offset: 0,
                color: 'rgba(68, 145, 253, 1)'
              }],
              globalCoord: false
            },
          },
          outline: {
            borderDistance: 0,
            itemStyle: {
              borderWidth: 5,
              borderColor: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0,
                  color: 'rgba(69, 73, 240, 0)'
                }, {
                  offset: 0.5,
                  color: 'rgba(69, 73, 240, .25)'
                }, {
                  offset: 1,
                  color: 'rgba(69, 73, 240, 1)'
                }],
                globalCoord: false
              },
              shadowBlur: 10,
              shadowColor: '#000',
            }
          },
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 1,
                color: 'rgba(58, 71, 212, 0)'
              }, {
                offset: 0.5,
                color: 'rgba(31, 222, 225, .2)'
              }, {
                offset: 0,
                color: 'rgba(31, 222, 225, 1)'
              }],
              globalCoord: false
            },
          },
          label: {
            normal: {
              formatter: '',
            }
          }
        }]
      };
      //
      chart.setOption(option)
    }
  },
  watch: {
    data: {
      handler (newValue, oldValue) {
        if (oldValue != newValue) {
          this.setOptions()
        }
      },
      deep: true
    }
  }
}
</script>