/**
 * BY-Health Front-end Team (http://www.by-health.com/)
 *
 * Copyright © 1995-2018 By-Health Co Ltd. All rights reserved.
 */

import { stringify } from 'qs';
import { signature as stamp } from '../hash';
import { methodWithBody, methodWithoutBody } from './utils';

export function signature(ctx, next) {
  if (ctx.signature && ctx.signature.serverKey) {
    const type = methodWithoutBody(ctx.method) ? 'params' : 'body';
    ctx[type] = ctx[type] || {};
    ctx[type].serverKey = ctx.signature.serverKey;
    ctx[type].timestamp = Date.now();
    ctx[type].sign = stamp(ctx[type], ctx.signature.serverSecert);
  }

  return next();
}

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
