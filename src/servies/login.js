import request from './utils/request';

export function login({ username, password }) {
  return request('/api/login', {
    method: 'POST',
    headers: {
      'user-agent': 'Mozilla/4.0 MDN Example',
      'content-type': 'application/json'
    },
    credentials: 'same-origin',
    body: JSON.stringify({
      username: username,
      password: password
    })
  });
}
