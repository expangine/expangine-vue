/* eslint-disable no-console */

import { register } from 'register-service-worker';

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready() {
      window.console.log(
        'App is being served from cache by a service worker.\n' +
        'For more details, visit https://goo.gl/AFskqB',
      );
    },
    registered() {
      window.console.log('Service worker has been registered.');
    },
    cached() {
      window.console.log('Content has been cached for offline use.');
    },
    updatefound() {
      window.console.log('New content is downloading.');
    },
    updated() {
      window.console.log('New content is available; please refresh.');
    },
    offline() {
      window.console.log('No internet connection found. App is running in offline mode.');
    },
    error(error) {
      window.console.error('Error during service worker registration:', error);
    },
  });
}
