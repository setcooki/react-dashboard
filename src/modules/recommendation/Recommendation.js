import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch, shallowEqual} from 'react-redux';
import {useHistory} from 'react-router-dom';
import {Grid, MenuItem, Select} from '@material-ui/core';
import {Backdrop} from '@material-ui/core';
import {CircularProgress} from '@material-ui/core';
import {TextField} from '@material-ui/core';
import {FormControl} from '@material-ui/core';
import {InputLabel} from '@material-ui/core';
import {FormHelperText} from '@material-ui/core';
import {Button} from '@material-ui/core';
import {Chip} from '@material-ui/core';
import {Autocomplete} from '@material-ui/lab';
import {makeStyles} from '@material-ui/core/styles';
import RichText from '../../components/RichText';
import {recommendationOperations} from '../../store/ducks/recommendation';
import App from '../../templates/App';
import AssetTable from '../../components/asset/AssetTable';
import ErrorMessage from '../../components/ErrorMessage';
import SuccessMessage from '../../components/SuccessMessage';
import SurveyBindingTable from '../../components/survey/SurveyBindingTable';
import {surveyTypes} from '../../store/ducks/survey';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  formControl: {
    width: '100%',
    maxWidth: '620px'
  },
  rte: {
    border: '1px solid black'
  }
}));

export default function Recommendations(props) {

  const {error, success, loading, runtime} = useSelector((state) => {
    return {
      error: state.recommendations.recommendation.error,
      success: state.recommendations.recommendation.success,
      loading: state.recommendations.recommendation.loading,
      runtime: state.runtime.runtime.data
    };
  }, shallowEqual);

  const history = useHistory();
  const classes = useStyles();
  const dispatch = useDispatch();

  const [id, setId] = useState('');
  const [uid, setUid] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState([]);
  const [assets, setAssets] = useState([]);
  const [bindings, setBindings] = useState([]);
  const [content, setContent] = useState('');
  const [contentData, setContentData] = useState('');
  const [categoryData, setCategoryData] = useState([]);
  const [tagData, setTagData] = useState([]);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [openErrorMessage, setOpenErrorMessage] = useState(false);
  const [openSuccessMessage, setOpenSuccessMessage] = useState(false);

  const onTitleChangeHandler = (e) => {
    e.preventDefault();
    setTitle(e.target.value);
  };

  const onContentChangeHandler = (content) => {
    setContent(content);
  };

  const onCategoryChangeHandler = (e) => {
    e.preventDefault();
    setCategory(e.target.value);
  }

  const onTagsChangeHandler = (e, values) => {
    e.preventDefault();
    setTags(values);
  }

  const onAssetsChangeHandler = (state) => {
    setAssets(prevState => state);
  }

  const onBindingsChangeHandler = (state) => {
    setBindings(prevState => state);
  }

  const onSubmitHandler = (e) => {
    e.preventDefault();
    let data = {
      title: title,
      content: content,
      category: category,
      tags: tags,
      assets: assets,
      bindings: bindings
    };
    if (id && uid) {
      dispatch(recommendationOperations.updateRecommendation(id, uid, data));
    } else {
      dispatch(recommendationOperations.createRecommendation(data)).then((state) => {
        if (state === true || (typeof (state) === 'object' && 'type' in state && state.type === surveyTypes.CREATE_RECOMMENDATION_SUCCESS)) {
          setTitle('');
          setContent('');
          setContentData(null);
          setCategory('');
          setTags([]);
          setAssets([]);
          setBindings([]);
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
    dispatch(recommendationOperations.fetchRecommendationTags()).then((data) => {
      setTagData(data);
    });
    dispatch(recommendationOperations.fetchRecommendationCategories()).then((data) => {
      setCategoryData(data);
    });
  }, [dispatch, runtime]);

  useEffect(() => {
    const m = history.location.pathname.match(/([0-9]+)\/([0-9a-z-]+)$/i);
    if (m !== null) {
      const id = parseInt(m[1]);
      const uid = m[2];
      setId(id);
      setUid(uid);
      dispatch(recommendationOperations.fetchRecommendation(id, uid)).then((data) => {
        setTitle(data.title);
        setContent(data.content);
        setContentData(data.content);
        setCategory(data.category_uid);
        setTags(data.tags.map(tag => tag.name));
        setAssets(data.assets);
        setBindings(data.bindings);
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
        <form autoComplete="on" onSubmit={onSubmitHandler}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl required={true} variant="outlined" className={clsx(classes.formControl)}>
                <TextField
                  required={true}
                  label="Title"
                  value={title}
                  variant="outlined"
                  onChange={onTitleChangeHandler}
                />
              </FormControl>
              <FormHelperText>The title of the recommendation</FormHelperText>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl required={false} variant="outlined" className={clsx(classes.formControl)}>
                <InputLabel id="category-helper-label">Category</InputLabel>
                <Select
                  labelId="category-helper-label"
                  required={false}
                  value={category}
                  label="Category"
                  onChange={onCategoryChangeHandler}
                >
                  {categoryData.map((category) => {
                    return (<MenuItem key={category.uid} value={category.uid}>{category.name}</MenuItem>);
                  })}
                </Select>
              </FormControl>
              <FormHelperText>Choose a category</FormHelperText>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl className={clsx(classes.formControl)}>
                <Autocomplete
                  multiple
                  freeSolo
                  limitTags={10}
                  options={tagData.map((option) => option.name)}
                  value={tags}
                  onChange={onTagsChangeHandler}
                  renderTags={(value, getTagProps) =>
                    (value || []).map((option, index) => (
                      <Chip variant="outlined" label={option} {...getTagProps({index})} />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      required={false}
                      {...params || {}}
                      variant="outlined"
                      label="Tags"
                      placeholder="Tags"
                    />
                  )}
                />
              </FormControl>
              <FormHelperText>Choose optional tags</FormHelperText>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl required={true} className={clsx(classes.formControl)}>
                <RichText
                  content={contentData}
                  onChange={onContentChangeHandler}
                />
              </FormControl>
              <FormHelperText>Describe the recommendation in detail</FormHelperText>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <AssetTable assets={assets} onChange={onAssetsChangeHandler}/>
              <FormHelperText>Add external assets to your recommendation</FormHelperText>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <SurveyBindingTable bindings={bindings} onChange={onBindingsChangeHandler}/>
              <FormHelperText>Bind recommendation to survey questions, pages, groups and/or tags</FormHelperText>
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
