node {
  git 'git@github.com:adamrbennett/menu.git'

  def img
  stage('Build') {
    img = docker.build("pointsource/menu:${env.BUILD_NUMBER}")
  }

  docker.withRegistry('https://index.docker.io/v1/', 'docker-registry-credentials') {
    stage('Publish') {
      img.push()
      img.push('latest')
    }
  }

  stage('Deploy') {
    withEnv(['DOCKER_HOST=tcp://mgr1.node.consul:2375']) {
      sh "docker service create --with-registry-auth --name menu-${env.BUILD_NUMBER} --network sfi -e SERVICE_NAME=menu -e SERVICE_TAGS=${env.BUILD_NUMBER} -e KV_ROOT=http://172.17.0.1:8500/v1/kv pointsource/menu:${env.BUILD_NUMBER}"
    }
  }
}
