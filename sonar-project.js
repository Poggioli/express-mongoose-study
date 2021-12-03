// eslint-disable-next-line import/no-extraneous-dependencies
const sonarqubeScanner = require('sonarqube-scanner')

sonarqubeScanner({
  serverUrl: 'http://localhost:9000',
  options: {
    'sonar.projectKey': 'express-mongoose-study',
    'sonar.sourceEncoding': 'UTF-8',
    'sonar.language': 'ts',
    'sonar.sources': 'src',
    'sonar.inclusions': '**',
    'sonar.test.inclusions': 'src/**/*.spec.ts,tests/**/*.spec.ts',
    'sonar.coverage.exclusions': 'src/application.ts,src/environment.ts,src/index.ts,src/core/infra/logger/logger.ts',
    'sonar.javascript.lcov.reportPaths': 'coverage/lcov.info',
    'sonar.testExecutionReportPaths': 'coverage/cobertura-coverage.xml',
    'sonar.login': 'a37fd771a64660d152123a4f7e8b517c2deee564'
  }
}, () => {})
