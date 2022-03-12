import React, {useContext} from 'react';
import {useNavigate} from 'react-router-dom';
import FormInput from './../components/form-input';
import CTA from './../components/cta';
import Error from './../components/error';
import useForm from './../hooks/use-form';
import useAuth from './../hooks/use-auth';
import {Card, CardContent, Container, Grid} from '@mui/material';
import {useTranslation} from 'react-i18next';
import {UserContext} from '../hooks/user-context';
import {CSSTransition} from 'react-transition-group';
import styled from '@emotion/styled';

const InputHolderStyled = styled('div')`
  margin-bottom: 20px;
`;

const CardContentStyled = styled(CardContent)`
  text-align: center;
`;

const LogoStyled = styled('img')`
  margin-top: 20px;
  margin-bottom: 40px;
  width: auto;
  height: 60px;
`;

const ContainerStyled = styled(Container)`
  height: 100%;
`;

const GridStyled = styled(Grid)`
  height: 100%;
`;

const GridCellStyled = styled(Grid)`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CardStyled = styled(Card)`
  width: 100%;
`;

export default function Login() {
  const errorRef = React.useRef(null);
  const {user, setUserContext} = useContext(UserContext);
  const {t} = useTranslation();
  const navigate = useNavigate();
  const {values, handleChange} = useForm({
    initialValues: {
      username: '',
      password: ''
    }
  });

  const {loginUser, error}: any = useAuth();

  React.useEffect(() => {
    if (user !== undefined && user !== null) {
      navigate('/home');
    }
  }, []);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      await loginUser(values);
      await setUserContext();
      navigate('/home')
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <ContainerStyled>
      <GridStyled container spacing={3}>
        <Grid item xs={4} />
        <GridCellStyled item xs={4}>
          <CardStyled>
            <CardContentStyled>
              <LogoStyled src={'/logo-dark.svg'} />
              <div className="inlineForm__notif">
                <CSSTransition nodeRef={errorRef} in={error !== undefined && error !== null} timeout={100}
                               classNames="opacity">
                  <div ref={errorRef} className={'opacity-initial'}>
                    {error ? <Error error={error.message} /> : <></>}
                  </div>
                </CSSTransition>
              </div>
              <form onSubmit={handleLogin}>
                <InputHolderStyled>
                  <FormInput type={"text"}
                             placeholder={t('Username')}
                             label={t('Username')}
                             name={"username"}
                             value={values.username}
                             handleChange={handleChange} />
                </InputHolderStyled>
                <InputHolderStyled>
                  <FormInput type={"password"}
                             placeholder={t('Password')}
                             label={t('Password')}
                             name={"password"}
                             value={values.password}
                             handleChange={handleChange} />
                </InputHolderStyled>
                <div className="inlineForm__submit">
                  <CTA
                    name={t('Login')}
                    type={"submit"}
                  />
                </div>
              </form>
            </CardContentStyled>
          </CardStyled>
        </GridCellStyled>
      </GridStyled>
    </ContainerStyled>
  )
}
