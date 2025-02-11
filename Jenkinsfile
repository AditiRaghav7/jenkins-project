pipeline {
    agent any

    environment {
        AWS_REGION = 'eu-north-1'
        ECR_REGISTRY = '296062592493.dkr.ecr.eu-north-1.amazonaws.com'
                ECR_REPOSITORY = 'employee-ecr-jenkins'
        //FRONTEND_IMAGE = "${ECR_REGISTRY}/ema-frontend:latest"
        //BACKEND_IMAGE = "${ECR_REGISTRY}/ema-backend:latest"
        //DB_IMAGE = "${ECR_REGISTRY}/ema-db:latest"

        ECR_REPOSITORY = 'employee-ecr-jenkins'
        FRONTEND_IMAGE = 'my-frontend-image'
        BACKEND_IMAGE = 'my-backend-image'
        MYSQL_IMAGE = 'my-mysql-image'

    }

    stages {
        stage('Checkout Code') {
            steps {
                script {
                    git  url: 'https://github.com/AditiRaghav7/jenkins-project.git', branch: 'main'
                }
            }
        }

        stage('Authenticate with AWS ECR') {
            steps {
                script {
                    sh 'aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REGISTRY'
                }
            }
        }


        stage('Delete Old Images from ECR') {
            steps {
                script {
                    sh "aws ecr batch-delete-image --repository-name ema-frontend --image-ids imageTag=latest || true"
                    sh "aws ecr batch-delete-image --repository-name ema-backend --image-ids imageTag=latest || true"
                    sh "aws ecr batch-delete-image --repository-name ema-db --image-ids imageTag=latest || true"
                }
            }
        }

        stage('Build and Push New Images') {
            parallel {
                stage('Build Frontend') {
                    steps {
                        script {
                            sh """
                            cd frontend/
                           sh "docker build -t ${FRONTEND_IMAGE} "
 sh "docker tag ${FRONTEND_IMAGE}:latest ${ECR_REGISTRY}/${ECR_REPOSITORY}:frontend-latest"   
                    sh "docker push ${ECR_REGISTRY}/${ECR_REPOSITORY}:frontend-latest"
  sh "docker run -d --name my-frontend-container -p 5000:5000 ${ECR_REGISTRY}/${ECR_REPOSITORY}:frontend-latest"

                            cd ..
                            """
                        }
                    }
                }
                stage('Build Backend') {
                    steps {
                        script {
                            sh """
                            cd backend/
                           sh "docker build -t ${BACKEND_IMAGE}"
                            sh "docker tag ${BACKEND_IMAGE}:latest ${ECR_REGISTRY}/${ECR_REPOSITORY}:backend-latest"
                    sh "docker push ${ECR_REGISTRY}/${ECR_REPOSITORY}:backend-latest"
                     sh "docker run -d --name my-backend-container -p 8000:8000 ${ECR_REGISTRY}/${ECR_REPOSITORY}:backend-latest"
                    
                            cd ..
                            """
                        }
                    }
                }
                stage('Build Database') {
                    steps {
                        script {
                            sh """
                            cd mysql/
                    sh "docker build -t ${MYSQL_IMAGE}"
                    sh "docker tag ${MYSQL_IMAGE}:latest ${ECR_REGISTRY}/${ECR_REPOSITORY}:mysql-latest"
                    sh "docker push ${ECR_REGISTRY}/${ECR_REPOSITORY}:mysql-latest"
                                        sh "docker run -d --name my-mysql-container -p 3306:3306 ${ECR_REGISTRY}/${ECR_REPOSITORY}:mysql-latest"
                            cd ..
                            """
                        }
                    }
                }
            }
        }
    }
}
