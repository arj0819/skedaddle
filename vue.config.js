module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  // Refer to https://cli.vuejs.org/config/#pages for more information
  pages: {
      index: {
          entry: 'src/main.js',
          template: 'public/index.html',
          filename: 'index.html',
          title: 'Skedaddle',
      }
  }
}
