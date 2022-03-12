import {useState} from 'react';

export default function useLayout(initialState: any) {
  const [layout, setLayout] = useState(initialState);

  const changeLayout = (value: any) => {
    setLayout(value);
  }

  return {layout, setLayout, changeLayout};
}
