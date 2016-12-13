import datetime
import os

import boto3
import dateutil

MAX_AGE = int(os.environ["MAX_AGE"])
PARAMS = {
    "Filters": [{"Name": "volume-id",
                 "Values": os.environ["VOLUMES"].split(" ")}]
}


def max_age():
    now = datetime.datetime.utcnow().replace(tzinfo=dateutil.tz.tzutc())
    return now - datetime.timedelta(days=MAX_AGE)


def lambda_handler(event, context):
    ec2 = boto3.client('ec2', region_name=os.environ["AWS_REGION"])
    shots = ec2.describe_snapshots(**PARAMS)
    old = max_age()

    count = 0
    for snap in shots["Snapshots"]:
        if snap["StartTime"] < old:
            count += 1
            ec2.delete_snapshot(SnapshotId=snap['SnapshotId'])

    print("Deleted {} snapshot(s)".format(count))
