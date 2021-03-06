import request from './utils/request';
// import { func } from 'prop-types';

export function list(query) {
  return request(`/api/projects?search=${query}`);
}


export function createProject(project) {
  return request('/api/projects/', {
    method: 'POST',
    headers: {
      'user-agent': 'Mozilla/4.0 MDN Example',
      'content-type': 'application/json'
    },
    credentials: 'same-origin',
    body: JSON.stringify(project)
  });
}

export function listName() {
  return request('/api/projects/name');
}

export function listTeams() {
  return request('/api/teams');
}

export function read(id) {
  return request(`/api/projects/${id}`);
}

export function createProcess(projectId, process) {
  // console.log('processssss', process);
  return request(`/api/process/${projectId}`, {
    method: 'POST',
    headers: {
      'user-agent': 'Mozilla/4.0 MDN Example',
      'content-type': 'application/json'
    },
    credentials: 'same-origin',
    body: JSON.stringify(process)
  });
}

export function getRefundAmount(projectId) {
  return request(`/api/refundAmount/${projectId}`);
}

export function createRefund(refund) {
  return request('/api/refunds/', {
    method: 'POST',
    headers: {
      'user-agent': 'Mozilla/4.0 MDN Example',
      'content-type': 'application/json'
    },
    credentials: 'same-origin',
    body: JSON.stringify(refund)
  });
}


export function updateProcessStatus(processId, body) {
  return request(`/api/process/status/${processId}`, {
    method: 'PUT',
    headers: {
      'user-agent': 'Mozilla/4.0 MDN Example',
      'content-type': 'application/json'
    },
    credentials: 'same-origin',
    body: JSON.stringify(body)
  });
}


