# Curiosity Report

## Automating Deployment of Pizza Service to AWS

For my curiosity project, I wanted to figure out how to automatically deploy the cloudformation stack to AWS with the push of a button (or running of a script) to save time.
Creating the stack manually only takes a few minutes, but it gets repetitive having to do it every time I need to use the application.
<br>

### Building the Script

I did some basic research on how to deploy cloudformation stacks through AWS CLI, and got to work. After some initial issues (I forgot to capitalize the s in SubnetIDs) and setting up a user with the
requisite permissions, I settled on this command. I then created a script called deployCloudFormation.sh, and used a cd command to change to the right directory and then run the below command.

Here is the command I used:

```
aws cloudformation deploy --template-file jwt-pizza-service.json --stack-name jwtpizzaservice --region us-east-1 --parameter-overrides CertificateArn=REDACTED VpcID=REDACTED SubnetIDs=REDACTED SecurityGroupIDs=REDACTED TaskVersion=REDACTED
```

I also added the script to `.gitignore` because I decided I didn't want to publish my AWS info on github.

And because I don't feel like manually starting and stopping the db, I figured out how to do that with a command as well:

`aws rds start-db-instance --db-instance-identifier jwt-pizza-service-db --region us-east-1`

### Building Tear-Down Script

This was pretty simple, since the delete commands don't require much info other than the name of what you need to delete. Here is the script, which I can share because it doesn't contain any confidential AWS stuff:

```
cd C:\Users\aonst\Downloads
aws cloudformation delete-stack --stack-name jwtpizzaservice --region us-east-1
aws rds stop-db-instance --db-instance-identifier jwt-pizza-service-db --region us-east-1
```
