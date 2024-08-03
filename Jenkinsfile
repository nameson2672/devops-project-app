pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'nameson/devops-project-app'

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

        stage('Build Docker Image') {
            steps {
                script {
                    // Build the Docker image with the new tag
                    def image = docker.build("${DOCKER_IMAGE}")
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    docker.withRegistry('https://registry.hub.docker.com', 'dockerhub') {
                        // Push the Docker image to Docker Hub
                        def image = docker.image("${env.DOCKER_TAG}")
                        image.push()
                    }
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
