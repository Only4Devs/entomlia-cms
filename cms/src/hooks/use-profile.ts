import {useContext, useState} from 'react';
import axios from 'axios';
import {API_URL} from '../config';
import {getHeaderOptions} from '../lib/request-helper';
import {ShowLoaderContext} from './show-loader-context';

export default function useProfile() {
  const {setShowLoader} = useContext(ShowLoaderContext);

  const changeLanguage = async (lang: string) => {
    setShowLoader(true);
    const result = await axios.put(`${API_URL}/profile`, {appLanguage: lang}, getHeaderOptions())
      .then(res => {
        setShowLoader(false);
        return res.data;
      }).catch(err => {
        setShowLoader(false);
        console.log(err);
      });

    return result;
  };

  return {
    changeLanguage
  }
}
