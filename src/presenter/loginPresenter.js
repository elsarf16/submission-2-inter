// src/scripts/presenters/loginPresenter.js
import API from '../scripts/data/api.js';
import Auth from '../scripts/utils/auth.js';

const loginPresenter = {
  async login(email, password) {
    const response = await API.login(email, password);

    if (!response.error && response.loginResult) {
      const { token, name, userId } = response.loginResult;
      Auth.setToken(token);
      Auth.saveUser(name);
    }

    return response;
  }
};

export default loginPresenter;
