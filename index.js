const Nightmare = require('nightmare');
const client = require('twilio')('AC645a219ee3e2fb800e62b262ecdaada4', process.env.TWILLIO);
const Slack = require('node-slack');
const slack = new Slack("https://hooks.slack.com/services/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");
const dot = require('dotenv').config();
const CronJob = require('cron').CronJob;

// Setup cron
var jb = new CronJob('0 */1 * * * *', function() {
    runScript();
}, null, true, 'America/Los_Angeles');

jb.start();



function runScript()
{
  let nightmare = Nightmare({ show: false });

  nightmare
  .goto('https://home.mylularoe.com/www/login')
  .evaluate(function () {
      var a = document.querySelectorAll('#LoginName');
      a[0].value = "";
    })
    .type('#LoginName', process.env.USER)
    .type('#Password', process.env.PASS)
    .click('#loginbutton')
    .wait('#site-content')
    .goto('https://build.mylularoe.com/store/products')
    .wait('#site-content')
    .evaluate(function () {
      var a = document.querySelectorAll('td[data-itemcode="105-35"]');
      return a[2].innerHTML;
    })
  .end()
  .then(result => {
    result = result.trim();
    if(result === '<span class="out-of-stock">SOLD OUT</span>')
    {
      slack.send({
        text: 'Running!',
      });
    }
    else {
      client.sendMessage({
        to:'+15135930807', // Any number Twilio can deliver to
        from: '+15132808426', // A number you bought from Twilio and can use for outbound communication
        body: 'There are leggings!' // body of the SMS message
      });
    }
  })
  .catch(error => {
    console.error('Search failed:', error);
  });
};