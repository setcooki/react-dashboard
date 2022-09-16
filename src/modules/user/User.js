import React, {useEffect, useState, useCallback} from 'react';
import App from '../../templates/App';
import ErrorMessage from '../../components/ErrorMessage';
import SuccessMessage from '../../components/SuccessMessage';
import {
  Backdrop,
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  Link,
  InputLabel, MenuItem, Select,
  TextField, Chip
} from '@material-ui/core';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {useHistory} from 'react-router-dom';
import {makeStyles} from '@material-ui/core/styles';
import clsx from 'clsx';
import {default as constants} from '../../constants/constants';
import {userOperations} from '../../store/ducks/user';
import {generatePassword} from '../../functions/generatePassword';
import {Autocomplete} from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  formControl: {
    width: '100%',
    maxWidth: '620px'
  },
}));

export default function User(props) {

  const {error, success, loading} = useSelector((state) => {
    return {
      error: state.users.user.error,
      success: state.users.user.success,
      loading: state.users.user.loading
    };
  }, shallowEqual);

  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const [id, setId] = useState(null);
  const [uid, setUid] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [showUsername, setShowUsername] = useState(false);
  const [surname, setSurname] = useState('');
  const [forename, setForename] = useState('');
  const [groups, setGroups] = useState([]);
  const [groupData, setGroupData] = useState([]);
  const [clients, setClients] = useState([]);
  const [clientData, setClientData] = useState([]);
  const [role, setRole] = useState('');
  const [roles, setRoles] = useState({});
  const [roleDisabled, setRoleDisabled] = useState(false);
  const [notification, setNotification] = useState(true);
  const [showNotification, setShowNotification] = useState(true);
  const [enabled, setEnabled] = useState(true);
  const [showEnabled, setShowEnabled] = useState(false);
  const [showGroup, setShowGroup] = useState(false);
  const [showClient, setShowClient] = useState(false);
  const [passwordRequired, setPasswordRequired] = useState(false);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [openErrorMessage, setOpenErrorMessage] = useState(false);
  const [openSuccessMessage, setOpenSuccessMessage] = useState(false);

  const onSubmitHandler = (e) => {
    e.preventDefault();
    let data = {
      email: email,
      forename: forename,
      surname: surname,
      username: username,
      password: password,
      role: role,
      notification: notification,
      enabled: enabled,
      groups: groups.map(group => group.uid),
      clients: clients.map(client => client.uid)
    };
    if (id && uid) {
      dispatch(userOperations.updateUser(id, uid, data));
    } else {
      dispatch(userOperations.createUser(data)).then((state) => {
        if (state === true || (typeof (state) === 'object' && 'type' in state && state.type === userOperations.CREATE_USER_SUCCESS)) {
          setEmail('');
          setForename('');
          setSurname('');
          setUsername('');
          setPassword('');
          setRole('');
          setNotification(true);
          setGroups([]);
          setClients([]);
        }
      });
    }
    return false;
  };

  const onGroupChangeHandler = (e, values) => {
    e.preventDefault();
    setGroups(values);
  }

  const onClientChangeHandler = (e, values) => {
    e.preventDefault();
    setClients(values);
  }

  const onGeneratePasswordHandler = (e) => {
    e.preventDefault();
    setPassword(generatePassword());
  }

  const onEmailChangeHandler = (e) => {
    e.preventDefault();
    setEmail(e.target.value);
  };

  const onPasswordChangeHandler = (e) => {
    e.preventDefault();
    setPassword(e.target.value);
  };

  const onUsernameChangeHandler = (e) => {
    e.preventDefault();
    setUsername(e.target.value);
  };

  const onSurnameChangeHandler = (e) => {
    e.preventDefault();
    setSurname(e.target.value);
  };

  const onForenameChangeHandler = (e) => {
    e.preventDefault();
    setForename(e.target.value);
  };

  const onNotificationChangeHandler = (e) => {
    e.preventDefault();
    setNotification(e.target.checked);
  }

  const onEnabledChangeHandler = (e) => {
    e.preventDefault();
    setEnabled(e.target.checked);
  }

  const onRoleChangeHandler = (e) => {
    e.preventDefault();
    setRole(e.target.value);
    if (e.target.value === 'subscriber') {
      loadGroups();
      loadClients();
      setShowPassword(false);
      setShowUsername(false);
      setPassword('');
      setUsername('');

    } else {
      setGroups([]);
      setShowGroup(false);
      setClients([]);
      setShowClient(false);
      setShowPassword(true);
      setShowUsername(true);
    }
  }

  const loadGroups = useCallback(() => {
    return dispatch(userOperations.fetchUserGroups()).then((data) => {
      setGroupData(data);
      setShowGroup(true);
    });
  }, [dispatch]);

  const loadClients = useCallback(() => {
    return dispatch(userOperations.fetchUserClients()).then((data) => {
      setClientData(data);
      setShowClient(true);
    });
  }, [dispatch]);

  useEffect(() => {
    setRoles(constants.ROLES);
  }, []);

  useEffect(() => {
    setOpenBackdrop(loading === true);
    setOpenErrorMessage(error !== null);
    setOpenSuccessMessage(success === true);
  }, [error, success, loading]);

  useEffect(() => {
    const m = history.location.pathname.match(/([0-9]+)\/([0-9a-z-]+)$/i);
    if (m !== null) {
      const id = parseInt(m[1]);
      const uid = m[2];
      setId(id);
      setUid(uid);
      setShowNotification(false);
      dispatch(userOperations.fetchUser(id, uid)).then((data) => {
        setEmail(data.email);
        setForename(data.forename);
        setSurname(data.surname);
        setRole(data.role);
        setGroups(('groups' in data) ? data.groups : []);
        setClients(('clients' in data) ? data.clients : []);
        setUsername(data.username);
        setEnabled(data.enabled);
        setShowEnabled(true);
        setRoleDisabled(true);
        if (data.role === 'subscriber') {
          loadGroups();
          loadClients();
          setRoles(Object.keys(constants.ROLES).filter(role => role === 'subscriber').reduce((obj, key) => {
            obj[key] = constants.ROLES[key];
            return obj;
          }, {}));
        } else {
          setShowPassword(true);
          setShowUsername(true);
          setRoles(Object.keys(constants.ROLES).filter(role => role !== 'subscriber').reduce((obj, key) => {
            obj[key] = constants.ROLES[key];
            return obj;
          }, {}));
        }
      });
    } else {
      setPassword(generatePassword());
      setPasswordRequired(true);
    }
  }, [dispatch, history, loadGroups, loadClients]);

  return (
    <React.Fragment>
      <App>
        <ErrorMessage open={openErrorMessage}>
          {error ? error : ''}
        </ErrorMessage>
        <SuccessMessage open={openSuccessMessage}>
          Saved!
        </SuccessMessage>
        <Backdrop open={openBackdrop}>
          <CircularProgress color="inherit"/>
        </Backdrop>
        <form autoComplete="off" onSubmit={onSubmitHandler}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl disabled={roleDisabled} required={true} variant="outlined"
                           className={clsx(classes.formControl)}>
                <InputLabel id="role-helper-label">Role</InputLabel>
                <Select
                  labelId="role-helper-label"
                  required={true}
                  value={role}
                  label="Role"
                  onChange={onRoleChangeHandler}
                >
                  {Object.keys(roles).map((key, value) => {
                    return (<MenuItem key={key} value={key}>{roles[key]}</MenuItem>);
                  })}
                </Select>
              </FormControl>
              <FormHelperText>Choose a role</FormHelperText>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl required={true} variant="outlined" className={clsx(classes.formControl)}>
                <TextField
                  required={true}
                  label="E-Mail"
                  value={email}
                  type="email"
                  variant="outlined"
                  onChange={onEmailChangeHandler}
                />
              </FormControl>
              <FormHelperText>The e-mail user</FormHelperText>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl required={true} variant="outlined" className={clsx(classes.formControl)}>
                <TextField
                  required={true}
                  label="Forename"
                  value={forename}
                  variant="outlined"
                  onChange={onForenameChangeHandler}
                />
              </FormControl>
              <FormHelperText>The forename of user</FormHelperText>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl required={true} variant="outlined" className={clsx(classes.formControl)}>
                <TextField
                  required={true}
                  label="Surname"
                  value={surname}
                  variant="outlined"
                  onChange={onSurnameChangeHandler}
                />
              </FormControl>
              <FormHelperText>The surename of user</FormHelperText>
            </Grid>
          </Grid>
          {(showClient) &&
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl className={clsx(classes.formControl)}>
                <Autocomplete
                  multiple
                  options={clientData}
                  getOptionLabel={option => option.name}
                  value={clients}
                  onChange={onClientChangeHandler}
                  renderTags={(value, getTagProps) =>
                    (value || []).map((option, index) => (
                      <Chip variant="outlined" label={option.name} {...getTagProps({index})} />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      required={false}
                      {...params || {}}
                      variant="outlined"
                      label="Clients"
                      placeholder="Clients"
                    />
                  )}
                />
              </FormControl>
              <FormHelperText>Choose one more clients the user is allowed to use</FormHelperText>
            </Grid>
          </Grid>
          }
          {(showGroup) &&
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl className={clsx(classes.formControl)}>
                <Autocomplete
                  multiple
                  limitTags={10}
                  options={groupData}
                  getOptionLabel={option => option.name}
                  value={groups}
                  onChange={onGroupChangeHandler}
                  renderTags={(value, getTagProps) =>
                    (value || []).map((option, index) => (
                      <Chip variant="outlined" label={option.name} {...getTagProps({index})} />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      required={false}
                      {...params || {}}
                      variant="outlined"
                      label="Groups"
                      placeholder="Groups"
                    />
                  )}
                />
              </FormControl>
              <FormHelperText>Choose optional groups the user belongs to</FormHelperText>
            </Grid>
          </Grid>
          }
          {(showPassword) &&
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl required={passwordRequired} variant="outlined" className={clsx(classes.formControl)}>
                <TextField
                  required={passwordRequired}
                  label="Password"
                  value={password}
                  variant="outlined"
                  onChange={onPasswordChangeHandler}
                />
              </FormControl>
              <FormHelperText>Optional password <Link href="#" onClick={onGeneratePasswordHandler}>(Generate random
                password)</Link></FormHelperText>
            </Grid>
          </Grid>
          }
          {(showUsername) &&
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl required={false} variant="outlined" className={clsx(classes.formControl)}>
                <TextField
                  required={false}
                  label="Username"
                  value={username}
                  variant="outlined"
                  onChange={onUsernameChangeHandler}
                />
              </FormControl>
              <FormHelperText>Optional username (if no username is specified user can login with e-mail
                only)</FormHelperText>
            </Grid>
          </Grid>
          }
          {(showNotification) &&
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl required={false} variant="outlined">
                <FormControlLabel
                  control={
                    <Checkbox
                      label="Notification"
                      value={1}
                      required={false}
                      color="primary"
                      checked={notification}
                      onChange={onNotificationChangeHandler}
                      defaultChecked
                    />
                  }
                  label="Send user login details"
                />
              </FormControl>
            </Grid>
          </Grid>
          }
          {(showEnabled) &&
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl required={false} variant="outlined">
                <FormControlLabel
                  control={
                    <Checkbox
                      label="Enabled"
                      value={1}
                      required={false}
                      color="primary"
                      checked={enabled}
                      onChange={onEnabledChangeHandler}
                      defaultChecked
                    />
                  }
                  label="User is enabled?"
                />
              </FormControl>
            </Grid>
          </Grid>
          }
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary">Save</Button>
            </Grid>
          </Grid>
        </form>
      </App>
    </React.Fragment>
  )
}
