module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        loader: 'file-loader',
        options: {
          name(resourcePath, resourceQuery) {
            // `resourcePath` - `/absolute/path/to/file.js`
            // `resourceQuery` - `?foo=bar`
 
            if (process.env.NODE_ENV === 'development') {
              return '[path][name].[ext]';
            }
 
            return '[contenthash].[ext]';
          },
        },
      },
    ],
  },
};