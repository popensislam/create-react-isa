import webpack from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { BuildOptions } from './types/config';
import ReactRefreshTypeScript from 'react-refresh-typescript';

export function buildLoaders(options: BuildOptions): webpack.RuleSetRule[] {

  const { isDev } = options;


  const fileLoader = {
    test: /\.(png|jpe?g|gif|woff|woff2)$/i,
    use: [
      { loader: 'file-loader', },
    ],
  };

  const svgrLoader = {
    test: /\.svg$/i,
    issuer: /\.[jt]sx?$/,
    use: [ '@svgr/webpack' ],
  };

  const styleLoader = {
    test: /\.s[ac]ss$/i,
    use: [
      options.isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
      {
        loader: 'css-loader',
        options: {
          modules: {
            auto: (resPath: string) => Boolean(resPath.includes('.module.')),
            localIdentName: options.isDev
              ? '[path][name]__[local]--[hash:base64:4]'
              : '[hash:base64:8]',
          }
        }
      },
      'sass-loader',
    ],
  };

  const tsLoader = {
    test: /\.tsx?$/,
    use: [
      {
        loader: 'ts-loader',
        options: {
          getCustomTransformers: () => ({ before: [ isDev && ReactRefreshTypeScript() ].filter(Boolean), }),
          transpileOnly: isDev,
        },
      },
    ],
    exclude: /node_modules/,
  };

  return [ tsLoader,
    styleLoader,
    svgrLoader,
    fileLoader ];
}
