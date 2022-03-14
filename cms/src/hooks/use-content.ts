import {useContext, useState} from 'react';
import axios from 'axios';
import {API_URL} from '../config';
import {getHeaderOptions} from '../lib/request-helper';
import {ShowLoaderContext} from './show-loader-context';

export default function useContent() {
  const {setShowLoader} = useContext(ShowLoaderContext);

  const createContent = async (data: any, slug: string) => {
    setShowLoader(true);
    try {
      const res = await axios.post(`${API_URL}/content/${slug}`, data, getHeaderOptions());
      setShowLoader(false);
      return res.data;
    } catch (err: any) {
      console.log(err);
      setShowLoader(false);
      throw err;
    }
  };

  return {
    createContent
  }
}
