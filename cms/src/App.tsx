import React, {Suspense} from 'react';
import {Route, BrowserRouter as Router, Routes} from 'react-router-dom';
import './App.css';
import {UserContext} from './hooks/user-context';
import PrivateRoute from './pages/private-route';
import NotFound from './pages/not-found';
import Landing from './pages/landing';
import Template from './components/layout/template';
import Home from './pages/home';
import {ShowLoaderContext} from './hooks/show-loader-context';
import useAuth from './hooks/use-auth';
import useShowLoader from './hooks/use-show-loader';
import Login from './pages/login';
import {LayoutContext} from './hooks/layout-context';
import useLayout from './hooks/use-layout';
import './i18n';
import {HelmetProvider} from 'react-helmet-async';
import DefineTypes from './pages/define-types';
import Listing from './pages/management/listing';
import MediaLibrary from './pages/media-library';
import NewRecord from './pages/management/new-record';
import EditRecord from './pages/management/edit-record';
import ConfigureForm from './pages/management/configure-form';
import MediaSizes from './pages/media-sizes';

function App() {
  const {showLoader, setShowLoader} = useShowLoader(false);
  const {user, setUser, isLoading, setUserContext, getProfile} = useAuth();
  const {layout, setLayout} = useLayout({});

  React.useEffect(() => {
    (async () => {
      try {
        await getProfile();
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  return (
    <Suspense fallback="loading">
      <HelmetProvider>
        <Router>
          <UserContext.Provider value={{user, setUser, isLoading, setUserContext}}>
            <ShowLoaderContext.Provider value={{showLoader, setShowLoader}}>
              <LayoutContext.Provider value={{layout, setLayout}}>
                <Template>
                  <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
                    <Route path="/media-library" element={<PrivateRoute><MediaLibrary /></PrivateRoute>} />
                    <Route path="/media-library/:slug" element={<PrivateRoute><MediaLibrary /></PrivateRoute>} />
                    <Route path="/media-sizes" element={<PrivateRoute><MediaSizes /></PrivateRoute>} />
                    <Route path="/define-types" element={<PrivateRoute><DefineTypes /></PrivateRoute>} />
                    <Route path="/define-types/*" element={<PrivateRoute><DefineTypes /></PrivateRoute>} />
                    <Route path="/listing/configure/form/:slug" element={<PrivateRoute><ConfigureForm /></PrivateRoute>} />
                    <Route path="/listing/:slug" element={<PrivateRoute><Listing /></PrivateRoute>} />
                    <Route path="/listing/:slug/new" element={<PrivateRoute><NewRecord /></PrivateRoute>} />
                    <Route path="/listing/:slug/edit/:id" element={<PrivateRoute><EditRecord /></PrivateRoute>} />
                    <Route path='*' element={<NotFound />} />
                  </Routes>
                </Template>
              </LayoutContext.Provider>
            </ShowLoaderContext.Provider>
          </UserContext.Provider>
        </Router>
      </HelmetProvider>
    </Suspense>
  );
}

export default App;
