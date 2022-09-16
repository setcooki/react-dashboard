import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch, shallowEqual} from 'react-redux';
import {useHistory} from 'react-router-dom';
import {Grid} from '@material-ui/core';
import {Backdrop} from '@material-ui/core';
import {CircularProgress} from '@material-ui/core';
import {Button} from '@material-ui/core';
import App from '../../templates/App';
import ErrorMessage from '../../components/ErrorMessage';
import AssetForm from '../../components/asset/AssetForm';
import SuccessMessage from '../../components/SuccessMessage';
import {assetOperations} from '../../store/ducks/asset';
import {surveyTypes} from '../../store/ducks/survey';

export default function Asset(props) {

  const {error, success, loading} = useSelector((state) => {
    return {
      error: state.assets.asset.error,
      success: state.assets.asset.success,
      loading: state.assets.asset.loading
    };
  }, shallowEqual);

  const history = useHistory();
  const dispatch = useDispatch();

  const [id, setId] = useState('');
  const [uid, setUid] = useState('');
  const [asset, setAsset] = useState({});
  const [reset, setReset] = useState(false);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [openErrorMessage, setOpenErrorMessage] = useState(false);
  const [openSuccessMessage, setOpenSuccessMessage] = useState(false);

  const onAssetsChangeHandler = (newState) => {
    setAsset(newState);
  }

  const onSubmitHandler = (e) => {
    e.preventDefault();
    let data = asset;
    if (id && uid) {
      dispatch(assetOperations.updateAsset(id, uid, data));
    } else {
      dispatch(assetOperations.createAsset(data)).then((state) => {
        if (state === true || (typeof (state) === 'object' && 'type' in state && state.type === surveyTypes.CREATE_ASSET_SUCCESS)) {
          setReset(true);
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
      dispatch(assetOperations.fetchAsset(id, uid)).then((data) => {
        setAsset({
          id: data.id,
          title: data.title,
          type: data.type,
          description: data.description,
          url: data.url
        })
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
              <AssetForm asset={asset} reset={reset} collapse={true} onChange={onAssetsChangeHandler}/>
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
}
