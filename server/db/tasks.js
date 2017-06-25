import seed from './seed'

const [,, task] = process.argv

if (/seed/.test(task)) seed('seed').then(() => process.exit())
if (/mock/.test(task)) seed('mocks').then(() => process.exit())
