// const dayjs = require('dayjs');
// const formattedDate = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss');
// console.log(formattedDate);

var CronJob = require('cron').CronJob;
var job = new CronJob(
    '* * * * * *',
    function() {
        console.log('You will see this message every second');
    },
    null,
    true,
    'America/Los_Angeles'
);
// job.start() - See note below when to use this