import {BehaviorSubject} from 'rxjs';
import Api from '../class/Api';

const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));

const login = (username, password) => {
  let data = {
    username: username,
    password: password
  }
  return new Promise((resolve, reject) => {
    return Api.login(data).then((user) => {
      if (user) {
        localStorage.setItem('lastLogin', String(Math.floor(Date.now() / 1000)));
        localStorage.setItem('currentUser', JSON.stringify(user));
        currentUserSubject.next(user);
      }
      resolve(user);
    }).catch(() => {
      resolve();
    });
  });
};

const ping = () => {
  return new Promise((resolve, reject) => {
    return Api.ping().then(() => {
      resolve();
    }).catch(() => {
      resolve();
    });
  });
};

const logout = () => {
  localStorage.removeItem('currentUser');
  currentUserSubject.next(null);
};

export const authentication = {
  login,
  ping,
  logout,
  currentUser: currentUserSubject.asObservable(),
  get currentUserValue() {
    return currentUserSubject.value;
  },
  get isCurrentUser() {
    return currentUserSubject.value || null;
  },
  get isSuper() {
    return ('role' in currentUserSubject.value && currentUserSubject.value.role === 'super');
  },
  get isAdmin() {
    return ('role' in currentUserSubject.value && currentUserSubject.value.role === 'admin');
  },
  get isUser() {
    return ('role' in currentUserSubject.value && currentUserSubject.value.role === 'user');
  },
  get isSubscriber() {
    return ('role' in currentUserSubject.value && currentUserSubject.value.role === 'subscriber');
  }
};
