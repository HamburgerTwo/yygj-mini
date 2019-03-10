/**
 * BY-Health Front-end Team (http://www.by-health.com/)
 *
 * Copyright © 1995-2018 By-Health Co Ltd. All rights reserved.
 */

import { stringify } from 'qs';
import { methodWithBody } from './utils';
import Taro from '@tarojs/taro'

export function contentType(ctx, next) {
  if (methodWithBody(ctx.method)) {
    switch (ctx.type) {
      case 'form':
        ctx.body = stringify(ctx.body);
        ctx.headers['Content-Type'] =
          'application/x-www-form-urlencoded;charset=utf-8';
        break;
      case 'json':
        ctx.body = JSON.stringify(ctx.body);
        ctx.headers['Content-Type'] = 'application/json;charset=utf-8';
        break;
      default:
      ctx.body = stringify(ctx.body);
        break;
    }
  }

  return next();
}

export async function http(_, next) {
  const res = await next();
  if (res.statusCode >= 200 && res.statusCode <= 299) {
    
    return res.data;
  }

  return Promise.reject(res);
}

export function timeout(ctx, next) {
  if (typeof ctx.timeout === 'number') {
    if (ctx.timeout > 0 && ctx.timeout !== Infinity) {
      return Promise.race([
        next(),
        new Promise((_, reject) => {
          setTimeout(() => {
            if (
              ctx.cancelToken &&
              typeof ctx.cancelToken.abort === 'function'
            ) {
              ctx.cancelToken.abort();
            }
            reject(new Error('Timeout Error'));
          }, ctx.timeout);
        }),
      ]);
    }
  }

  return next();
}

export function authcode(ctx, next) {
  const jwt = Taro.getStorageSync('jwt');
  if(ctx.auth && jwt){
    ctx.headers['Authorization'] = `Bearer ${jwt}`;
  }
  return next();
}

export function loading(_, next) {
  Taro.showLoading();
  return next().then((res) => {
    Taro.hideLoading();
    return res;
  }).catch((err) => {
    Taro.hideLoading();
    throw err;
  })
}