# Luminary POC

## How does it work?

This project includes an oauth server, an alexa skill handler (for lambda), and a firebase application built with Vue.

### Files to look out

|         apps         |          files          |
| :------------------: | :---------------------: |
|     oauth server     |      `./oauth.js`       |
|     alexa skill      |      `./alexa.js`       |
| firebase application | `./src/views/Login.vue` |

## Firebase setup

- Go to `https://console.firebase.google.com/` and create a new firebase project. In this case the project's id is `luminary-1696a`.
- After that go to `Authentication` > `Sign-in method` > (enable Google / Facebook). Make sure to follow the instructions for Facebook setup.
- Get firebaseConfig credentials for your webApp and firebase admin credentials. Go to `Settings` > `General` > `Your Apps`. Finally to get firebase admin sdk credentials go to `Settings` > `Service Accounts` > `Firebase admin SDK`.
- Create a file in the root folder and name it `firebase_admin_private_key.json` with credentials from the third step.
- Create a file in the root folder and name it `firebase_client_config.json` with credentials from the third step.

## Project setup

```
yarn install
```

##

### Compiles and hot-reloads for development

```
yarn run serve
```

### Compiles and minifies for production

```
yarn run build
```

### Run your tests

```
yarn run test
```

### Lints and fixes files

```
yarn run lint
```

### Run your end-to-end tests

```
yarn run test:e2e
```

### Run your unit tests

```
yarn run test:unit
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
