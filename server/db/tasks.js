import seed from './seed'

const [,, task] = process.argv

if (task === 'seed') seed('seed').then(() => process.exit())
if (task === 'mocks') seed('mocks').then(() => process.exit())
