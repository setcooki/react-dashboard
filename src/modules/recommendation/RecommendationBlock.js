import React, {useEffect, useCallback, useState} from 'react';
import App from '../../templates/App';
import {Backdrop, FormControl, FormHelperText, InputLabel, MenuItem, Select} from '@material-ui/core';
import {Button} from '@material-ui/core';
import {CircularProgress} from '@material-ui/core';
import {Grid} from '@material-ui/core';
import {TextField} from '@material-ui/core';
import {useHistory} from 'react-router-dom';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {recommendationOperations} from '../../store/ducks/recommendation';
import ErrorMessage from '../../components/ErrorMessage';
import SuccessMessage from '../../components/SuccessMessage';
import {surveyOperations, surveyTypes} from '../../store/ducks/survey';
import {makeStyles} from '@material-ui/core/styles';
import clsx from 'clsx';
import RichText from "../../components/RichText";

const useStyles = makeStyles((theme) => ({
  formControl: {
    width: '100%',
    maxWidth: '620px'
  },
  hide: {
    display: 'none'
  },
  show: {
    display: 'block'
  }
}));

export default function RecommendationBlock(props) {

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
  const [survey, setSurvey] = useState('');
  const [surveys, setSurveys] = useState([]);
  const [surveyDisabled, setSurveyDisabled] = useState(false);
  const [bundle, setBundle] = useState('');
  const [bundles, setBundles] = useState([]);
  const [bundleDisabled, setBundleDisabled] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionData, setDescriptionData] = useState('');
  const [weight, setWeight] = useState('');
  const [toggleClass, setToggleClass] = useState(classes.hide);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [openErrorMessage, setOpenErrorMessage] = useState(false);
  const [openSuccessMessage, setOpenSuccessMessage] = useState(false);

  const onSurveyChangeHandler = (e) => {
    e.preventDefault();
    setSurvey(e.target.value);
    loadBundles(e.target.value);
  }

  const onBundleChangeHandler = (e) => {
    e.preventDefault();
    setBundle(e.target.value);
  }

  const onNameChangeHandler = (e) => {
    e.preventDefault();
    setName(e.target.value);
  };

  const onDescriptionChangeHandler = (description) => {
    setDescription(description);
  };

  const onWeightChangeHandler = (e) => {
    e.preventDefault();
    setWeight(e.target.value);
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    let data = {
      survey: survey,
      bundle: bundle,
      name: name,
      description: description,
      weight: weight
    };
    if (id && uid) {
      dispatch(recommendationOperations.updateRecommendationBlock(id, uid, data));
    } else {
      dispatch(recommendationOperations.createRecommendationBlock(data)).then((state) => {
        if (state === true || (typeof (state) === 'object' && 'type' in state && state.type === surveyTypes.CREATE_RECOMMENDATION_SUCCESS)) {
          setSurvey('');
          setBundle('');
          setName('');
          setDescription('');
          setWeight('');
        }
      });
    }
    return false;
  };

  const loadBundles = useCallback((survey) => {
    dispatch(recommendationOperations.fetchRecommendationBundles({survey: survey})).then((data) => {
      setBundles(data);
      setBundleDisabled(false);
    });
  }, [dispatch]);

  useEffect(() => {
    if (survey && bundle) {
      setToggleClass(classes.show);
    } else {
      setToggleClass(classes.hide);
    }
  }, [survey, bundle, classes]);

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
      dispatch(recommendationOperations.fetchRecommendationBlock(id, uid)).then((data) => {
        setSurvey(data.survey_uid);
        setBundle(data.bundle_uid);
        setName(data.name);
        setDescription(data.description);
        setDescriptionData(data.description);
        setWeight(data.weight);
        setSurveyDisabled(true);
      });
    }
  }, [dispatch, history]);

  useEffect(() => {
    if (survey) {
      loadBundles(survey);
    }
  }, [loadBundles, survey]);

  useEffect(() => {
    dispatch(surveyOperations.fetchSurveys()).then((data) => {
      setSurveys(data);
    });
  }, [dispatch]);

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
              <FormControl disabled={surveyDisabled} required={true} variant="outlined"
                           className={clsx(classes.formControl)}>
                <InputLabel id="survey-helper-label">Survey</InputLabel>
                <Select
                  labelId="survey-helper-label"
                  required={true}
                  value={survey}
                  label="Survey"
                  onChange={onSurveyChangeHandler}
                >
                  {surveys.map((survey) => {
                    return (<MenuItem key={survey.uid} value={survey.uid}>{survey.title}</MenuItem>);
                  })}
                </Select>
              </FormControl>
              <FormHelperText>Choose a survey</FormHelperText>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl disabled={bundleDisabled} required={true} variant="outlined"
                           className={clsx(classes.formControl)}>
                <InputLabel id="bundle-helper-label">Bundle</InputLabel>
                <Select
                  labelId="bundle-helper-label"
                  required={true}
                  value={bundle}
                  label="Bundle"
                  onChange={onBundleChangeHandler}
                >
                  {bundles.map((bundle) => {
                    return (<MenuItem key={bundle.uid} value={bundle.uid}>{bundle.name}</MenuItem>);
                  })}
                </Select>
              </FormControl>
              <FormHelperText>Choose a bundle</FormHelperText>
            </Grid>
          </Grid>
          <Grid item xs={12} className={toggleClass}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl required={true} variant="outlined" className={clsx(classes.formControl)}>
                  <TextField
                    required={true}
                    label="Block name"
                    value={name}
                    variant="outlined"
                    onChange={onNameChangeHandler}
                  />
                </FormControl>
                <FormHelperText>The name of the block</FormHelperText>
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
                <FormHelperText>Optional description of block</FormHelperText>
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <FormControl className={clsx(classes.formControl)}>
                  <TextField
                    type="Number"
                    InputProps={{inputProps: {maxLength: 4, min: 0, max: 1000}}}
                    required={false}
                    label="Weight"
                    placeholder="Weight"
                    variant="outlined"
                    value={weight}
                    onChange={onWeightChangeHandler}
                  />
                </FormControl>
                <FormHelperText>Optional order/weight</FormHelperText>
              </Grid>
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
