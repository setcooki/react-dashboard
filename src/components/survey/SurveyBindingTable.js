import React, {useEffect, useState} from 'react';
import {useDispatch} from "react-redux";
import clsx from 'clsx';
import {
  Box,
  FormControl,
  IconButton,
  InputLabel,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Popover
} from "@material-ui/core";
import {Button, MenuItem} from "@material-ui/core";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import SurveyBindingForm from "./SurveyBindingForm";
import {surveyOperations} from "../../store/ducks/survey";
import {default as constants} from "../../constants/constants";
import {makeStyles} from "@material-ui/core/styles";
import {recommendationOperations} from "../../store/ducks/recommendation";

const useStyles = makeStyles((theme) => ({
  box: {
    padding: theme.spacing(2)
  },
  formControl: {
    display: 'block',
    width: '250px',
    marginBottom: theme.spacing(2)
  }
}));

const SurveyBindingTable = (props) => {

  const classes = useStyles();
  const dispatch = useDispatch();

  const [bindings, setBindings] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [surveys, setSurveys] = useState([]);
  const [survey, setSurvey] = useState('');
  const [bundle, setBundle] = useState('');
  const [bundles, setBundles] = useState([]);
  const [bundleDisabled, setBundleDisabled] = useState(true);
  const [block, setBlock] = useState('');
  const [blocks, setBlocks] = useState([]);
  const [blockDisabled, setBlockDisabled] = useState(true);
  const [type, setType] = useState('');
  const [initialized, setInitialized] = useState(false);

  const onBindingChangeHandler = (binding, index) => {
    setBindings((prevState) => {
      if (index in prevState) {
        const state = prevState.map((item, i) => {
          return (i === index) ? {...item, ...binding} : item;
        });
        if ('onChange' in props) {
          props.onChange(state);
        }
        return state;
      } else {
        return prevState;
      }
    });
  }

  const renderBinding = (item, index) => {
    const _survey = surveys.find((s) => s.id === item.survey_id);
    if (_survey) {
      return (
        <React.Fragment key={item.id || index}>
          <TableRow>
            <TableCell style={{paddingLeft: 0, paddingRight: 0}}>
              <SurveyBindingForm binding={item} survey={_survey} bundles={bundles} blocks={blocks}
                                 onChange={(binding) => onBindingChangeHandler(binding, index)}/>
            </TableCell>
            <TableCell align="right" style={{width: '35px', paddingLeft: 0, paddingRight: 0}}>
              <IconButton aria-label="remove" onClick={(e) => {
                e.preventDefault();
                return onRemoveBindingClickHandler(index);
              }}>
                <RemoveCircleOutlineIcon/>
              </IconButton>
            </TableCell>
          </TableRow>
        </React.Fragment>
      );
    } else {
      return null;
    }
  }

  const onRemoveBindingClickHandler = (index) => {
    setBindings((prevState) => {
      const state = prevState.filter((item, i) => i !== index)
      if ('onChange' in props) {
        props.onChange(state);
      }
      return state;
    });
  }

  const onAddBindingClickHandler = (e) => {
    e.preventDefault();
    setAnchorEl(e.currentTarget);
  };

  const onPopoverCloseHandler = (e) => {
    e.preventDefault();
    setAnchorEl(null);
  };

  const onBlockChangeHandler = (e) => {
    e.preventDefault();
    setBlock(e.target.value);
  }

  const onAddNewBindingClickHandler = (e) => {
    e.preventDefault();
    if (survey && type) {
      setAnchorEl(null);
      const state = {
        type: type,
        survey_id: survey,
        bundle_id: bundle,
        block_id: block,
        condition: null,
        operator: null,
        value: null,
        weight: null,
        enabled: true
      }
      setBindings(prevState => [...prevState, ...[state]]);
    }
  };

  const onSurveyChangeHandler = (e) => {
    e.preventDefault();
    setSurvey(e.target.value);
    dispatch(recommendationOperations.fetchRecommendationBundles({survey: e.target.value})).then((data) => {
      setBundles(data);
      setBundleDisabled(false);
      setBlock('');
    });
  };

  const onBundleChangeHandler = (e) => {
    e.preventDefault();
    setBundle(e.target.value);
    setBlockDisabled(false);
    setBlock('');
  };

  const onTypeChangeHandler = (e) => {
    e.preventDefault();
    setType(e.target.value);
  };

  useEffect(() => {
    if (survey && bundle) {
      dispatch(recommendationOperations.fetchRecommendationBlocks({survey: survey, bundle: bundle})).then((data) => {
        if (data && data.length) {
          setBlocks(data);
          setBlockDisabled(false);
        } else {
          setBlocks([]);
          setBlockDisabled(true);
        }
      });
    }
  }, [dispatch, survey, bundle]);

  useEffect(() => {
    if (props.bindings && props.bindings.length && !initialized) {
      setBindings(props.bindings || []);
      setInitialized(true);
    } else if (!props.bindings || (props.bindings && !props.bindings.length)) {
      setBindings([]);
    }
  }, [props.bindings, initialized]);

  useEffect(() => {
    dispatch(surveyOperations.fetchSurveys()).then((data) => {
      data.forEach((item, index, array) => {
        array[index].object = JSON.parse(item.object);
      });
      setSurveys(data);
    });

  }, [dispatch]);

  useEffect(() => {
    dispatch(recommendationOperations.fetchRecommendationBundles()).then((data) => {
      setBundles(data);
    });
    dispatch(recommendationOperations.fetchRecommendationBlocks()).then((data) => {
      setBlocks(data);
    });
  }, [dispatch]);

  return (
    <React.Fragment>
      <Table aria-label="Survey binding table">
        <TableHead>
          <TableRow>
            <TableCell style={{paddingLeft: 0, paddingTop: 0, paddingBottom: 0}}>Bindings</TableCell>
            <TableCell style={{paddingRight: 0, paddingTop: 0, paddingBottom: 0}} align="right">
              <IconButton aria-label="add" color="primary" onClick={onAddBindingClickHandler}>
                <AddCircleIcon/>
              </IconButton>
              <Popover
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center"
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
                onClose={onPopoverCloseHandler}
              >
                <Box className={clsx(classes.box)}>
                  <FormControl required={true} variant="outlined" className={clsx(classes.formControl)}>
                    <InputLabel id="binding-survey-helper-label">Survey</InputLabel>
                    <Select
                      style={{width: '100%'}}
                      labelId="binding-survey-helper-label"
                      required={true}
                      label="Survey"
                      value={survey}
                      onChange={onSurveyChangeHandler}
                    >
                      {surveys.map((item, index) => {
                        return (<MenuItem dense key={item.id} value={item.id}>{item.title}</MenuItem>)
                      })}
                    </Select>
                  </FormControl>
                  <FormControl required={true} variant="outlined" className={clsx(classes.formControl)}>
                    <InputLabel id="binding-bundle-helper-label">Bundle</InputLabel>
                    <Select
                      style={{width: '100%'}}
                      labelId="binding-bundle-helper-label"
                      required={true}
                      disabled={bundleDisabled}
                      label="Bundle"
                      value={bundle}
                      onChange={onBundleChangeHandler}
                    >
                      {bundles.map((item, index) => {
                        return (<MenuItem dense key={item.id} value={item.id}>{item.name}</MenuItem>)
                      })}
                    </Select>
                  </FormControl>
                  <FormControl required={false} variant="outlined" className={clsx(classes.formControl)}>
                    <InputLabel id="binding-block-helper-label">Block</InputLabel>
                    <Select
                      style={{width: '100%'}}
                      labelId="binding-block-helper-label"
                      required={true}
                      disabled={blockDisabled}
                      label="Block"
                      value={block}
                      onChange={onBlockChangeHandler}
                    >
                      {blocks.map((item, index) => {
                        return (<MenuItem dense key={item.id} value={item.id}>{item.name}</MenuItem>)
                      })}
                    </Select>
                  </FormControl>
                  <FormControl required={true} variant="outlined" className={clsx(classes.formControl)}>
                    <InputLabel id="binding-type-helper-label">Type</InputLabel>
                    <Select
                      style={{width: '100%'}}
                      labelId="binding-type-helper-label"
                      required={true}
                      label="Type"
                      value={type}
                      onChange={onTypeChangeHandler}
                    >
                      {Object.keys(constants.SURVEY_BINDING_TYPES).map((item, index) => {
                        return (
                          <MenuItem dense key={item} value={item}>{constants.SURVEY_BINDING_TYPES[item]}</MenuItem>);
                      })}
                    </Select>
                  </FormControl>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    startIcon={<AddCircleOutlineIcon/>}
                    onClick={onAddNewBindingClickHandler}
                  >Add</Button>
                </Box>
              </Popover>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bindings.map((item, index) => renderBinding(item, index))}
        </TableBody>
      </Table>
    </React.Fragment>
  );
}

export default React.memo(SurveyBindingTable);
