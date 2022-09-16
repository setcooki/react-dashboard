import React, {useEffect, useState} from 'react';
import {FormControl, FormHelperText, Grid, InputLabel, Link, MenuItem, Select} from '@material-ui/core';
import {Autocomplete} from '@material-ui/lab';
import {TextField} from '@material-ui/core';
import RichText from "../RichText";
import {makeStyles} from "@material-ui/core/styles";
import clsx from 'clsx';
import {default as constants} from '../../constants/constants';

const useStyles = makeStyles((theme) => ({
  formControl: {
    width: '100%',
    maxWidth: '620px'
  },
  rte: {
    border: '1px solid black'
  }
}));

const AssetForm = (props) => {

  const classes = useStyles();

  const [initialized, setInitialized] = useState(false);
  const [collapse, setCollapse] = useState(false);
  const [state, setState] = useState({});
  const [title, setTitle] = useState([]);
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionData, setDescriptionData] = useState('');
  const [url, setUrl] = useState('');
  const [assets, setAssets] = useState([]);

  const StateHolder = () => {
    return null;
  }

  const updateState = (newState) => {
    setState((prevState) => {
      newState = {...prevState, ...newState};
      return newState;
    });
    if ('onChange' in props) {
      props.onChange(newState);
    }
  }

  const onAutocompleteChangeHandler = (e, value) => {
    e.preventDefault();
    if (value) {
      if (typeof (value) === 'object') {
        setTitle(value);
        setType(value.type);
        setDescription(value.description);
        setUrl(value.url);
        updateState({
          id: value.id,
          title: value.title,
          type: value.type,
          description: value.description,
          url: value.url
        });
      } else {
        setTitle(value);
        updateState({title: value});
      }
    }
  }

  const onTitleChangeHandler = (e) => {
    e.preventDefault();
    updateState({title: e.target.value});
  }

  const onTypeChangeHandler = (e) => {
    e.preventDefault();
    updateState({type: e.target.value});
    setType(e.target.value);
  }

  const onDescriptionChangeHandler = (content) => {
    updateState({description: content});
    setDescription(content);
  }

  const onUrlChangeHandler = (e) => {
    e.preventDefault();
    updateState({url: e.target.value});
    setUrl(e.target.value);
  }

  const onOpenUrlHandler = (e) => {
    e.preventDefault();
    if (url) {
      window.open(url, '_blank');
    }
  }

  useEffect(() => {
    if (!initialized && 'id' in props.asset) {
      if (props.asset && 'title' in props.asset) {
        setTitle(props.asset.title);
      }
      if (props.asset && 'type' in props.asset) {
        setType(props.asset.type);
      }
      if (props.asset && 'description' in props.asset) {
        setDescription(props.asset.description);
        setDescriptionData(props.asset.description);
      }
      if (props.asset && 'url' in props.asset) {
        setUrl(props.asset.url);
      }
      setState(props.asset || {});
      setInitialized(true);
    }
  }, [props.asset, initialized]);

  useEffect(() => {
    if (props.reset) {
      setTitle([]);
      setType('');
      setDescription('');
      setDescriptionData(null);
      setUrl('');
      setState({});
    }
  }, [props.reset]);

  useEffect(() => {
    setCollapse(props.collapse || false);
  }, [props.collapse]);

  useEffect(() => {
    setAssets(props.assets);
  }, [props.assets]);

  return (
    <React.Fragment>
      <StateHolder state={state} description={description}/>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={(collapse ? 12 : 3)}>
          <FormControl className={clsx(classes.formControl)}>
            <Autocomplete
              freeSolo
              options={assets || []}
              getOptionLabel={(option) => {
                if (option && typeof option === 'object' && 'title' in option) {
                  return option.title;
                } else {
                  return option;
                }
              }}
              value={title}
              onChange={onAutocompleteChangeHandler}
              renderInput={(params) => (
                <TextField
                  {...params || {}}
                  required={true}
                  label="Title"
                  variant="outlined"
                  placeholder="Title"
                  onChange={onTitleChangeHandler}
                />
              )}
            />
          </FormControl>
          <FormHelperText>The title of the asset</FormHelperText>
        </Grid>
        <Grid item xs={12} sm={(collapse ? 12 : 2)}>
          <FormControl required={true} variant="outlined" className={clsx(classes.formControl)}>
            <InputLabel id="types-helper-label">Type</InputLabel>
            <Select
              labelId="types-helper-label"
              required={true}
              value={type}
              label="Types"
              onChange={onTypeChangeHandler}
            >
              {Object.keys(constants.ASSET_TYPES).map((key, value) => {
                return (<MenuItem key={key} value={key}>{constants.ASSET_TYPES[key]}</MenuItem>);
              })}
            </Select>
          </FormControl>
          <FormHelperText>Choose a type</FormHelperText>
        </Grid>
        <Grid item xs={12} sm={(collapse ? 12 : 4)}>
          <FormControl className={clsx(classes.formControl)}>
            <RichText content={descriptionData} onChange={onDescriptionChangeHandler}/>
          </FormControl>
          <FormHelperText>The optional description of the asset</FormHelperText>
        </Grid>
        <Grid item xs={12} sm={(collapse ? 12 : 3)}>
          <FormControl className={clsx(classes.formControl)}>
            <TextField
              required={true}
              label="URL"
              type="url"
              value={url}
              variant="outlined"
              placeholder="URL"
              onChange={onUrlChangeHandler}
            />
          </FormControl>
          <FormHelperText>The URL of the asset (<Link href="#" onClick={onOpenUrlHandler}
                                                      tabIndex="-1">open</Link>)</FormHelperText>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default React.memo(AssetForm);
