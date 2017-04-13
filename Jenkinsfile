node {
  git 'git@github.com:adamrbennett/menu.git'

  def img
  stage('Build') {
    img = docker.build("814258403605.dkr.ecr.us-east-1.amazonaws.com/pointsource/menu:${env.BUILD_NUMBER}")
  }

  docker.withRegistry('http://814258403605.dkr.ecr.us-east-1.amazonaws.com/') {
    stage('Publish') {
      img.push()
      img.push('latest')
    }
  }

  stage('Deploy') {
    withEnv(['DOCKER_HOST=tcp://mgr1.node.consul:2375']) {
      sh "docker service create --with-registry-auth --name menu-${env.BUILD_NUMBER} --network sfi -e SERVICE_NAME=menu -e SERVICE_TAGS=${env.BUILD_NUMBER} -e KV_ROOT=http://172.17.0.1:8500/v1/kv 814258403605.dkr.ecr.us-east-1.amazonaws.com/pointsource/menu:${env.BUILD_NUMBER}"
    }
  }
}
