import {useState} from 'react';

export default function useShowLoader(initialState: boolean) {
  const [showLoader, setShowLoader] = useState(initialState);

  return {showLoader, setShowLoader};
}
