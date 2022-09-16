import React, {useEffect, useState} from 'react';
import App from '../../templates/App';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {useHistory} from 'react-router-dom';
import {surveyOperations, surveyTypes} from '../../store/ducks/survey';
import ErrorMessage from '../../components/ErrorMessage';
import SuccessMessage from '../../components/SuccessMessage';
import {
  Backdrop,
  Button,
  CircularProgress,
  FormControl, FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from '@material-ui/core';
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
    display: 'flex'
  }
}));

export default function SurveyGroup(props) {

  const {error, success, loading} = useSelector((state) => {
    return {
      error: state.surveys.survey.error,
      success: state.surveys.survey.success,
      loading: state.surveys.survey.loading
    };
  }, shallowEqual);

  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const [id, setId] = useState(null);
  const [uid, setUid] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionData, setDescriptionData] = useState('');
  const [survey, setSurvey] = useState('');
  const [surveys, setSurveys] = useState([]);
  const [surveyDisabled, setSurveyDisabled] = useState(false);
  const [nameContainerClass, setNameContainerClass] = useState(classes.hide);
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

  const onSurveyChangeHandler = (e) => {
    e.preventDefault();
    setSurvey(e.target.value);
  }

  const onSubmitHandler = (e) => {
    e.preventDefault();
    let data = {
      survey: survey,
      name: name,
      description: description,
    };
    if (id && uid) {
      dispatch(surveyOperations.updateSurveyGroup(id, uid, data))
    } else {
      dispatch(surveyOperations.createSurveyGroup(data)).then((state) => {
        if (state === true || (typeof (state) === 'object' && 'type' in state && state.type === surveyTypes.CREATE_SURVEY_SUCCESS)) {
          setSurvey('');
          setName('');
          setDescription('');
        }
      });
    }
    return false;
  };

  useEffect(() => {
    if (survey) {
      setNameContainerClass(classes.show);
    } else {
      setNameContainerClass(classes.hide);
    }
  }, [survey, classes]);

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
      dispatch(surveyOperations.fetchSurveyGroup(id, uid)).then((data) => {
        setSurvey(data.survey_uid);
        setName(data.name);
        setDescription(data.description);
        setDescriptionData(data.description);
        setSurveyDisabled(true);
      });
    }
  }, [dispatch, history]);

  useEffect(() => {
    dispatch(surveyOperations.fetchSurveys()).then((data) => {
      setSurveys(data);
    })
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
          <Grid container spacing={3} className={nameContainerClass}>
            <Grid item xs={12}>
              <FormControl required={true} className={clsx(classes.formControl)}>
                <TextField
                  required={true}
                  label="Group name"
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
};
