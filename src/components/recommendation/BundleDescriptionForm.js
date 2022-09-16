import React, {useEffect, useState} from "react";
import {
  FormControl,
  FormHelperText,
  Grid,
  TextField,
  InputAdornment
} from "@material-ui/core";
import clsx from "clsx";
import {makeStyles} from "@material-ui/core/styles";
import RichText from "../RichText";

const useStyles = makeStyles((theme) => ({
  formControl: {
    width: '100%',
    maxWidth: '620px'
  },
  rte: {
    border: '1px solid black'
  }
}));

const BundleDescriptionForm = (props) => {

  const classes = useStyles();

  const [initialized, setInitialized] = useState(false);
  const [, setDescription] = useState('');
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(0);
  const [descriptionData, setDescriptionData] = useState('');
  const [error, setError] = useState(false);
  const [, setState] = useState({});

  const updateState = (newState) => {
    setState((prevState) => {
      newState = {...prevState, ...newState};
      return newState;
    });
    if ('onChange' in props) {
      props.onChange(newState);
    }
  }

  const onDescriptionChangeHandler = (content) => {
    updateState({description: content});
    setDescription(content);
  }

  const onMinChangeHandler = (e) => {
    e.preventDefault();
    updateState({min: e.target.value});
    setMin(e.target.value);
  }

  const onMaxChangeHandler = (e) => {
    e.preventDefault();
    updateState({max: e.target.value});
    setMax(e.target.value);
  }

  useEffect(() => {
    setError(Boolean(props.error));
  }, [props.error]);

  useEffect(() => {
    if (!initialized && 'id' in props.description) {
      if (props.description && 'description' in props.description) {
        setDescription(props.description.description);
        setDescriptionData(props.description.description);
      }
      if (props.description && 'min' in props.description) {
        setMin(props.description.min);
      }
      if (props.description && 'max' in props.description) {
        setMax(props.description.max);
      }
      setState(props.description || {});
      setInitialized(true);
    }
  }, [props.description, initialized]);

  useEffect(() => {
    if (props.reset) {
      setDescription('');
      setDescriptionData(null);
      setMin(0);
      setMax(0);
    }
  }, [props.reset]);

  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={8}>
          <FormControl required={true} className={clsx(classes.formControl)}>
            <RichText content={descriptionData} onChange={onDescriptionChangeHandler}/>
          </FormControl>
          <FormHelperText>Description of weighted range</FormHelperText>
        </Grid>
        <Grid item xs={12} sm={2}>
          <FormControl required={true} className={clsx(classes.formControl)}>
            <TextField
              error={error}
              required={true}
              label="Min"
              type="number"
              inputProps={{
                min: 0,
                max: 100,
              }}
              InputProps={{
                startAdornment: <InputAdornment position="start">%</InputAdornment>
              }}
              value={min}
              variant="outlined"
              placeholder="Min"
              onChange={onMinChangeHandler}
            />
          </FormControl>
          <FormHelperText>Range minimum</FormHelperText>
        </Grid>
        <Grid item xs={12} sm={2}>
          <FormControl required={true} className={clsx(classes.formControl)}>
            <TextField
              error={error}
              required={true}
              label="Max"
              type="number"
              inputProps={{
                min: 0,
                max: 100,
              }}
              InputProps={{
                startAdornment: <InputAdornment position="start">%</InputAdornment>
              }}
              value={max}
              variant="outlined"
              placeholder="Max"
              onChange={onMaxChangeHandler}
            />
          </FormControl>
          <FormHelperText>Range maximum</FormHelperText>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default React.memo(BundleDescriptionForm);
