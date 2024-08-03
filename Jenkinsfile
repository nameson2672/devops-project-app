pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'nameson/devops-project-app'
        DOCKER_CREDENTIALS_ID = 'dockerhub'

    }

    stages {
        stage('Checkout') {
            steps {
                // Clone the repository containing the Dockerfile
                git branch: "${env.BRANCH_NAME}", url: 'https://github.com/nameson2672/devops-project-app'
            }
        }

        stage('Set Docker Tag') {
            steps {
                script {
                    // Determine the branch prefix
                    def branchPrefix = ''
                    
                    if (env.BRANCH_NAME == 'dev') {
                        branchPrefix = 'dev'
                    } else if (env.BRANCH_NAME == 'staging') {
                        branchPrefix = 'stage'
                    } else if (env.BRANCH_NAME == 'production') {
                        branchPrefix = 'prod'
                    } else {
                        branchPrefix = 'build'
                    }

                    // Construct the Docker tag using the branch prefix and build number
                    def newVersion = "${branchPrefix}-${env.BUILD_NUMBER}"

                    // Set the Docker tag as an environment variable
                    env.DOCKER_TAG = newVersion
                }
            }
        }
        stages {
        stage('Build Docker Image') {
            steps {
                script {
                    // Construct the Docker image tag
                    def imageTag = "${DOCKER_IMAGE}:${DOCKER_TAG}"
                    
                    // Build the Docker image
                    sh """
                    docker build -t ${imageTag} .
                    """
                }
            }
        }

        stage('Login to Docker Hub') {
            steps {
                script {
                    // Login to Docker Hub
                    sh """
                    echo \$DOCKER_PASSWORD | docker login -u \$DOCKER_USERNAME --password-stdin
                    """
                }
            }
        }
        
        stage('Push Docker Image') {
            steps {
                script {
                    // Push the Docker image to Docker Hub
                    sh """
                    docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${DOCKER_IMAGE}:${DOCKER_TAG}
                    docker push ${DOCKER_IMAGE}:${DOCKER_TAG}
                    """
                }
            }
        }

        post {
        always {
            script {
                // Delete the Docker image
                sh """
                docker rmi ${DOCKER_IMAGE}:${DOCKER_TAG} || true
                """
            }
        }
        }
    }

    post {
        always {
            // Clean up the local Docker environment
            script {
                def image = docker.image("${DOCKER_IMAGE}:${DOCKER_TAG}")
                image.remove()
            }
        }
    }
}
}
