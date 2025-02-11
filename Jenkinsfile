pipeline {
    agent any

    environment {
        AWS_REGION = 'eu-north-1'
        ECR_REGISTRY = '296062592493.dkr.ecr.eu-north-1.amazonaws.com'
        IMAGE_NAME = 'frontend'
        IMAGE2 = 'backend'
        IMAGE3 = 'mysql'
        TAG = 'latest'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/AditiRaghav7/jenkins-project.git'
            }
        }

        stage('Login to AWS ECR') {
            steps {
                script {
                    sh "aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REGISTRY"
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    sh "docker build -t $IMAGE_NAME -f FrontEnd/Dockerfile ."
                    sh "docker build -t $IMAGE2 -f backend/Dockerfile ."
                    sh "docker build -t $IMAGE3 -f mysql/Dockerfile ."
                }
            }
        }

        stage('Tag and Push Docker Images to AWS ECR') {
            steps {
                script {
                    sh "docker tag $IMAGE_NAME:latest $ECR_REGISTRY/$IMAGE_NAME:$TAG"
                    sh "docker tag $IMAGE2:latest $ECR_REGISTRY/$IMAGE2:$TAG"
                    sh "docker tag $IMAGE3:latest $ECR_REGISTRY/$IMAGE3:$TAG"
                    
                    sh "docker push $ECR_REGISTRY/$IMAGE_NAME:$TAG"
                    sh "docker push $ECR_REGISTRY/$IMAGE2:$TAG"
                    sh "docker push $ECR_REGISTRY/$IMAGE3:$TAG"
                }
            }
        }

        stage('Create and Run Docker Containers') {
            steps {
                script {
                    sh 'docker network create custom_bridge1 || true'
                    sh "docker run -d --name frontend1 -p 5000:5000 --network=custom_bridge1 $ECR_REGISTRY/$IMAGE_NAME:$TAG"
                    sh "docker run -d --name backend1 -p 8000:8000 --network=custom_bridge1 $ECR_REGISTRY/$IMAGE2:$TAG"
                    sh "docker run -d --name mysql1 -p 3306:3306 --network=custom_bridge1 $ECR_REGISTRY/$IMAGE3:$TAG"
                }
            }
        }
    }
}
