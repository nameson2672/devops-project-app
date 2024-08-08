pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'nameson/devops-project-app'
        DOCKERHUB_CREDENTIALS=credentials('dockerhub')
        DOCKER_CREDENTIALS_ID = 'dockerhub' // Use the ID from the credentials setup
         SLACK_CREDENTIALS_ID = 'slack_app_secret' // Use the ID from the credentials setup
        SLACK_CHANNEL = '#app_build_info' // Replace with your Slack channel
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
                    } else if (env.BRANCH_NAME == 'stage') {
                        branchPrefix = 'stage'
                    } else if (env.BRANCH_NAME == 'main') {
                        branchPrefix = 'prod'
                    } else {
                        branchPrefix = 'build'
                    }

                    // Construct the Docker tag using the branch prefix and build number
                    def newVersion = "${env.BUILD_NUMBER}-${branchPrefix}"

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

    post {
        always {
            script {
                def slackMessage = """
                *Build Status:* ${currentBuild.currentResult}
                *Image:* ${DOCKER_IMAGE}:${env.DOCKER_TAG}
                *Branch:* ${env.BRANCH_NAME}
                *Committer:* ${gitCommitterName()}
                *Build URL:* ${env.BUILD_URL}
                """
                
                if (currentBuild.result == 'SUCCESS') {
                    slackSend(channel: SLACK_CHANNEL, color: 'good', message: slackMessage)
                } else if (currentBuild.result == 'FAILURE') {
                    slackSend(channel: SLACK_CHANNEL, color: 'danger', message: slackMessage)
                }
            }
        }
    }
}

// Helper function to get the committer name from the Git repository
def gitCommitterName() {
    def committerName = sh(script: 'git log -1 --pretty=format:"%cn"', returnStdout: true).trim()
    return committerName
}