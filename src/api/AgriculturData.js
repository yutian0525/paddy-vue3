import * as request from '@/utils/request'

/**
 * 接口封装
 */
export default {
  getOverall() {
    let url = `/api/agriculture/overall?_=${Math.random()}`
    return request.get(url).then(response => {
      console.log('Overall Data:', response)
      return response
    })
  },
  getProvinceDataList() {
    let url = `/api/agriculture/area/latest/list?_=${Math.random()}`
    return request.get(url).then(response => {
      console.log('Province Data List:', response)
      return response
    })
  },
  getDailyList() {
    let url = `/api/agriculture/list?t=${Math.random()}`
    return request.get(url).then(response => {
      console.log('Daily List:', response)
      return response
    })
  }
}