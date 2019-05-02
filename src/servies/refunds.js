import request from './utils/request';

export function list(query) {
  let url = '/api/refunds?';
  if (query && query.project) {
    url += `projectId=${query.project}&`;
  }
  if (query && query.type) {
    url += `type=${query.type}`;
  }
  return request(url);
}
