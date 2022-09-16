import React, {useEffect, useState} from 'react';
import App from '../../templates/App';
import {Backdrop, FormControl, FormHelperText} from '@material-ui/core';
import {Button} from '@material-ui/core';
import {CircularProgress} from '@material-ui/core';
import {Grid} from '@material-ui/core';
import {TextField} from '@material-ui/core';
import {useHistory} from 'react-router-dom';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {recommendationOperations} from '../../store/ducks/recommendation';
import ErrorMessage from '../../components/ErrorMessage';
import SuccessMessage from '../../components/SuccessMessage';
import {surveyTypes} from '../../store/ducks/survey';
import {makeStyles} from '@material-ui/core/styles';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  formControl: {
    width: '100%',
    maxWidth: '620px'
  },
}));

export default function RecommendationCategory(props) {

  const {error, success, loading} = useSelector((state) => {
    return {
      error: state.recommendations.recommendation.error,
      success: state.recommendations.recommendation.success,
      loading: state.recommendations.recommendation.loading
    };
  }, shallowEqual);

  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const [id, setId] = useState(null);
  const [uid, setUid] = useState(null);
  const [name, setName] = useState('');
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [openErrorMessage, setOpenErrorMessage] = useState(false);
  const [openSuccessMessage, setOpenSuccessMessage] = useState(false);

  const onNameChangeHandler = (e) => {
    e.preventDefault();
    setName(e.target.value);
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    let data = {
      name: name,
    };
    if (id && uid) {
      dispatch(recommendationOperations.updateRecommendationCategory(id, uid, data));
    } else {
      dispatch(recommendationOperations.createRecommendationCategory(data)).then((state) => {
        if (state === true || (typeof (state) === 'object' && 'type' in state && state.type === surveyTypes.CREATE_RECOMMENDATION_SUCCESS)) {
          setName('');
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
      dispatch(recommendationOperations.fetchRecommendationCategory(id, uid)).then((data) => {
        setName(data.name);
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
                  label="Category name"
                  value={name}
                  variant="outlined"
                  onChange={onNameChangeHandler}
                />
              </FormControl>
              <FormHelperText>The name of the category</FormHelperText>
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
};
