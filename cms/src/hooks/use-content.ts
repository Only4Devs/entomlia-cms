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

  const updateContent = async (id: string | number, slug: string, data: any) => {
    setShowLoader(true);
    try {
      const res = await axios.put(`${API_URL}/content/${slug}/${id}`, data, getHeaderOptions());
      setShowLoader(false);
      return res.data;
    } catch (err: any) {
      console.log(err);
      setShowLoader(false);
      throw err;
    }
  };

  const getRow = async (slug: string, id: number | string) => {
    setShowLoader(true);
    try {
      const res = await axios.get(`${API_URL}/content/${slug}/${id}`, getHeaderOptions());
      setShowLoader(false);
      return res.data;
    } catch (err: any) {
      console.log(err);
      setShowLoader(false);
      throw err;
    }
  };

  const getListing = async (slug: string) => {
    setShowLoader(true);
    try {
      const res = await axios.get(`${API_URL}/content/listing/${slug}`, getHeaderOptions());
      setShowLoader(false);
      return res.data;
    } catch (err: any) {
      console.log(err);
      setShowLoader(false);
      throw err;
    }
  };

  return {
    createContent,
    updateContent,
    getRow,
    getListing
  }
}
