# get-actions

Lists/searches AWS actions used in AWS policies. It copies the selected one to the clipboard. 

```
npx get-aws-actions
```

Then enter `step func`. The output should be similar to:

```
states:CreateActivity (AWS Step Functions)
states:CreateStateMachine (AWS Step Functions)
states:DeleteActivity (AWS Step Functions)
states:DeleteStateMachine (AWS Step Functions)
states:DescribeActivity (AWS Step Functions)
states:DescribeExecution (AWS Step Functions)
states:DescribeStateMachine (AWS Step Functions)
states:DescribeStateMachineForExecution (AWS Step Functions)
states:GetActivityTask (AWS Step Functions)
states:GetExecutionHistory (AWS Step Functions)
...
```

# Data source

The database with the latest AWS managed policies is maintained by AWS at https://awspolicygen.s3.amazonaws.com/js/policies.js. This code is used by the [AWS Policy Generator tool](https://awspolicygen.s3.amazonaws.com/policygen.html).

> NOTE: If this link fails, the following backup is used: https://gist.githubusercontent.com/nicolasdao/95e6891bc4681b5424d47d6926c33fee/raw/cab16c30a1a6246396fedc339fcf33faccf6b232/actions.js

# License

BSD 3-Clause License