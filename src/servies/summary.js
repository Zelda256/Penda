import request from './utils/request';

export function list(query) {
  console.log(query);
  let url = '/api/refunds/summary?';
  if (query && query.project) {
    console.log(query.project);
    url += `projectId=${query.project}`;
  }

  return request(url);
}
