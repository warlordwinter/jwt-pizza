cd "C:\Users\aonst\Downloads"
aws cloudformation delete-stack --stack-name jwtpizzaservice --region us-east-1
aws rds stop-db-instance --db-instance-identifier jwt-pizza-service-db --region us-east-1