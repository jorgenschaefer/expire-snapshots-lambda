var AWS = require('aws-sdk');

var MAX_AGE = parseInt(process.env.MAX_AGE);
var PARAMS = {
  Filters: [{Name: "volume-id",
             Values: process.env.VOLUMES.split(" ")}]
};

function daysOld(time) {
  return (new Date() - time)/(1000*60*60*24);
}

exports.handler = (event, context, callback) => {
  var ec2 = new AWS.EC2({region: process.env.AWS_REGION});

  ec2.describeSnapshots(PARAMS).promise()
    .then(data => Promise.all(
        data.Snapshots
          .filter(snap => daysOld(snap.StartTime) > MAX_AGE)
          .map(snap => ec2.deleteSnapshot({SnapshotId: snap.SnapshotId}).promise())
    ))
    .then(results => {
      console.log(`Deleted ${results.length} snapshot(s)`)
      callback(null, `Deleted ${results.length} snapshot(s)`);
    })
    .catch(err => {
      console.log(err, err.stack);
      callback(err);
    });
};
