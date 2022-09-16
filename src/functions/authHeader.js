import {authentication} from '../services/authentication';

export function authHeader() {
  const currentUser = authentication.currentUserValue;
  if (currentUser && currentUser.token) {
    return {Authorization: `Bearer ${currentUser.token}`};
  } else {
    return {};
  }
}
