import React, {useCallback, useEffect, useState} from 'react';
import {Table} from '@material-ui/core';
import {TableHead} from '@material-ui/core';
import {TableRow} from '@material-ui/core';
import {TableCell} from '@material-ui/core';
import {TableBody} from '@material-ui/core';
import {IconButton} from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import AssetForm from "./AssetForm";
import {useHistory} from "react-router-dom";
import {assetOperations} from "../../store/ducks/asset";
import {shallowEqual, useDispatch, useSelector} from "react-redux";

const AssetTable = (props) => {

  const {runtime} = useSelector((state) => {
    return {
      runtime: state.runtime.runtime.data
    };
  }, shallowEqual);

  const history = useHistory();
  const dispatch = useDispatch();

  const [assets, setAssets] = useState([]);
  const [assetData, setAssetData] = useState([]);
  const [currentTenant, setCurrentTenant] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [reset, setReset] = useState(false);
  const isNew = (history.location.pathname.match(/([0-9]+)\/([0-9a-z-]+)$/i) === null);

  const onAssetChangeHandler = (asset, index) => {
    setAssets((prevState) => {
      if (index in prevState) {
        const state = prevState.map((item, i) => {
          return (i === index) ? {...item, ...asset} : item;
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

  const renderAsset = (item, index) => {
    return (
      <React.Fragment key={item.id || index}>
        <TableRow>
          <TableCell style={{paddingLeft: 0, paddingRight: 0}}>
            <AssetForm
              assets={assetData}
              asset={item}
              reset={reset}
              onChange={(asset) => onAssetChangeHandler(asset, index)}
            />
          </TableCell>
          <TableCell align="right" style={{width: '35px', paddingLeft: 0, paddingRight: 0}}>
            <IconButton aria-label="add" onClick={(e) => {
              e.preventDefault();
              return onRemoveAssetClickHandler(index);
            }}>
              <RemoveCircleOutlineIcon/>
            </IconButton>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }

  const onAddAssetClickHandler = (e) => {
    e.preventDefault();
    const state = {
      id: null,
      title: '',
      type: '',
      description: '',
      url: ''
    }
    setAssets(prevState => [...prevState, ...[state]]);
  }

  const onRemoveAssetClickHandler = (index) => {
    setAssets((prevState) => {
      const state = prevState.filter((item, i) => i !== index)
      if ('onChange' in props) {
        props.onChange(state);
      }
      return state;
    });
  }

  const reload = useCallback((params) => {
    dispatch(assetOperations.fetchAssets(params || {})).then((data) => {
      setAssetData(data);
    });
  }, [dispatch]);

  useEffect(() => {
    setReset(false);
    if (props.assets && props.assets.length && !initialized) {
      setAssets(props.assets);
      setCurrentTenant(props.assets[0].tid);
      setInitialized(true);
    } else if ((!props.assets || props.assets.length === 0)) {
      setReset(true);
    }
  }, [props.assets, initialized]);

  useEffect(() => {
    if (runtime.tenant) {
      if (isNew) {
        reload();
      }
    } else {
      setAssetData([]);
    }
  }, [runtime.tenant, reload, isNew]);

  useEffect(() => {
    if (currentTenant) {
      reload({tid: currentTenant});
    }
  }, [currentTenant, reload]);

  useEffect(() => {
    reload();
  }, [reload]);

  return (
    <React.Fragment>
      <Table aria-label="Asset table">
        <TableHead>
          <TableRow>
            <TableCell style={{paddingLeft: 0, paddingTop: 0, paddingBottom: 0}}>Assets</TableCell>
            <TableCell style={{paddingRight: 0, paddingTop: 0, paddingBottom: 0}} align="right">
              <IconButton aria-label="add" color="primary" onClick={onAddAssetClickHandler}>
                <AddCircleIcon/>
              </IconButton>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {assets.map((item, index) => renderAsset(item, index))}
        </TableBody>
      </Table>
    </React.Fragment>
  );
}

export default React.memo(AssetTable);
