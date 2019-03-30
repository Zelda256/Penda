import request from './utils/request';

export function list(query) {
  return request(`/api/projects?search=${query}`);
}

export function read(id) {
  return request(`/api/projects/${id}`);
}
