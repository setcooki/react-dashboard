import React, {useEffect, useState} from 'react';
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import App from '../../templates/App';
import ErrorMessage from "../../components/ErrorMessage";
import SuccessMessage from "../../components/SuccessMessage";
import {
  Backdrop,
  Button, Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  TextField
} from "@material-ui/core";
import clsx from "clsx";
import {makeStyles} from "@material-ui/core/styles";
import {clientOperations} from "../../store/ducks/client";
import MetaTable from "../../components/MetaTable";

const useStyles = makeStyles((theme) => ({
  formControl: {
    width: '100%',
    maxWidth: '620px'
  },
}));

export default function Client(props) {

  const {error, success, loading} = useSelector((state) => {
    return {
      error: state.clients.client.error,
      success: state.clients.client.success,
      loading: state.clients.client.loading
    };
  }, shallowEqual);

  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const [id, setId] = useState(null);
  const [uid, setUid] = useState(null);
  const [name, setName] = useState('');
  const [key, setKey] = useState('');
  const [url, setUrl] = useState('');
  const [whitelist, setWhitelist] = useState('');
  const [enabled, setEnabled] = useState(1);
  const [metas, setMetas] = useState([]);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [openErrorMessage, setOpenErrorMessage] = useState(false);
  const [openSuccessMessage, setOpenSuccessMessage] = useState(false);

  const onNameChangeHandler = (e) => {
    e.preventDefault();
    setName(e.target.value);
  }

  const onKeyChangeHandler = (e) => {
    e.preventDefault();
    setKey(e.target.value);
  }

  const onUrlChangeHandler = (e) => {
    e.preventDefault();
    setUrl(e.target.value);
  }

  const onWhitelistChangeHandler = (e) => {
    e.preventDefault();
    setWhitelist(e.target.value);
  }

  const onEnabledChangeHandler = (e) => {
    e.preventDefault();
    setEnabled(e.target.checked);
  }

  const onMetaChangeHandler = (state) => {
    setMetas(prevState => state);
  }

  const onSubmitHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    let data = {
      name: name,
      url: url,
      whitelist: whitelist,
      enabled: enabled,
      metas: metas
    }
    if (id && uid) {
      dispatch(clientOperations.updateClient(id, uid, data));
    } else {
      //Not allowed currently
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
      dispatch(clientOperations.fetchClient(id, uid)).then((data) => {
        setName(data.name);
        setUrl(data.url);
        setWhitelist(data.whitelist);
        setKey(data.ckey);
        setEnabled(data.enabled);
        setMetas(data.metas);
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
                  label="Name"
                  value={name}
                  type="text"
                  variant="outlined"
                  onChange={onNameChangeHandler}
                />
              </FormControl>
              <FormHelperText>The name of the client</FormHelperText>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl required={true} disabled={true} variant="outlined" className={clsx(classes.formControl)}>
                <TextField
                  disabled={true}
                  required={true}
                  label="Key"
                  value={key}
                  type="text"
                  variant="outlined"
                  onChange={onKeyChangeHandler}
                />
              </FormControl>
              <FormHelperText>The client key</FormHelperText>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl required={true} variant="outlined" className={clsx(classes.formControl)}>
                <TextField
                  required={true}
                  label="URL"
                  value={url}
                  type="text"
                  variant="outlined"
                  onChange={onUrlChangeHandler}
                />
              </FormControl>
              <FormHelperText>The URL of the client</FormHelperText>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl required={false} variant="outlined" className={clsx(classes.formControl)}>
                <TextField
                  multiline
                  rowsMax={10}
                  required={false}
                  label="Whitelist (E-Mails)"
                  value={whitelist}
                  type="text"
                  variant="outlined"
                  onChange={onWhitelistChangeHandler}
                />
              </FormControl>
              <FormHelperText>List of whitelist e-mails with instant access (Separated by new line)</FormHelperText>
            </Grid>
          </Grid>
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
                  label="Client is enabled?"
                />
              </FormControl>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <MetaTable metas={metas} onChange={onMetaChangeHandler}/>
              <FormHelperText>Add or modify meta data</FormHelperText>
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
  );
}
