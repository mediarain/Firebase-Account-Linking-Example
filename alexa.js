const voxa = require('voxa');
const firebase = require('firebase');

const fireBaseConfig = require('./firebase_client_config.json');

firebase.initializeApp(fireBaseConfig);

const views = {
  en: {
    translation: {
      Launch: {
        tell: 'Hello {name}',
      },
      Error: {
        tell: 'Too bad something went wrong!. Try again later',
      },
    },
  },
};
const variables = {
  name: alexaEvent => alexaEvent.model.name,
};

const app = new voxa.VoxaApp({ variables, views });

app.onIntent('LaunchIntent', async (voxaEvent) => {
  if (voxaEvent.user.accessToken) {
    await firebase
      .auth()
      .signInWithCustomToken(voxaEvent.user.accessToken)
      .catch((error) => {
        // Handle Errors here.
        const { code, message } = error;
        console.log(code, message);
        return { reply: 'Error', flow: 'terminate' };
      });
  }

  const user = firebase.auth().currentUser;
  voxaEvent.model.name = user ? user.displayName : 'world';

  console.log(`hello ${voxaEvent.model.name}`);
  return { reply: 'Launch', flow: 'terminate' };
});

const alexaSkill = new voxa.AlexaPlatform(app);
alexaSkill.startServer(4000);
