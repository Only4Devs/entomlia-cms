import {useContext} from 'react';
import axios from 'axios';
import {API_URL} from '../config';
import {getHeaderOptions} from '../lib/request-helper';
import {ShowLoaderContext} from './show-loader-context';

export default function useMediaLibraryDirectory() {
  const {setShowLoader} = useContext(ShowLoaderContext);

  const getListing = async () => {
    setShowLoader(true);
    try {
      const res = await axios.get(`${API_URL}/media-library-directory`, getHeaderOptions());
      setShowLoader(false);
      return res.data;
    } catch (err: any) {
      console.log(err);
      setShowLoader(false);
      throw err;
    }
  };

  const getDirectory = async (slug: string) => {
    setShowLoader(true);
    try {
      const res = await axios.get(`${API_URL}/media-library-directory/${slug}`, getHeaderOptions());
      setShowLoader(false);
      return res.data;
    } catch (err: any) {
      console.log(err);
      setShowLoader(false);
      throw err;
    }
  };

  const createDirectory = async (data: any) => {
    setShowLoader(true);
    try {
      const res = await axios.post(`${API_URL}/media-library-directory`, data, getHeaderOptions());
      setShowLoader(false);
      return res.data;
    } catch (err: any) {
      console.log(err);
      setShowLoader(false);
      throw err;
    }
  };

  const deleteDirectory = async (id: number) => {
    setShowLoader(true);
    try {
      const res = await axios.delete(`${API_URL}/media-library-directory/${id}`, getHeaderOptions());
      setShowLoader(false);
      return res.data;
    } catch (err: any) {
      console.log(err);
      setShowLoader(false);
      throw err;
    }
  };

  const updateDirectory = async (id: number, data: any) => {
    setShowLoader(true);
    try {
      const res = await axios.put(`${API_URL}/media-library-directory/${id}`, data, getHeaderOptions());
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
    getDirectory,
    createDirectory,
    deleteDirectory,
    updateDirectory,
  }
}
