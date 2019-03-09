/**
 * BY-Health Front-end Team (http://www.by-health.com/)
 *
 * Copyright © 1995-2018 By-Health Co Ltd. All rights reserved.
 */

import Request from './request';
import * as middlewares from './middleware';
import { baseUrl } from '../../config';

const inst = new Request({
  baseUrl,
  type: 'json',
  auth: true,
}, [
  middlewares.loading,
  middlewares.authcode,
  middlewares.contentType,
  middlewares.http,
  middlewares.timeout,
]);

export default inst;
export {
  Request,
};
export {
  middlewares,
};
