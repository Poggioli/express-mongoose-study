// eslint-disable-next-line import/no-extraneous-dependencies
const sonarqubeScanner = require('sonarqube-scanner')

sonarqubeScanner({
  serverUrl: 'http://localhost:9000',
  options: {
    'sonar.projectKey': 'expressApp',
    'sonar.sourceEncoding': 'UTF-8',
    'sonar.language': 'ts',
    'sonar.sources': 'src',
    'sonar.inclusions': '**',
    'sonar.test.inclusions': 'src/**/*.spec.ts,tests/**/*.spec.ts',
    'sonar.coverage.exclusions': 'src/application.ts,src/environment.ts,src/index.ts,src/core/infra/logger/logger.ts',
    'sonar.javascript.lcov.reportPaths': 'coverage/lcov.info',
    'sonar.testExecutionReportPaths': 'coverage/cobertura-coverage.xml',
    'sonar.login': 'fa12185a6adce43368276abb366f096a1c69f66d'
  }
}, () => {})
