import api from '../config/api.json';

export default class RequestUtils {
  // Returns relevent api urls based on node environment, which is injected via Webpack.
  // If undefined, returns production urls.
  static getAPI() {
    // @ts-ignore
    // eslint-disable-next-line no-undef
    if (NODE_ENV && api[NODE_ENV]) return api[NODE_ENV];
    return api.production;
  }

  static getBody(options) {
    const {
      body,
      headers
    } = options || {};
    if (body && headers) {
      const headersInstance = headers instanceof Headers ? headers : new Headers(headers);
      const contentType = headersInstance.get('Content-Type');
      if ((contentType || '').startsWith('application/json')) {
        return JSON.stringify(body);
      }
    }
    return body;
  }

  /**
   * Makes a request and returns a promise with the json value of the the body,
   * rejects the promise if the response is not ok
   *
   * @param {string} url - The URL of the API being called
   * @param {string} method - The HTTP method of the request
   * @param {object} [options] - The options for the API request, (body, headers, cache, etc.)
   * @param {string} [responseType=json] - The type of response expected from the
   * @param {boolean} [handleErrors=true] - Optional flag to turn off the error handler
   * @returns {Promise<any>} - Returns a promise that resolves into the response body
   */
  static async request(url, method, options, responseType = 'json', handleErrors = true) {
    const requestInit = {
      method,
      ...options,
      body: RequestUtils.getBody(options)
    };
    if (!requestInit.credentials) requestInit.credentials = 'include';
    const requestObject = new Request(url, requestInit);
    const response = await fetch(requestObject);
    if (handleErrors) RequestUtils.globalErrorIdentifier(response);
    const data = await response[responseType]();
    if (handleErrors && data.error) {
      throw Error(data.error);
    }
    return data;
  }

  /**
   * Makes sure the promise rejects on HTTP errors by throwing an error
   *
   * @param {Response} response - The response from the request being processed
   */
  static globalErrorIdentifier(response) {
    if (!response.ok) {
      // TODO move jsx to GlobalProvider and call as a method so we don't have jsx in js utility files
      if (response.status === 503) { // if 503, try to create a new session by redirecting to /api/core/login
        window.location.assign('/api/core/login');
      } else if (
        response.status === 401 ||
        response.statusText === 'Unauthorized' ||
        (response.error && response.error === 'Login required')) {
        window.location.assign('/login');
      } else {
        console.error(response.statusText);
        throw Error(response.statusText);
      }
    }
  }

  /**
   * Given an object, returns a string with the in the format of the
   * query params (param1=value1&param2=value)
   *
   * @param {object} params - The object containing the query params to be formatted
   * @returns {string} - The query string minus the initial &
   */
  static formatQueryParams(params) {
    return Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');
  }

  static getParameterByName(param) {
    const url = window.location.href;
    const name = param.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
    const results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  // checks getuserdetail endpoint every few minutes in order to check if user's session has expired
  // if so, redirects to login page
  static initAuthPolling() {
    const INTERVAL_MINUTES = 5;
    setInterval(() => {
      RequestUtils.request(RequestUtils.getAPI().user.url, 'GET')
        .then(() => {
          // on success, do nothing
        }).catch(() => {
          // on error, redirect to login page with CTA to login again
          window.location.href = '/login';
        });
    }, INTERVAL_MINUTES * 60 * 1000);
  }
}
