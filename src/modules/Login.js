import React, {useEffect, useState} from 'react';
import {useHistory, useLocation} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import {Grid} from '@material-ui/core';
import {Link} from '@material-ui/core';
import {Button} from '@material-ui/core';
import {TextField} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import {authentication} from '../services/authentication';
import {runtimeActions} from '../store/ducks/runtime';
import ErrorMessage from '../components/ErrorMessage';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Login(props) {

  const dispatch = useDispatch();
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();

  if (authentication.isCurrentUser) {
    history.push('/');
  }

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [openErrorMessage, setOpenSetErrorMessage] = useState(false);

  const onUsernameChangeHandler = (e) => {
    setUsername(e.target.value);
  }

  const onPasswordChangeHandler = (e) => {
    setPassword(e.target.value);
  }

  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (username && password) {
      authentication.login(username, password).then((user) => {
        if (user) {
          dispatch(runtimeActions.updateRuntime({user: user}));
          const {from} = location.state || {from: {pathname: "/"}};
          history.push(from);
        } else {
          setOpenSetErrorMessage(true);
        }
      });
    }
    return false;
  };

  useEffect(() => {
    const listener = e => {
      if (e.code === 'Enter' || e.code === 'NumpadEnter') {
        document.getElementById('submit').click();
      }
    };
    document.addEventListener('keydown', listener);
    return () => {
      document.removeEventListener('keydown', listener);
    };
  }, []);

  return (
    <React.Fragment>
      <ErrorMessage open={openErrorMessage}>
        Wrong username or password
      </ErrorMessage>
      <form action="/" method="POST" className={clsx(classes.form)} autoComplete="on" onSubmit={onSubmitHandler}>
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justify="center"
          style={{minHeight: '100vh'}}
        >
          <Grid item xs={3}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email/Username"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={onUsernameChangeHandler}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={onPasswordChangeHandler}
            />
            <Button
              id="submit"
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={clsx(classes.submit)}
            >Login</Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>&nbsp;</Grid>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </React.Fragment>
  )
};
