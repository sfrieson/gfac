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
  }
};

export default User;