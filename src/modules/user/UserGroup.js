import React, {useEffect, useState} from 'react';
import App from '../../templates/App';
import ErrorMessage from '../../components/ErrorMessage';
import SuccessMessage from '../../components/SuccessMessage';
import {Backdrop, Button, CircularProgress, FormControl, FormHelperText, Grid, TextField} from '@material-ui/core';
import RichText from '../../components/RichText';
import {makeStyles} from '@material-ui/core/styles';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {useHistory} from 'react-router-dom';
import {surveyTypes} from '../../store/ducks/survey';
import {userOperations} from '../../store/ducks/user';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  formControl: {
    width: '100%',
    maxWidth: '620px'
  },
  rte: {
    border: '1px solid black'
  }
}));

export default function UserGroup(props) {

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
  const [name, setName] = useState(null);
  const [description, setDescription] = useState('');
  const [descriptionData, setDescriptionData] = useState('');
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [openErrorMessage, setOpenErrorMessage] = useState(false);
  const [openSuccessMessage, setOpenSuccessMessage] = useState(false);

  const onNameChangeHandler = (e) => {
    e.preventDefault();
    setName(e.target.value);
  };

  const onDescriptionChangeHandler = (description) => {
    setDescription(description);
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    let data = {
      name: name,
      description: description
    };
    if (id && uid) {
      dispatch(userOperations.updateUserGroup(id, uid, data));
    } else {
      dispatch(userOperations.createUserGroup(data)).then((state) => {
        if (state === true || (typeof (state) === 'object' && 'type' in state && state.type === surveyTypes.CREATE_USER_SUCCESS)) {
          setName('');
          setDescription('');
          setDescriptionData(null);
        }
      });
    }
    return false;
  };

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
      dispatch(userOperations.fetchUserGroup(id, uid)).then((data) => {
        setName(data.name);
        setDescription(data.description);
        setDescriptionData(data.description);
      });
    }
  }, [dispatch, history]);

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
              <FormControl required={true} variant="outlined" className={clsx(classes.formControl)}>
                <TextField
                  required={true}
                  label="Group name"
                  placeholder="Group name"
                  value={name}
                  variant="outlined"
                  onChange={onNameChangeHandler}
                />
              </FormControl>
              <FormHelperText>The name of the group</FormHelperText>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl required={true} className={clsx(classes.formControl)}>
                <RichText
                  content={descriptionData}
                  onChange={onDescriptionChangeHandler}
                />
              </FormControl>
              <FormHelperText>Optional description of group</FormHelperText>
            </Grid>
          </Grid>
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
