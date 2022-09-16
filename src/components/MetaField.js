import React, {useEffect, useState} from 'react';
import clsx from "clsx";
import {makeStyles} from "@material-ui/core/styles";
import {
  FormControl,
  FormHelperText,
  Grid,
  TextField
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  formControl: {
    width: '100%',
    maxWidth: '620px'
  },
  textField: {
    fontSize: '.9rem'
  }
}));

const MetaField = (props) => {

  const classes = useStyles();

  const [initialized, setInitialized] = useState(false);
  const [collapse, setCollapse] = useState(false);
  const [, setState] = useState({});
  const [name, setName] = useState('');
  const [value, setValue] = useState('');

  const updateState = (newState) => {
    setState((prevState) => {
      newState = {...prevState, ...newState};
      return newState;
    });
    if ('onChange' in props) {
      props.onChange(newState);
    }
  }

  const onNameChangeHandler = (e) => {
    e.preventDefault();
    setName(e.target.value);
    updateState({name: e.target.value});
  }

  const onValueChangeHandler = (e) => {
    e.preventDefault();
    setValue(e.target.value);
    updateState({value: e.target.value});
  }

  useEffect(() => {
    if (!initialized && 'id' in props.meta) {
      if (props.meta && 'name' in props.meta) {
        setName(props.meta.name);
      }
      if (props.meta && 'value' in props.meta) {
        setValue(props.meta.value);
      }
      setState(props.meta || {});
      setInitialized(true);
    }
  }, [props.meta, initialized]);

  useEffect(() => {
    if (props.reset) {
      setName('');
      setValue('');
      setState({});
    }
  }, [props.reset]);

  useEffect(() => {
    setCollapse(props.collapse || false);
  }, [props.collapse]);

  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={(collapse ? 12 : 6)}>
          <FormControl className={clsx(classes.formControl)}>
            <TextField
              required={true}
              label="Name"
              type="text"
              size="small"
              value={name}
              variant="outlined"
              placeholder="Name"
              InputProps={{
                classes: {
                  input: clsx(classes.textField)
                }
              }}
              onChange={onNameChangeHandler}
            />
          </FormControl>
          <FormHelperText>Name</FormHelperText>
        </Grid>
        <Grid item xs={12} sm={(collapse ? 12 : 6)}>
          <FormControl className={clsx(classes.formControl)}>
            <TextField
              required={true}
              label="Value"
              type="text"
              size="small"
              value={value}
              variant="outlined"
              placeholder="Value"
              InputProps={{
                classes: {
                  input: clsx(classes.textField)
                }
              }}
              onChange={onValueChangeHandler}
            />
          </FormControl>
          <FormHelperText>Value</FormHelperText>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default React.memo(MetaField);
