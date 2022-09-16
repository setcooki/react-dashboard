import React, {useEffect, useState} from 'react';
import {
  Checkbox,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select, TextField
} from "@material-ui/core";
import clsx from "clsx";
import {default as surveyTree} from "../../functions/surveyTree";
import {makeStyles} from "@material-ui/core/styles";
import {surveyMatrix} from "../../functions/surveyMatrix";

const useStyles = makeStyles((theme) => ({
  formControl: {
    width: '100%',
    maxWidth: '620px'
  }
}));

const SurveyBindingTypeQuestionChoice = (props) => {

  const classes = useStyles();

  const [matrix, setMatrix] = useState({});
  const [state, setState] = useState({});
  const [tree, setTree] = useState([]);
  const [choices, setChoices] = useState([]);
  const [choice, setChoice] = useState('');
  const [question, setQuestion] = useState('');
  const [weight, setWeight] = useState('');
  const [enabled, setEnabled] = useState(true);

  const StateHolder = () => {
    return null
  }

  const updateState = (newState) => {
    setState((prevState) => {
      newState = {...prevState, ...newState};
      if ('onChange' in props) {
        props.onChange(newState);
      }
      return newState;
    });
  }

  const onQuestionChangeHandler = (e, props) => {
    e.preventDefault();
    let choices = tree[props.key].choices;
    updateState({condition: e.target.value});
    updateState({operator: '=='});
    setChoices(choices);
    setQuestion(e.target.value);
  }

  const onChoiceChangeHandler = (e) => {
    e.preventDefault();
    updateState({value: e.target.value});
    setChoice(e.target.value);
  };

  const onWeightChangeHandler = (e) => {
    e.preventDefault();
    updateState({weight: e.target.value});
    setWeight(e.target.value);
  }

  const onEnabledChangeHandler = (e) => {
    e.preventDefault();
    updateState({enabled: e.target.checked});
    setEnabled(e.target.checked);
  }

  useEffect(() => {
    if (props.survey && 'object' in props.survey && props.binding) {
      const tree = surveyTree.byQuestion(props.survey.object);
      setTree(tree);
      for (let item of tree) {
        if (item.value === props.binding.condition) {
          setChoices(item.choices);
          break;
        }
      }
    }
  }, [props.survey, props.binding]);

  useEffect(() => {
    if (props.survey && 'object' in props.survey) {
      setMatrix(surveyMatrix(props.survey.object));
    }
  }, [props.survey]);

  useEffect(() => {
    if (props.binding && 'condition' in props.binding) {
      setQuestion(props.binding.condition);
    }
    if (props.binding && 'value' in props.binding) {
      setChoice(props.binding.value);
    }
    if (props.binding && 'weight' in props.binding) {
      setWeight(props.binding.weight);
    }
    if (props.binding && 'enabled' in props.binding) {
      setEnabled(props.binding.enabled);
    }
    setState(props.binding || {});
  }, [props.binding]);

  return (
    <React.Fragment>
      <StateHolder state={state}/>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <FormControl required={true} variant="outlined" className={clsx(classes.formControl)}>
            <InputLabel id="question-choice-helper-label">Question</InputLabel>
            <Select
              id="question-choice"
              labelId="question-choice-helper-label"
              required={true}
              label="Question"
              value={question}
              autoWidth={true}
              onChange={onQuestionChangeHandler}
              style={{maxHeight: '57px'}}
            >
              {tree.map((item, key) => {
                const title = () => {
                  if (item.value in matrix.questions) {
                    return (
                      <span><strong>{item.title}</strong><br/>
                        <em style={{fontSize: 12}}>(Choices: {matrix.questions[item.value].choices},
                          Min. score: {matrix.questions[item.value].min},
                          Max. score: {matrix.questions[item.value].max},
                          Avg. score: {matrix.questions[item.value].avg})
                        </em>
                      </span>
                    );
                  } else {
                    return (item.title);
                  }
                };
                if (item.type === 'page') {
                  return (<ListSubheader key={key} disableSticky={true}>{`Page: ${item.title}`}</ListSubheader>)
                } else {
                  return (<MenuItem key={key} value={item.value}>{title()}</MenuItem>)
                }
              })}
            </Select>
          </FormControl>
          <FormHelperText>Select the question</FormHelperText>
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl required={false} variant="outlined" disabled={false}
                       className={clsx(classes.formControl)}>
            <InputLabel id="operator-helper-label">Operator</InputLabel>
            <Select
              required={true}
              labelId="operator-helper-label" red={false}
              label="Operator"
              value="=="
            >
              <MenuItem value="==">==</MenuItem>
            </Select>
          </FormControl>
          <FormHelperText>Choose the operator</FormHelperText>
        </Grid>
        <Grid item xs={12} md={2}>
          <FormControl required={true} variant="outlined" className={clsx(classes.formControl)}>
            <InputLabel id="choice-helper-label">Choice</InputLabel>
            <Select
              labelId="choice-helper-label"
              required={true}
              label="Choice"
              value={choice}
              onChange={onChoiceChangeHandler}
            >
              {choices.map((item, key) => {
                if (typeof item === 'object') {
                  return (
                    <MenuItem key={key}
                              value={item.value}>{(('text' in item) ? item.text : item.value)}</MenuItem>)
                } else {
                  return (<MenuItem key={key} value={item}>{item}</MenuItem>)
                }
              })}
            </Select>
          </FormControl>
          <FormHelperText>Select the answer/choice</FormHelperText>
        </Grid>
        <Grid item xs={12} md={2}>
          <FormControl className={clsx(classes.formControl)}>
            <TextField
              type="Number"
              InputProps={{inputProps: {maxLength: 3, min: 0, max: 100}}}
              required={false}
              label="Weight"
              placeholder="Weight"
              variant="outlined"
              value={weight}
              onChange={onWeightChangeHandler}
            />
          </FormControl>
          <FormHelperText>Optional display weight</FormHelperText>
        </Grid>
        <Grid item xs={12} md={1}>
          <FormControl>
            <Checkbox
              checked={Boolean(enabled)}
              disableRipple={true}
              required={false}
              value={1}
              onChange={onEnabledChangeHandler}
            />
          </FormControl>
          <FormHelperText>Enabled</FormHelperText>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default React.memo(SurveyBindingTypeQuestionChoice);
