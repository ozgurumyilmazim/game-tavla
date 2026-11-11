// Starting outline for the CI pipeline. Adjust agent, node version and
// credentials to your Jenkins setup. Keep real work in the pnpm scripts so a
// developer can run the same commands locally.

pipeline {
  agent {
    docker {
      image 'node:lts'
      args '-u root:root'
    }
  }

  options {
    timestamps()
    timeout(time: 30, unit: 'MINUTES')
    disableConcurrentBuilds(abortPrevious: true)
  }

  stages {
    stage('Install') {
      steps {
        sh 'corepack enable'
        sh 'pnpm install --frozen-lockfile'
      }
    }

    stage('Lint') {
      steps {
        sh 'pnpm lint'
      }
    }

    stage('Type check') {
      steps {
        sh 'pnpm typecheck'
      }
    }

    stage('Test') {
      steps {
        sh 'pnpm test'
      }
    }

    stage('Build') {
      steps {
        sh 'pnpm build'
      }
    }

    // Enable later, once Playwright browsers are available on the agent.
    // stage('End-to-end') {
    //   steps {
    //     sh 'pnpm test:e2e'
    //   }
    // }
  }

  post {
    always {
      cleanWs()
    }
  }
}
