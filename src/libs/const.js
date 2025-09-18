let baseUrl = '';
if (process.env.NODE_ENV === 'development') {
  // Use Go backend as the unified API entry (Go runs on 8082)
  baseUrl = 'http://127.0.0.1:8082';
} else {
  baseUrl = '';
}

export default {
  baseUrl,
};
