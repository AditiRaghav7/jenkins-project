pipeline {
    agent any

    environment {
        AWS_REGION = 'eu-north-1'
        ECR_REGISTRY = '296062592493.dkr.ecr.eu-north-1.amazonaws.com'
        FRONTEND_IMAGE = "${ECR_REGISTRY}/ema-frontend:latest"
        BACKEND_IMAGE = "${ECR_REGISTRY}/ema-backend:latest"
        DB_IMAGE = "${ECR_REGISTRY}/ema-db:latest"
    }

    stages {
        stage('Checkout Code') {
            steps {
                script {
                    git url: 'https://github.com/AditiRaghav7/jenkins-project.git', branch: 'main'
                }
            }
        }

        stage('Login to ECR') {
            steps {
                script {
                    sh """
                    aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REGISTRY
                    """
                }
            }
        }

        stage('Ensure ECR Repositories Exist') {
            steps {
                script {
                    sh """
                    aws ecr describe-repositories --repository-names ema-frontend || aws ecr create-repository --repository-name ema-frontend
                    aws ecr describe-repositories --repository-names ema-backend || aws ecr create-repository --repository-name ema-backend
                    aws ecr describe-repositories --repository-names ema-db || aws ecr create-repository --repository-name ema-db
                    """
                }
            }
        }

        stage('Delete Old Images from ECR') {
            steps {
                script {
                    sh """
                    aws ecr batch-delete-image --repository-name ema-frontend --image-ids imageTag=latest || echo "No old frontend image"
                    aws ecr batch-delete-image --repository-name ema-backend --image-ids imageTag=latest || echo "No old backend image"
                    aws ecr batch-delete-image --repository-name ema-db --image-ids imageTag=latest || echo "No old db image"
                    """
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
                            docker buildx create --use || true
                            docker build -t ema-frontend .
                            docker tag ema-frontend:latest $FRONTEND_IMAGE
                            docker push $FRONTEND_IMAGE
                            """
                        }
                    }
                }
                stage('Build Backend') {
                    steps {
                        script {
                            sh """
                            cd backend/
                            docker buildx create --use || true
                            docker build -t ema-backend .
                            docker tag ema-backend:latest $BACKEND_IMAGE
                            docker push $BACKEND_IMAGE
                            """
                        }
                    }
                }
                stage('Build Database') {
                    steps {
                        script {
                            sh """
                            cd mysql/
                            docker buildx create --use || true
                            docker build -t ema-db .
                            docker tag ema-db:latest $DB_IMAGE
                            docker push $DB_IMAGE
                            """
                        }
                    }
                }
            }
        }
    }
}
