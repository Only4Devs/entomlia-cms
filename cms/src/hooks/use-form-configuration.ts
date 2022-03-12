import {useContext} from 'react';
import axios from 'axios';
import {API_URL} from '../config';
import {getHeaderOptions} from '../lib/request-helper';
import {ShowLoaderContext} from './show-loader-context';

export interface FormConfiguration {
  id?: number;
  collectionTypeId?: number;
  content: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function useFormConfiguration() {
  const {setShowLoader} = useContext(ShowLoaderContext);

  const getFormConfiguration = async (slug: string) => {
    setShowLoader(true);
    try {
      const res = await axios.get(`${API_URL}/form-configuration/${slug}`, getHeaderOptions());
      setShowLoader(false);
      return res.data;
    } catch (err: any) {
      console.log(err);
      setShowLoader(false);
      throw err;
    }
  };

  const updateFormConfiguration = async (id: number, data: any) => {
    setShowLoader(true);
    try {
      const res = await axios.put(`${API_URL}/form-configuration/${id}`, data, getHeaderOptions());
      setShowLoader(false);
      return res.data;
    } catch (err: any) {
      console.log(err);
      setShowLoader(false);
      throw err;
    }
  };

  return {
    getFormConfiguration,
    updateFormConfiguration
  }
}
