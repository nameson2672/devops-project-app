pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'nameson/devops-project-app'
        DOCKERHUB_CREDENTIALS=credentials('dockerhub')
        DOCKER_CREDENTIALS_ID = 'dockerhub' // Use the ID from the credentials setup
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
        stage('Build') {

			steps {
				sh "docker build -t ${DOCKER_IMAGE}:${env.DOCKER_TAG} ."
			}
		}
        stage('Login') {

			steps {
				  script{
                   docker.withRegistry('', DOCKER_CREDENTIALS_ID) {
                        // Push the image to Docker Hub
                        docker.image("${DOCKER_IMAGE}:${env.DOCKER_TAG}").push()
                    }

			}
            }
            }
		}
    }

    post {
        always {
            // Clean up the local Docker environment
            steps {
				sh "docker rmi ${DOCKER_IMAGE}:${env.DOCKER_TAG} || true"
			}
        }
    }
    }
