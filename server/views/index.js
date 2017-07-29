import login from './login'
import ssr from './ssr'
const t = {
  login,
  ssr
}
export default function (template, opts) {
  return t[template](opts)
}
