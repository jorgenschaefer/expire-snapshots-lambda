Trivial exercise to compare writing Lambda functions in JavaScript and Python.

The purpose of the function is simple: Just expire snapshots older than a week. It's configured by the environment variables `MAX_AGE` (in days) and `VOLUMES` (space-separated list of volumes whose snapshots should be expired).

Deployment is simple:

```
zip expire.zip expire.js
aws lambda update-function-code --function-name expireSnapshots --zip-file fileb://expire.zip
```

Local testing is also possible (careful, does expire!):

```
export AWS_REGION=eu-central-1
export VOLUMES=vol-12345
export MAX_AGE=7
```

Node:

```
node -e 'expire = require("./expire"); expire.handler(null, null, console.log);'
```

Python:

```
python -c 'import expire ; expire.lambda_handler(None, None)'
```
