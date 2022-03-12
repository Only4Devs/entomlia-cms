import {useContext, useState} from 'react';
import axios from 'axios';
import {API_URL} from '../config';
import {getHeaderOptions} from '../lib/request-helper';
import {ShowLoaderContext} from './show-loader-context';

export default function useCollectionType() {
  const {setShowLoader} = useContext(ShowLoaderContext);
  const [collectionTypes, setCollectionTypes] = useState([]);

  const getCollectionTypes = async () => {
    setShowLoader(true);
    try {
      const res = await axios.get(`${API_URL}/collection-type`, getHeaderOptions());
      setShowLoader(false);
      return res.data;
    } catch (err: any) {
      console.log(err);
      setShowLoader(false);
      throw err;
    }
  };

  const getCollectionType = async (slug: string) => {
    setShowLoader(true);
    try {
      const res = await axios.get(`${API_URL}/collection-type/${slug}`, getHeaderOptions());
      setShowLoader(false);
      return res.data;
    } catch (err: any) {
      console.log(err);
      setShowLoader(false);
      throw err;
    }
  };

  const createCollectionType = async (data: any) => {
    setShowLoader(true);
    try {
      const res = await axios.post(`${API_URL}/collection-type`, data, getHeaderOptions());
      setShowLoader(false);
      return res.data;
    } catch (err: any) {
      console.log(err);
      setShowLoader(false);
      throw err;
    }
  };

  const deleteCollectionType = async (id: number) => {
    setShowLoader(true);
    try {
      const res = await axios.delete(`${API_URL}/collection-type/${id}`, getHeaderOptions());
      setShowLoader(false);
      return res.data;
    } catch (err: any) {
      console.log(err);
      setShowLoader(false);
      throw err;
    }
  };

  const updateCollectionType = async (id: number, data: any) => {
    setShowLoader(true);
    try {
      const res = await axios.put(`${API_URL}/collection-type/${id}`, data, getHeaderOptions());
      setShowLoader(false);
      return res.data;
    } catch (err: any) {
      console.log(err);
      setShowLoader(false);
      throw err;
    }
  };

  return {
    collectionTypes,
    setCollectionTypes,
    getCollectionTypes,
    getCollectionType,
    createCollectionType,
    deleteCollectionType,
    updateCollectionType
  }
}
