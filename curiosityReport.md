# Wiley's Curiosity Report

The main form of my curiousity was through building my own **CI-CD pipeline, scripts, and cloudformation templates.**

I have mastered these skills and it has been so rewarding. Here is my work!

## CI-CD Pipeline

```yaml
name: Build, Push, and Deploy to AWS Infrastructure

on:
  push:
    branches:
      - master
      - 115-docker-web-hook
  workflow_dispatch:
    inputs:
      local_config:
        description: "Path to local config file to upload (e.g., infra/config.json)"
        required: false
        default: "infra/production-config.json"
        type: string

jobs:
  extract_sha:
    runs-on: ubuntu-latest
    outputs:
      short_sha: ${{ steps.extract_sha.outputs.short_sha }}
      extract_branch: ${{ steps.extract_branch.outputs.branch_name }}
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Extract branch name
        id: extract_branch
        run: |
          BRANCH_NAME=$(echo ${GITHUB_REF#refs/heads/} | tr '/' '-')
          echo "BRANCH_NAME=${BRANCH_NAME}" >> $GITHUB_ENV
          echo "branch_name=${BRANCH_NAME}" >> $GITHUB_OUTPUT

      - name: Extract short SHA
        id: extract_sha
        run: |
          SHORT_SHA=$(echo ${GITHUB_SHA} | cut -c1-5)
          echo "SHORT_SHA=${SHORT_SHA}" >> $GITHUB_ENV
          echo "short_sha=${SHORT_SHA}" >> $GITHUB_OUTPUT

  prepare_dependencies:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: "3.11"

      - name: Install Poetry
        run: |
          pip install poetry

      - name: Generate poetry.lock
        run: |
          poetry lock

      - name: Upload poetry.lock
        uses: actions/upload-artifact@v3
        with:
          name: poetry-lock
          path: poetry.lock
          retention-days: 1

  send_config:
    runs-on: ubuntu-latest
    environment: production
    needs: extract_sha
    outputs:
      config_s3_path: ${{ steps.set_outputs.outputs.config_s3_path }}
      secrets_s3_path: ${{ steps.set_outputs.outputs.secrets_s3_path }}
      arn_env: ${{ steps.set_outputs.outputs.arn_env }} # Consolidated ARN output
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ secrets.AWS_REGION }}

      - name: Create secrets file
        run: |
          cat > secrets.env << EOL
          OPENAI_API_KEY=${{ secrets.OPENAI_API_KEY }}
          DISCORD_TOKEN=${{ secrets.DISCORD_TOKEN }}
          AWS_ACCESS_KEY_ID=${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY=${{ secrets.AWS_SECRET_ACCESS_KEY }}
          AWS_REGION=${{ secrets.AWS_REGION }}
          DB_NAME=${{ secrets.DB_NAME }}
          DB_HOST=${{ secrets.DB_HOST }}
          DB_PORT=${{ secrets.DB_PORT }}
          DB_USER=${{ secrets.DB_USER }}
          DB_PASSWORD=${{ secrets.DB_PASSWORD }}
          CONFIG_FILE_S3_PATH=s3://rubber-duck-config/production/config-${{ needs.extract_sha.outputs.short_sha }}.json
          ENV_FILE_S3_PATH=s3://rubber-duck-config/production/secrets-${{ needs.extract_sha.outputs.short_sha }}.env
          ENVIRONMENT=production
          EOL

      - name: Upload config and secrets to S3
        id: set_outputs
        run: |
          CONFIG_S3_PATH="s3://rubber-duck-config/production/config-${{ needs.extract_sha.outputs.short_sha }}.json"
          SECRETS_S3_PATH="s3://rubber-duck-config/production/secrets-${{ needs.extract_sha.outputs.short_sha }}.env"
          CONFIG_S3_ARN="arn:aws:s3:::rubber-duck-config/production/config-${{ needs.extract_sha.outputs.short_sha }}.json"
          SECRETS_S3_ARN="arn:aws:s3:::rubber-duck-config/production/secrets-${{ needs.extract_sha.outputs.short_sha }}.env"

          # Debugging outputs
          echo "Config file path: $CONFIG_S3_PATH"
          echo "Secrets file path: $SECRETS_S3_PATH"

          # Upload files
          aws s3 cp "${{ inputs.local_config || 'infra/production-config.json' }}" "$CONFIG_S3_PATH"
          aws s3 cp secrets.env "$SECRETS_S3_PATH" --no-progress

          # Set outputs for use in other jobs
          echo "config_s3_path=$CONFIG_S3_PATH" >> $GITHUB_OUTPUT
          echo "secrets_s3_path=$SECRETS_S3_PATH" >> $GITHUB_OUTPUT
          echo "arn_env=$SECRETS_S3_ARN" >> $GITHUB_OUTPUT

          echo "Uploaded config to: $CONFIG_S3_PATH"
          echo "Uploaded secrets to: $SECRETS_S3_PATH"

      - name: Upload Arn
        id: arn_env
        run: |
          CONFIG_S3_ARN="arn:aws:s3:::rubber-duck-config/production/config-${{ needs.extract_sha.outputs.short_sha }}.json"
          SECRETS_S3_ARN="arn:aws:s3:::rubber-duck-config/production/secrets-${{ needs.extract_sha.outputs.short_sha }}.env"
          echo "secrets_s3_path=$SECRETS_S3_ARN" >> $GITHUB_OUTPUT

  build_and_push:
    runs-on: ubuntu-latest
    environment: production
    needs: [extract_sha, prepare_dependencies]
    outputs:
      docker_image_tag: ${{ steps.set_outputs.outputs.docker_image_tag }}
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Download poetry.lock
        uses: actions/download-artifact@v3
        with:
          name: poetry-lock
          path: .

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Run Docker build script
        run: bash ./infra/build_docker.sh

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ secrets.AWS_REGION }}

      - name: Log in to Amazon ECR
        run: |
          aws ecr get-login-password --region ${{ secrets.AWS_REGION }} | \
          docker login --username AWS --password-stdin 844825014198.dkr.ecr.${{ secrets.AWS_REGION }}.amazonaws.com/beanlab/rubber-duck

      - name: Tag and Push Docker Image
        id: set_outputs # Add this line
        run: |
          IMAGE_TAG="${{ needs.extract_sha.outputs.branch_name }}${{ needs.extract_sha.outputs.short_sha }}"
          echo "Tagging image as: $IMAGE_TAG"

          docker tag 844825014198.dkr.ecr.${{ secrets.AWS_REGION }}.amazonaws.com/beanlab/rubber-duck:latest \
            844825014198.dkr.ecr.${{ secrets.AWS_REGION }}.amazonaws.com/beanlab/rubber-duck:$IMAGE_TAG

          docker push 844825014198.dkr.ecr.${{ secrets.AWS_REGION }}.amazonaws.com/beanlab/rubber-duck:$IMAGE_TAG

          # ✅ Set the output for use in other jobs
          echo "docker_image_tag=$IMAGE_TAG" >> $GITHUB_OUTPUT

      - name: Complete Docker push
        run: echo "Docker image pushed to ECR with tag ${BRANCH_NAME}-${{ needs.extract_sha.outputs.short_sha }}!"

  deploy_to_cloudformation:
    needs: [build_and_push, send_config]
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ secrets.AWS_REGION }}

      - name: Deploy ECS Infrastructure with CloudFormation
        id: deploy
        run: |
          IMAGE_TAG="${{needs.build_and_push.outputs.docker_image_tag}}"  # This is the docker image tag from build and push
          echo "Deploying ECS with image tag: ${IMAGE_TAG}"

          # First, force update the ECS service to ensure it can be updated
          aws ecs update-service \
            --cluster DuckCluster-rubber-duck-production \
            --service rubber-duck-production-Service \
            --force-new-deployment \
            --region ${{ secrets.AWS_REGION }} || true

          # Then deploy the CloudFormation stack
          aws cloudformation deploy \
            --stack-name rubber-duck-production \
            --template-file infra/ecs-infra.yml \
            --capabilities CAPABILITY_NAMED_IAM \
            --no-fail-on-empty-changeset \
            --parameter-overrides \
            Environment=production \
            ClusterName=DuckCluster-rubber-duck-production \
            TaskDefinitionFamily=rubber-duck-production \
            ContainerName=duck-container-production \
            "ImageURI=844825014198.dkr.ecr.${{ secrets.AWS_REGION }}.amazonaws.com/beanlab/rubber-duck:${IMAGE_TAG}" \
            "VpcId=${{ secrets.VPC_ID }}" \
            "SubnetIds=${{ secrets.SUBNET_IDS }}" \
            "SecurityGroupId=${{ secrets.SECURITY_GROUP_ID }}" \
            "ExecutionRoleArn=${{secrets.EXECUTION_ROLE}}" \
            "TaskRoleArn=${{secrets.EXECUTION_ROLE}}" \
            "Cpu=1024" \
            "Memory=2048" \
            "EnvFileS3Path=${{ needs.send_config.outputs.arn_env }}"

          # Wait for the ECS service to stabilize
          echo "Waiting for ECS service to stabilize..."
          aws ecs wait services-stable \
            --cluster DuckCluster-rubber-duck-production \
            --services rubber-duck-production-Service \
            --region ${{ secrets.AWS_REGION }}
```

## Cloud Formation Template

```yaml
AWSTemplateFormatVersion: "2010-09-09"
Parameters:
  Environment:
    Type: String
    Default: "production"
  ClusterName:
    Type: String
  TaskDefinitionFamily:
    Type: String
  ContainerName:
    Type: String
  ImageURI:
    Type: String
  Cpu:
    Type: String
    Default: "1024"
  Memory:
    Type: String
    Default: "2048"
  VpcId:
    Type: AWS::EC2::VPC::Id
    Description: VPC ID where the ECS tasks will run
  SubnetIds:
    Type: List<AWS::EC2::Subnet::Id>
    Description: List of subnet IDs where the ECS tasks will run
  SecurityGroupId:
    Type: AWS::EC2::SecurityGroup::Id
    Description: Security group ID for the ECS tasks
  ExecutionRoleArn:
    Type: String
    Description: ARN of the existing ECS task execution role
  TaskRoleArn:
    Type: String
    Description: ARN of the existing ECS task role
  EnvFileS3Path:
    Type: String
    Description: S3 path for the environment file

Resources:
  # ECS Resources
  ECSCluster:
    Type: AWS::ECS::Cluster
    Properties:
      ClusterName: !Ref ClusterName

  CloudWatchLogGroup:
    Type: AWS::Logs::LogGroup
    Properties:
      LogGroupName: !Sub /ecs/${TaskDefinitionFamily}
      RetentionInDays: 30

  FargateTaskDefinition:
    Type: AWS::ECS::TaskDefinition
    Properties:
      Family: !Ref TaskDefinitionFamily
      ExecutionRoleArn: !Ref ExecutionRoleArn
      TaskRoleArn: !Ref TaskRoleArn
      RequiresCompatibilities:
        - FARGATE
      Cpu: !Ref Cpu
      Memory: !Ref Memory
      NetworkMode: awsvpc
      ContainerDefinitions:
        - Name: !Ref ContainerName
          Image: !Ref ImageURI
          Essential: true
          Cpu: 0
          Memory: 2048
          PortMappings: []
          Environment: []
          EnvironmentFiles:
            - Value: !Ref EnvFileS3Path
              Type: s3
          MountPoints: []
          VolumesFrom: []
          LogConfiguration:
            LogDriver: awslogs
            Options:
              awslogs-group: !Ref CloudWatchLogGroup
              awslogs-region: !Ref AWS::Region
              awslogs-stream-prefix: ecs
              mode: non-blocking
              awslogs-create-group: "true"
              max-buffer-size: "25m"
          SystemControls: []
      Volumes: []
      EphemeralStorage:
        SizeInGiB: 21
      RuntimePlatform:
        CpuArchitecture: X86_64
        OperatingSystemFamily: LINUX

  ECSService:
    Type: AWS::ECS::Service
    Properties:
      ServiceName: !Sub ${AWS::StackName}-Service
      Cluster: !Ref ECSCluster
      TaskDefinition: !Ref FargateTaskDefinition
      DesiredCount: 1
      LaunchType: FARGATE
      NetworkConfiguration:
        AwsvpcConfiguration:
          Subnets: !Ref SubnetIds
          SecurityGroups:
            - !Ref SecurityGroupId
          AssignPublicIp: ENABLED

Outputs:
  ClusterName:
    Description: The name of the ECS cluster
    Value: !Ref ECSCluster
    Export:
      Name: !Sub ${AWS::StackName}-ClusterName

  ServiceName:
    Description: The name of the ECS service
    Value: !Ref ECSService
    Export:
      Name: !Sub ${AWS::StackName}-ServiceName
```

## Docker Build Script

```bash
#!/bin/bash

# Change to the parent directory
cd "$(dirname "$0")/.."

# Fetch the Git commit hash for the tag
IMAGE_NAME="rubber-duck"
IMAGE_TAG=${GITHUB_SHA:-$(git rev-parse HEAD)} # Use GitHub SHA if available, otherwise git hash

ECR_REPO="844825014198.dkr.ecr.us-west-2.amazonaws.com/beanlab/rubber-duck"

echo "Building Docker image for ${IMAGE_NAME}:${IMAGE_TAG}..."
echo "Current directory: $(pwd)"

# Enable Docker BuildKit for better performance
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

set -e

# Build the Docker image with optimized caching
docker buildx build \
    --platform linux/amd64 \
    --progress=plain \
    --cache-from type=registry,ref=${ECR_REPO}:latest \
    --load \
    -t ${IMAGE_NAME}:latest \
    -f - . <<EOF
FROM python:3.11.9-slim as builder

# Install poetry
RUN pip install poetry

# Copy only the files needed for dependency installation
COPY pyproject.toml poetry.lock ./

# Install dependencies with caching
RUN --mount=type=cache,target=/root/.cache/pip \
    poetry config virtualenvs.create false \
    && poetry install --no-interaction --no-ansi --no-root

# Final stage
FROM python:3.11.9-slim

LABEL authors="Wiley Welch, Bryce Martin, Gordon Bean"

# Copy installed dependencies from builder
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Copy application code
COPY rubber_duck /rubber_duck
COPY prompts /prompts

WORKDIR /rubber_duck
EXPOSE 8080
WORKDIR /
CMD ["python", "/rubber_duck/discord_bot.py", "--config", "/config.json", "--log-console"]
EOF

# Tag the image for ECR with both latest and commit SHA
docker tag ${IMAGE_NAME}:latest ${ECR_REPO}:${IMAGE_TAG}
docker tag ${IMAGE_NAME}:latest ${ECR_REPO}:latest

# Conditional logic for testing or production
if [[ "${GITHUB_REF:-$(git rev-parse --abbrev-ref HEAD)}" == "refs/heads/master" ]]; then
    # Production tag
    docker tag ${IMAGE_NAME}:latest ${ECR_REPO}:production-latest
    echo "Tagging as production-latest"
else
    # Test tag
    docker tag ${IMAGE_NAME}:latest ${ECR_REPO}:test-latest
    echo "Tagging as test-latest"
fi
```
