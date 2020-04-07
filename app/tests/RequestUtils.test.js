import 'whatwg-fetch';
import RequestUtils from '../utilities/RequestUtils';

const { location } = window;
const spy = jest.fn();

beforeAll(() => {
  delete window.location;
  window.location = { ...location, assign: spy };
});

afterAll(() => {
  window.location = location;
});

describe('testing Request Utilities', () => {
  // External Link test
  test('testing for valid API config', () => {
    global.NODE_ENV = process.env.NODE_ENV;
    const api = RequestUtils.getAPI();
    expect(api).toMatchObject({
      user: { url: '/api/core/auth/getUserDetail' }, blueGroupAccess: { url: '/api/core/auth/hasBlueGroupAccess' }, avatar: { url: '/api/core/auth/getBPPhoto/' }, SSOLogin: { url: '/api/core/login' }, contact: { url: '/api/contact/contact/' }, savedContacts: { url: '/api/contact/contacts/saved' }, recentContacts: { url: '/api/contact/contacts/recent' }, search: { url: '/api/contact/search' }, autocomplete: { url: '/api/contact/search/autocomplete' }
    });
  });

  test('testing for undefined body', () => {
    const body = RequestUtils.getBody();
    expect(body).toBe(undefined);
  });

  test('testing redirect on response 401', () => {
    const response = new Response(null, { status: 401, ok: false });
    RequestUtils.globalErrorIdentifier(response);
    expect(spy).toBeCalledWith('/login');
  });

  test('testing redirect on response 503', () => {
    const response = new Response(null, { status: 503, ok: false });
    RequestUtils.globalErrorIdentifier(response);
    expect(spy).toBeCalledWith('/api/core/login');
  });

  test('testing successfull request', async() => {
    const url = 'http://www.mocky.io/v2/5e1cc2d73200005000228836';
    const data = await RequestUtils.request(url, 'GET');
    expect(data).toMatchObject({
      message: 'Hello World!'
    });
  });

  test('testing failed request', async() => {
    const url = 'http://www.mocky.io/v2/5e1cc2ff3200002b00228837';
    await expect(RequestUtils.request(url, 'GET')).rejects.toThrow();
  });

  test('testing format query paramaters', async() => {
    const result = RequestUtils.formatQueryParams({
      url: 'http://www,ibm.com',
      message: 'Hello World!'
    });
    await expect(result).toBe('url=http%3A%2F%2Fwww%2Cibm.com&message=Hello%20World!');
  });

  test('testing get parameter by name', () => {
    Object.defineProperty(window.location, 'href', {
      configurable: true,
      writable: true
    });
    window.location.href = 'http://www.ibm.com?mobile=true&message=Hello%20World!';
    const param = RequestUtils.getParameterByName('message');
    expect(param).toBe('Hello World!');
  });
});
