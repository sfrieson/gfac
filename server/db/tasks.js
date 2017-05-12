import seed from './seed'

const [,, task] = process.argv

if (task === 'seed') seed().then(() => process.exit())
