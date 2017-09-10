import { dispatch } from '../store'

export default function reduxAjax (SUBJECT, ajax) {
  const PREFIX = `FETCH_${SUBJECT}`
  dispatch({type: `${PREFIX}_START`})
  ajax.then(res => dispatch({type: `${PREFIX}_END`, res}))
  ajax.catch(err => dispatch({type: `${PREFIX}_ERR`, err}))
}
