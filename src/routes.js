const express = require('express');
const slackCtrl = require('./controllers/slack.controller.js');

const router = express.Router();

router.post('/action-endpoint', slackCtrl.actionEndpoint);
router.post('/auth-endpoint', slackCtrl.authEndpoint);

module.exports = router;
