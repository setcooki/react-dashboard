import React, {useEffect, useRef, useState} from 'react';
import {Box, FormControl, FormHelperText, Grid, Link, TextField, Typography} from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import {authentication} from '../services/authentication';
import {generatePassword} from '../functions/generatePassword';
import {makeStyles} from '@material-ui/core/styles';
import ErrorMessage from './ErrorMessage';
import SuccessMessage from "./SuccessMessage";
import {checkPassword} from '../functions/checkPassword';
import {userOperations} from "../store/ducks/user";
import {useDispatch} from "react-redux";

const useStyles = makeStyles((theme) => ({
  formControl: {
    width: '100%',
    maxWidth: '620px'
  },
  showPassword: {
    position: 'absolute',
    right: '8px',
    top: '8px'
  }
}));

export default function ProfileForm(props) {

  const classes = useStyles();
  const dispatch = useDispatch();
  const ref = useRef(null);

  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [passwordFieldType, setPasswordFieldType] = useState('password');
  const [openErrorMessage, setOpenErrorMessage] = useState(false);
  const [openSuccessMessage, setOpenSuccessMessage] = useState(false);

  const onPasswordChangeHandler = (e) => {
    e.preventDefault();
    setPassword(e.target.value);
  };

  const onPasswordRepeatChangeHandler = (e) => {
    e.preventDefault();
    setPasswordRepeat(e.target.value);
  };

  const onGeneratePasswordHandler = (e) => {
    e.preventDefault();
    const pass = generatePassword();
    setPassword(pass);
    setPasswordRepeat(pass);
  }

  const onResetPasswordHandler = (e) => {
    e.preventDefault();
    setPassword('');
    setPasswordRepeat('');
  }

  const onPasswordShowHandler = (e) => {
    e.preventDefault();
    setPasswordFieldType((passwordFieldType === 'text') ? 'password' : 'text');
  }

  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (password === '' || passwordRepeat === '') {
      setError('No password given');
      setOpenErrorMessage(true);
    } else if (password !== passwordRepeat) {
      setError('Password do not match');
      setOpenErrorMessage(true);
    } else if (!checkPassword(password)) {
      setError('Password is not a save password');
      setOpenErrorMessage(true);
    } else {
      dispatch(userOperations.updateUserPassword(authentication.currentUserValue.id, authentication.currentUserValue.uid, password)).then(() => {
        setOpenSuccessMessage(true);
        authentication.logout();
        setTimeout(() => {
          window.location.reload(true);
        }, 5000);
      });
    }
    return false;
  }

  const ShowPasswordButton = () => {
    let icon = <Visibility/>;
    if (passwordFieldType === 'text') {
      icon = <VisibilityOff/>
    }
    return (
      <Link href="#" onClick={onPasswordShowHandler} color="secondary" className={classes.showPassword}
            tabIndex="-1">{icon}</Link>);
  }

  useEffect(() => {
    if (props.submit && props.submit > 0) {
      ref.current.dispatchEvent(new Event('submit'));
    }
  }, [props.submit]);

  return (
    <React.Fragment>
      <ErrorMessage open={openErrorMessage}>
        {error ? error : ''}
      </ErrorMessage>
      <SuccessMessage open={openSuccessMessage}>
        Saved! Please log out and in again
      </SuccessMessage>
      <Typography variant="subtitle1" gutterBottom>
        Your are logged in as: <strong>{authentication.currentUserValue.name}</strong>
      </Typography>
      <form autoComplete="off" onSubmit={onSubmitHandler} ref={ref}>
        <Box bgcolor="grey.100" p={2}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="subtitle2">
                Change your password:
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <FormControl required={false} variant="outlined" className={classes.formControl}>
                <TextField
                  size="small"
                  required={false}
                  label="Password"
                  type={passwordFieldType}
                  value={password}
                  variant="outlined"
                  onChange={onPasswordChangeHandler}
                />
                <ShowPasswordButton/>
              </FormControl>
              <FormHelperText>
                <Link href="#" onClick={onGeneratePasswordHandler} tabIndex="-1">(Generate random password)</Link>
              </FormHelperText>
            </Grid>
            <Grid item xs={12}>
              <FormControl required={true} variant="outlined" className={classes.formControl}>
                <TextField
                  size="small"
                  required={true}
                  label="Password Repeat"
                  type="password"
                  value={passwordRepeat}
                  variant="outlined"
                  onChange={onPasswordRepeatChangeHandler}
                />
              </FormControl>
              <FormHelperText>
                <Link href="#" onClick={onResetPasswordHandler} tabIndex="-1">(Reset)</Link>
              </FormHelperText>
            </Grid>
          </Grid>
        </Box>
      </form>
    </React.Fragment>
  );
}
