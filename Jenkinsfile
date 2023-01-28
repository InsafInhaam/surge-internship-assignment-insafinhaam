pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                dir('client') {
                    sh 'npm install'
                }
                dir('server') {
                    sh 'npm install'
                }
            }
        }
        stage('Test') {
            steps {
                dir('client') {
                    sh 'npm test'
                }
                dir('server') {
                    sh 'npm test'
                }
            }
        }
        stage('Deploy') {
            steps {
                dir('client') {
                    sh 'npm run build'
                }
                dir('server') {
                    sh 'npm start'
                }
            }
        }
    }
}
