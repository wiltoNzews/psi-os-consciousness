module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-max-line-length': [2, 'always', 100],
    'subject-case': [
      2,
      'never',
      ['start-case', 'pascal-case', 'upper-case']
    ],
    'scope-enum': [
      2,
      'always',
      [
        'core',
        'router',
        'qctf',
        'api',
        'websocket',
        'gauge',
        'recalibration',
        'dashboard',
        'docs',
        'deps',
        'ci',
        'test',
        'kaizen',
        'longevity'
      ]
    ]
  }
};