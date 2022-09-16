import React, {useEffect, useState} from 'react';
import {
  Checkbox,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,
  TextField
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

const SurveyBindingTypeQuestionScore = (props) => {

  const classes = useStyles();

  const [matrix, setMatrix] = useState({});
  const [state, setState] = useState({});
  const [tree, setTree] = useState([]);
  const [question, setQuestion] = useState('');
  const [operator, setOperator] = useState('');
  const [score, setScore] = useState('');
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

  const onQuestionChangeHandler = (e) => {
    e.preventDefault();
    updateState({condition: e.target.value});
    setQuestion(e.target.value);
  }

  const onOperatorChangeHandler = (e) => {
    e.preventDefault();
    updateState({operator: e.target.value});
    setOperator(e.target.value);
  }

  const onScoreChangeHandler = (e) => {
    e.preventDefault();
    updateState({value: e.target.value});
    setScore(e.target.value);
  }

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
    if (props.survey && 'object' in props.survey) {
      setMatrix(surveyMatrix(props.survey.object));
      setTree(surveyTree.byQuestion(props.survey.object));
    }
  }, [props.survey]);

  useEffect(() => {
    if (props.binding && 'condition' in props.binding) {
      setQuestion(props.binding.condition);
    }
    if (props.binding && 'operator' in props.binding) {
      setOperator(props.binding.operator);
    }
    if (props.binding && 'value' in props.binding) {
      setScore(props.binding.value);
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
            <InputLabel id="question-score-helper-label">Question</InputLabel>
            <Select
              labelId="question-score-helper-label"
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
          <FormControl required={true} variant="outlined" disabled={false} className={clsx(classes.formControl)}>
            <InputLabel id="operator-helper-label">Operator</InputLabel>
            <Select
              labelId="operator-helper-label"
              required={true}
              label="Operator"
              value={operator}
              onChange={onOperatorChangeHandler}
            >
              <MenuItem value="=="><strong>==</strong>&nbsp;(<em>Equal</em>)</MenuItem>
              <MenuItem value="!="><strong>!=</strong>&nbsp;(<em>Not equal</em>)</MenuItem>
              <MenuItem value=">"><strong>></strong>&nbsp;(<em>Greater</em>)</MenuItem>
              <MenuItem value="<"><strong>&#60;</strong>&nbsp;(<em>Lesser</em>)</MenuItem>
              <MenuItem value=">="><strong>>=</strong>&nbsp;(<em>Greater than equal</em>)</MenuItem>
              <MenuItem value="<="><strong>&#60;=</strong>&nbsp;(<em>Lesser than equal</em>)</MenuItem>
              <MenuItem value="<>"><strong>&#60;></strong>&nbsp;(<em>Between</em>)</MenuItem>
            </Select>
          </FormControl>
          <FormHelperText>Choose the operator</FormHelperText>
        </Grid>
        <Grid item xs={12} md={2}>
          <FormControl className={clsx(classes.formControl)}>
            <TextField
              required={true}
              label="Score"
              placeholder="Score"
              variant="outlined"
              value={score}
              onChange={onScoreChangeHandler}
            />
          </FormControl>
          <FormHelperText>The score</FormHelperText>
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

export default React.memo(SurveyBindingTypeQuestionScore);
