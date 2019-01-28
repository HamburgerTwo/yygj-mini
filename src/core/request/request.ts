/**
 * BY-Health Front-end Team (http://www.by-health.com/)
 *
 * Copyright © 1995-2018 By-Health Co Ltd. All rights reserved.
 */

import extend from 'extend';
import { stringify } from 'qs';
import compose from './compose';
import { isAbsoluteUrl } from './utils';
import { Context, Middleware, Options, HttpMethod, HttpPayload } from './types';

class Request {
  public static props: Array<string> = ['header'];
  public static defaults: Options = {};
  private readonly middlewares: Middleware[];
  private options: Options;

  constructor(options, middlewares) {
    this.options = extend(true, this.options, options);
    if (!options.headers) {
      this.options.headers = {};
    }
    this.middlewares=middlewares.reverse();
  }

  public use = (fn: Middleware) => {
    if (typeof fn !== 'function') {
      throw new TypeError('Middleware must be a function!');
    }

    this.middlewares.unshift(fn);
  };

  public request<T>(ctx: Context) : Promise<T>  {
    const { url, method, params, headers, baseUrl, body } = ctx;
    if (typeof url !== 'string') {
      throw new TypeError(
        `Parameter 'url' must be a string, not ${typeof url}`,
      );
    }

    const _baseUrl = isAbsoluteUrl(url) ? '' : baseUrl; // eslint-disable-line
    const concatSymbol = url.indexOf('?') > -1 ? '&' : '?';
    const queryString = stringify(params);

    return new Promise((resolve, reject) => {
      ctx.cancelToken = wx.request({
        // eslint-disable-line
        url: `${_baseUrl || ''}${url}${queryString && concatSymbol + queryString}`,
        method,
        header: headers,
        data: body,

        success: resolve,
        fail: reject,
      });
    });
  };

  public fetch<T> (url: string, options?: Options) : Promise<T> {
    
    const fn = compose(this.middlewares);
    const ctx = extend(true, {}, this.options, options, { url });
    return fn(ctx, this.request);
  };

  public get<T>(url: string, options?: Options): Promise<T> {
    return this.fetch<T>(url, extend(options, { method: 'GET' }));
  }
  public delete<T>(url: string, options?: Options): Promise<T> {
    return this.fetch<T>(url, extend(options, { method: 'DELETE' }));
  }

  public post<T>(url, payload, options?: Options): Promise<T> {
    
    return this.fetch<T>(url, extend(options, { method: 'POST', body: payload }));
  }

  public put<T>( url, payload, options?: Options): Promise<T>{
    return this.fetch<T>(url, extend(options, { method: 'PUT', body: payload }));
  }
}

export default Request;
