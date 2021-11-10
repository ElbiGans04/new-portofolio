module.exports = {
  reactStrictMode: true,
  async headers() {
    return [{
      source: '/api/login',
      headers: [
        {key: 'content-type', value: 'application/vnd.api+json'}
      ]
    }]
  }
}
