const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {

  entry: [
    'babel-polyfill',
    'whatwg-fetch',
    path.join(__dirname, 'app/index.jsx')
  ],

  output: {
    path: path.join(__dirname, 'public/build'),
    filename: '[name]-[hash].min.js',
    publicPath: '/'
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: 'app/index.tpl.html',
      inject: 'body',
      filename: 'index.html'
    }),
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(process.env.npm_config_env)
    }),
    new ExtractTextPlugin('[name]-[hash].min.css'),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    }),
    new CopyWebpackPlugin([
      {from: __dirname + '/app/images', to: __dirname + '/public/build/images', toType: 'dir'} 
    ]),
    new BundleAnalyzerPlugin()
  ],

  resolve: {
    extensions: ['.js', '.jsx']
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.s?css$/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: true,
                includePaths: [
                  path.resolve(__dirname, './node_modules/')
                ]
              }
            },
            {
              loader: 'sass-loader',
              options: {
                includePaths: [
                  path.resolve(__dirname, './node_modules/')
                ]
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: [autoprefixer]
              }
            }
          ]
        })
      },
      {
        test: /\.(png|jpe?g|gif|svg|ico)$/,
        exclude: /fonts/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'images/[name].[ext]'
          }
        }
      },
      {
        test: /\.(eot|svg|ttf|woff2?)$/,
        exclude: /images/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'fonts/[name].[ext]'
          }
        }
      },
      {
        test: /\.(mp3|wav|ogg|flac)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'audio/[name].[ext]'
          }
        }
      },
      {
        test: /\.(mp4|avi|ogv|webm)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'video/[name].[ext]'
          }
        }
      }
    ]
  }

};
