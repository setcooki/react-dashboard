import React, {useEffect, useState} from 'react';
import {Grid} from '@material-ui/core';
import {Typography} from '@material-ui/core';
import SurveyBindingTypeQuestionChoice from "./SurveyBindingTypeQuestionChoice";
import SurveyBindingTypeGroup from "./SurveyBindingTypeGroup";
import SurveyBindingTypePage from "./SurveyBindingTypePage";
import SurveyBindingTypeQuestionScore from "./SurveyBindingTypeQuestionScore";
import SurveyBindingTypeTag from "./SurveyBindingTypeTag";

const SurveyBindingForm = (props) => {

  const [binding, setBinding] = useState({});
  const [survey, setSurvey] = useState([]);
  const [bundles, setBundles] = useState([]);
  const [blocks, setBlocks] = useState([]);

  const renderBinding = () => {
    let type = binding.type;
    if (!type) {
      type = 'group';
    }
    switch (type) {
      case 'group':
        return (<SurveyBindingTypeGroup binding={binding} survey={survey} onChange={onBindingChangeHandler}/>);
      case 'page':
        return (<SurveyBindingTypePage binding={binding} survey={survey} onChange={onBindingChangeHandler}/>);
      case 'question_choice':
        return (<SurveyBindingTypeQuestionChoice binding={binding} survey={survey}
                                                 onChange={onBindingChangeHandler}/>);
      case 'question_score':
        return (<SurveyBindingTypeQuestionScore binding={binding} survey={survey}
                                                onChange={onBindingChangeHandler}/>)
      case 'tag':
        return (<SurveyBindingTypeTag binding={binding} survey={survey} onChange={onBindingChangeHandler}/>)
      default:
        return null;
    }
  };

  const onBindingChangeHandler = (newBinding) => {
    setBinding((prevState) => {
      newBinding = {...prevState, ...newBinding};
      return newBinding;
    });
    if ('onChange' in props) {
      props.onChange(newBinding);
    }
  }

  const bundleName = () => {
    if (bundles) {
      let bundle = bundles.find(bundle => bundle.id === binding.bundle_id);
      if (bundle) {
        return bundle.name;
      }
    }
    return '';
  }

  const blockName = () => {
    if (blocks) {
      let block = blocks.find(block => block.id === binding.block_id);
      if (block) {
        return block.name;
      }
    }
    return '';
  }

  useEffect(() => {
    setSurvey(props.survey || []);
  }, [props.survey]);

  useEffect(() => {
    setBundles(props.bundles || []);
  }, [props.bundles]);

  useEffect(() => {
    setBlocks(props.blocks || []);
  }, [props.blocks]);

  useEffect(() => {
    setBinding(props.binding || {});
  }, [props.binding]);

  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography color="primary" style={{fontSize: 12}}>Binding for
            survey: <strong>{survey.title}</strong>, Bundle: <strong>{bundleName()}</strong>,
            Block: <strong>{blockName()}</strong></Typography>
        </Grid>
        <Grid item xs={12}>
          {renderBinding()}
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default React.memo(SurveyBindingForm);
