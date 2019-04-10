import request from './utils/request';

export function list(query) {
  return request(`/api/users?search=${query}`);
}
