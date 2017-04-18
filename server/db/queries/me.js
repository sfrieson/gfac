import UserType from '../types/UserType';
import User from '../models/User';

const me = {
  type: UserType,
  resolve({request}) {
    if (!request.user) return null;
    return User.find({where: {id: request.user.id}})
    .then(user => {
      return user && {
        id: user.id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname
      };
    }).catch(() => null);
  }
};

export default me;