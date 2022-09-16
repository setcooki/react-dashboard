import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import App from '../../templates/App';
import * as SurveyCreator from 'survey-creator';
import * as SurveyKo from 'survey-knockout';
import 'survey-creator/survey-creator.css';
import 'jquery-ui/themes/base/all.css';
import 'nouislider/distribute/nouislider.css';
import 'select2/dist/css/select2.css';
import 'bootstrap-slider/dist/css/bootstrap-slider.css';

import 'jquery-bar-rating/dist/themes/css-stars.css';
import 'jquery-bar-rating/dist/themes/fontawesome-stars.css';

import $ from 'jquery';
import 'jquery-ui/ui/widgets/datepicker.js';
import 'select2/dist/js/select2.js';
import 'jquery-bar-rating';
import 'pretty-checkbox/dist/pretty-checkbox.css';

import '../../styles/surveyjs.scss';

import * as widgets from 'surveyjs-widgets';

import ErrorMessage from '../../components/ErrorMessage';
import SuccessMessage from '../../components/SuccessMessage';
import {
  Link,
  Backdrop,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  Grid,
  TextField
} from '@material-ui/core';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {surveyOperations, surveyTypes} from '../../store/ducks/survey';
import {makeStyles} from '@material-ui/core/styles';
import RichText from '../../components/RichText';
import clsx from 'clsx';

SurveyCreator.StylesManager.applyTheme("default");
widgets.prettycheckbox(SurveyKo);
widgets.select2(SurveyKo, $);
widgets.inputmask(SurveyKo);
//widgets.jquerybarrating(SurveyKo, $);
//widgets.jqueryuidatepicker(SurveyKo, $);
//widgets.nouislider(SurveyKo);
//widgets.select2tagbox(SurveyKo, $);
//widgets.signaturepad(SurveyKo);
//widgets.sortablejs(SurveyKo);
//widgets.ckeditor(SurveyKo);
widgets.autocomplete(SurveyKo, $);
//widgets.bootstrapslider(SurveyKo);

const surveyCreatorOptions = {
  showState: true,
  isAutoSave: true,
  showEmbededSurveyTab: false,
  showTestSurveyTab: false,
  showPagesToolbox: true,
  questionTypes: ["checkbox", "radiogroup", "dropdown"]
};

SurveyCreator.StylesManager.applyTheme("default");

SurveyKo.Serializer.addProperty("itemvalue", {
  name: 'score:Score',
  default: '',
  category: 'general'
});

SurveyKo.Serializer.addProperty("questionbase", {
  name: 'tags',
  default: ''
});

SurveyCreator.SurveyQuestionEditorDefinition.definition.question.properties.push("tags");
SurveyCreator.SurveyQuestionEditorDefinition.definition.question.properties.push("group");

SurveyKo.Serializer.removeProperty("selectbase", "choicesByUrl");
SurveyKo.Serializer.removeProperty("selectbase", "others");

const useStyles = makeStyles((theme) => ({
  formControl: {
    width: '100%',
    maxWidth: '620px'
  },
  rte: {
    border: '1px solid black'
  }
}));

export default function Survey(props) {

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

  const [id, setId] = useState('');
  const [uid, setUid] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionData, setDescriptionData] = useState('');
  const [options, setOptions] = useState('');
  const [text, setText] = useState('');
  const [creator, setCreator] = useState(null);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [openErrorMessage, setOpenErrorMessage] = useState(false);
  const [openSuccessMessage, setOpenSuccessMessage] = useState(false);

  const onTitleChangeHandler = (e) => {
    e.preventDefault();
    setTitle(e.target.value);
  };

  const onDescriptionChangeHandler = (description) => {
    setDescription(description);
  }

  const onOptionsChangeHandler = (e) => {
    e.preventDefault();
    setOptions(e.target.value);
  }

  const onSubmitHandler = (e) => {
    e.preventDefault();
    let data = {
      title: title,
      description: description,
      options: options,
      object: localStorage.getItem('currentSurvey') || ''
    };
    if (id && uid) {
      dispatch(surveyOperations.updateSurvey(id, uid, data));
    } else {
      dispatch(surveyOperations.createSurvey(data)).then((state) => {
        if (state === true || (typeof (state) === 'object' && 'type' in state && state.type === surveyTypes.CREATE_SURVEY_SUCCESS)) {
          setTitle('');
          setDescription('');
          setText('');
          setOptions('');
          localStorage.removeItem('currentSurvey');
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
    setCreator(new SurveyCreator.SurveyCreator(
      "survey-creator", surveyCreatorOptions
    ));
  }, []);

  useEffect(() => {
    if (creator) {
      creator.saveSurveyFunc = (saveNo, callback) => {
        setText(creator.text || '');
        callback(saveNo, true);
      };
    }
  }, [creator]);

  useEffect(() => {
    localStorage.setItem('currentSurvey', text || '');
  }, [text]);

  useEffect(() => {
    const m = history.location.pathname.match(/([0-9]+)\/([0-9a-z-]+)$/i);
    if (m !== null) {
      const id = parseInt(m[1]);
      const uid = m[2];
      setId(id);
      setUid(uid);
      dispatch(surveyOperations.fetchSurvey(id, uid)).then((data) => {
        setTitle(data.title);
        setDescription(data.description);
        setOptions(data.options);
        setDescriptionData(data.description);
        if (creator) {
          setText(data.object);
          creator.text = data.object;
          localStorage.setItem('currentSurvey', data.object);
        }
      });
    }
  }, [dispatch, history, creator]);

  useEffect(() => {
    dispatch(surveyOperations.fetchSurveyGroups()).then((data) => {
      if (data) {
        let choices = data.map((d) => {
          return {value: d.id, text: d.name}
        });
        choices.unshift({value: '', text: ''});
        SurveyKo.Serializer.removeProperty("questionbase", "group");
        SurveyKo.Serializer.addProperty("questionbase", {
          name: 'group',
          default: '',
          choices: choices
        });
      }
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
              <FormControl required={true} className={clsx(classes.formControl)}>
                <TextField
                  required={true}
                  label="Title"
                  value={title}
                  variant="outlined"
                  onChange={onTitleChangeHandler}
                />
              </FormControl>
              <FormHelperText>The title of the survey</FormHelperText>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl className={clsx(classes.formControl)}>
                <RichText
                  content={descriptionData}
                  onChange={onDescriptionChangeHandler}
                />
              </FormControl>
              <FormHelperText>Description of the survey</FormHelperText>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <div id="survey-creator" style={{minWidth: '920px'}}></div>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl required={false} className={clsx(classes.formControl)}>
                <TextField
                  multiline
                  rows={5}
                  required={false}
                  label="Options"
                  value={options}
                  variant="outlined"
                  onChange={onOptionsChangeHandler}
                />
              </FormControl>
              <FormHelperText>Optional survey option properties as defined <Link
                href="https://www.surveyjs.io/Documentation/Library/?id=surveymodel">here</Link>. Separate each option
                as key: value pair in new line</FormHelperText>
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
