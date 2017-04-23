import ajaxDispatch from '../utils/ajax-dispatch';
import api from '../utils/api';

const User = {
  getMe: () => {

    ajaxDispatch('ME',
      api(`{
          getMe {
            email
            firstname
            lastname
            phone
            phoneType
            role
          }
        }`
      ).then(({ data }) => data.getMe)
    )
  },
  updateMe: (updates) => {
    ajaxDispatch('UPDATE_ME',
      api(`mutation {
        updateMe(updates: ${objToGQLQueryString(updates)}) {
          firstname
          lastname
        }
      }`).then(({ data }) => data.updateMe)
    )
  }
};

export default User;


function objToGQLQueryString (obj = {}) {
  return '{' +
    Object.keys(obj)
    .reduce((query, key) => {
      return query + `,${key}:"${obj[key]}"`
    }, '')
    .slice(1) +
    '}';
}