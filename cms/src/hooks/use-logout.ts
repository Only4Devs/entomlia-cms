import axios from 'axios';
import {API_URL} from '../config';
import useAuth from "./use-auth";
import {TOKEN_KEY} from '../lib/request-helper';

export default function useLogout() {
  const logoutUser = async () => {
    try {
      const res = await axios({
        method: 'POST',
        url: `${API_URL}/auth/logout`,
      });
      localStorage.removeItem(TOKEN_KEY);
      return true;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  return {
    logoutUser
  }

}
