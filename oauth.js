const express = require('express');
const bodyParser = require('body-parser');
const firebaseAdmin = require('firebase-admin');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const _ = require('lodash');
const serviceAccount = require('./firebase_admin_private_key');
const { databaseURL } = require('./firebase_client_config');

const privateSecret = 'gz*C2vs#RlRCYF@XqGL3mq#RcS!QmY@23NitpCME97GKS4WldYJvaMnQhNDD6vshTmj!zErv$Os';

const alexaOauth = {
  clientId: 'alexa',
  clientSecret: 'secret',
  expiresIn: 3600,
};

const fireBaseConfig = {
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL,
};
firebaseAdmin.initializeApp(fireBaseConfig);

function validClientIdSecret(req) {
  return (
    alexaOauth.clientId === _.get(req, 'body.client_id')
    && alexaOauth.clientSecret === _.get(req, 'body.client_secret')
  );
}

async function getUIDFromToken(req) {
  let decodedToken;

  try {
    if (req.body.grant_type === 'refresh_token') {
      decodedToken = jwt.verify(req.body.refresh_token, privateSecret);
    }

    if (req.body.grant_type === 'authorization_code') {
      decodedToken = await firebaseAdmin.auth().verifyIdToken(req.body.code);
    }
  } catch (e) {
    console.error(e);
    throw Error('invalid token');
  }

  const uid = _.get(decodedToken, 'uid');

  if (!uid) {
    throw Error('no record');
  }

  return uid;
}

async function createAccessToken(uid) {
  const additionalClaims = {
    alexa: true,
  };

  // Create a custom token. See https://firebase.google.com/docs/auth/admin/create-custom-tokens
  const customToken = await firebaseAdmin.auth().createCustomToken(uid, additionalClaims);
  return customToken;
}

function createRefreshToken(uid) {
  const refreshToken = jwt.sign(
    {
      uid,
      createdDate: new Date(),
      sign: uuid.v4(),
      collection: 'alexa',
    },
    privateSecret,
  );
  return refreshToken;
}

async function getAuthTokenByCode(req) {
  let refreshToken;

  const uid = await getUIDFromToken(req);
  const accessToken = await createAccessToken(uid);

  if (req.body.grant_type === 'refresh_token') {
    refreshToken = req.body.refresh_token; // reuse refresh token
  }

  if (req.body.grant_type === 'authorization_code') {
    refreshToken = createRefreshToken(uid); // generate a new refresh token
  }

  return {
    access_token: accessToken,
    token_type: 'Bearer',
    refresh_token: refreshToken,
    expires_in: alexaOauth.expiresIn,
    id_token: '',
  };
}

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

const port = 3000;

app.post('/oauth', async (req, res) => {
  console.log(JSON.stringify(req.body), null, 2);
  // check client_id and client_secret
  try {
    if (!validClientIdSecret(req)) {
      throw Error('invalid client-secret');
    }
    if (_.includes(['authorization_code', 'refresh_token'], req.body.grant_type)) {
      const resp = await getAuthTokenByCode(req);
      return res.json(resp);
    }
  } catch (e) {
    console.log(e);
    return res.sendStatus(403);
  }

  return res.sendStatus(404);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
