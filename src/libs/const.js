let baseUrl = ''
if (process.env.NODE_ENV === 'development') {
  baseUrl = 'http://127.0.0.1:5000'
} else {
  baseUrl = '' 
}

export default {
  baseUrl
}