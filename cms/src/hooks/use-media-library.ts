import {useContext} from 'react';
import axios from 'axios';
import {API_URL} from '../config';
import {getHeaderOptions} from '../lib/request-helper';
import {ShowLoaderContext} from './show-loader-context';

export default function useMediaLibrary() {
  const {setShowLoader} = useContext(ShowLoaderContext);

  const getFiles = async (directory: string | null = null) => {
    setShowLoader(true);
    try {
      let pathDirectory = ''
      if (directory !== undefined && directory !== null) {
        pathDirectory = `/${directory}`;
      }
      const res = await axios.get(`${API_URL}/media-library${pathDirectory}`, getHeaderOptions());
      setShowLoader(false);
      return res.data;
    } catch (err: any) {
      console.log(err);
      setShowLoader(false);
      throw err;
    }
  };

  return {
    getFiles,
  }
}