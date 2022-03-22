import {useContext, useState} from 'react';
import axios from 'axios';
import {API_URL} from '../config';
import {getHeaderOptions} from '../lib/request-helper';
import {ShowLoaderContext} from './show-loader-context';

export default function useMediaSize() {
  const {setShowLoader} = useContext(ShowLoaderContext);
  const [mediaSizes, setMediaSizes] = useState([]);

  const getListing = async () => {
    setShowLoader(true);
    try {
      const res = await axios.get(`${API_URL}/media-size`, getHeaderOptions());
      setShowLoader(false);
      return res.data;
    } catch (err: any) {
      console.log(err);
      setShowLoader(false);
      throw err;
    }
  };

  const getSize = async (slug: string) => {
    setShowLoader(true);
    try {
      const res = await axios.get(`${API_URL}/media-size/${slug}`, getHeaderOptions());
      setShowLoader(false);
      return res.data;
    } catch (err: any) {
      console.log(err);
      setShowLoader(false);
      throw err;
    }
  };

  const createSize = async (data: any) => {
    setShowLoader(true);
    try {
      const res = await axios.post(`${API_URL}/media-size`, data, getHeaderOptions());
      setShowLoader(false);
      return res.data;
    } catch (err: any) {
      console.log(err);
      setShowLoader(false);
      throw err;
    }
  };

  const deleteSize = async (id: number) => {
    setShowLoader(true);
    try {
      const res = await axios.delete(`${API_URL}/media-size/${id}`, getHeaderOptions());
      setShowLoader(false);
      return res.data;
    } catch (err: any) {
      console.log(err);
      setShowLoader(false);
      throw err;
    }
  };

  const updateSize = async (id: number, data: any) => {
    setShowLoader(true);
    try {
      const res = await axios.put(`${API_URL}/media-size/${id}`, data, getHeaderOptions());
      setShowLoader(false);
      return res.data;
    } catch (err: any) {
      console.log(err);
      setShowLoader(false);
      throw err;
    }
  };

  return {
    getListing,
    getSize,
    createSize,
    deleteSize,
    updateSize,
  }
}
