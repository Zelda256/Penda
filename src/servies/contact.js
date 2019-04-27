import request from './utils/request';

export function list(query) {
  return request(`/api/contacts?search=${query}`);
}

export function addUserToConact(contactId, userId) {
  return request(`/api/contacts/${contactId}`, {
    method: 'POST',
    headers: {
      'user-agent': 'Mozilla/4.0 MDN Example',
      'content-type': 'application/json'
    },
    credentials: 'same-origin',
    body: JSON.stringify({
      userId
    })
  });
}

export function removeUserInContact(contactId, userId) {
  return request(`/api/contacts/${contactId}`, {
    method: 'PUT',
    headers: {
      'user-agent': 'Mozilla/4.0 MDN Example',
      'content-type': 'application/json'
    },
    credentials: 'same-origin',
    body: JSON.stringify({
      userId
    })
  });
}

export function updateUser(userId, userInfo) {
  return request(`/api/users/${userId}`, {
    method: 'PUT',
    headers: {
      'user-agent': 'Mozilla/4.0 MDN Example',
      'content-type': 'application/json'
    },
    credentials: 'same-origin',
    body: JSON.stringify(userInfo)
  });
}
