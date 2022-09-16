import React, {useEffect, useState} from 'react';
import App from '../../templates/App';
import MaterialTable, {MTableToolbar} from 'material-table';
import {Backdrop, Button, Typography} from '@material-ui/core';
import {Link as HTMLLink} from '@material-ui/core';
import {Box} from '@material-ui/core';
import clsx from 'clsx';
import CircularProgress from '@material-ui/core/CircularProgress';
import dataTableIcons from '../../utils/dataTableIcons';
import {Link, useHistory} from 'react-router-dom';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import ErrorMessage from '../../components/ErrorMessage';
import Config from '../../class/Config';
import {assetOperations, assetTypes} from '../../store/ducks/asset';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import {default as constants} from '../../constants/constants';
import ConfirmDialog from '../../components/ConfirmDialog';
import Api from "../../class/Api";
import LinkOffIcon from '@material-ui/icons/LinkOff';
import LinkIcon from '@material-ui/icons/Link';

const useStyles = makeStyles((theme) => ({
  addWrapper: {
    marginBottom: theme.spacing(2),
    textAlign: 'right'
  }
}));

export default function Assets(props) {

  let {data, error, loading, runtime} = useSelector((state) => {
    return {
      data: state.assets.asset.data,
      error: state.assets.asset.error,
      loading: state.assets.asset.loading,
      runtime: state.runtime.runtime.data
    };
  }, shallowEqual);

  const dispatch = useDispatch();
  const classes = useStyles();
  const history = useHistory();

  const [checkData, setCheckData] = useState(false);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [currentItem, setCurrentItem] = useState({});
  const [openErrorMessage, setOpenErrorMessage] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const icons = dataTableIcons;

  const columns = () => {
    let columns = [{
      width: 50,
      field: 'id',
      title: 'ID'
    }, {
      field: 'type',
      title: 'Type',
      render: (data) => {
        if (typeof data === 'string') {
          return data;
        } else {
          return (data.type in constants.ASSET_TYPES) ? constants.ASSET_TYPES[data.type] : <em>n/a</em>;
        }
      }
    }, {
      field: 'title',
      title: 'Title'
    }, {
      field: 'url',
      title: 'URL',
      render: (data) => {
        return <HTMLLink href={data.url} target="_blank" rel="noopener">{data.url}</HTMLLink>
      }
    }, {
      field: 'updated_at',
      title: 'Last update',
      type: 'datetime'
    }, {
      field: null,
      title: 'URL Check',
      hidden: !checkData,
      sorting: false,
      render: (data) => {
        if ('check' in data) {
          return ((![200, 201, 202, 203, 206, 226].includes(data.check) || data.check === false) ?
              <Box><LinkOffIcon color="error"/><Typography variant="caption" display="block"
                                                           color="error">{(data.check === false) ? '' : data.check}</Typography></Box> :
              <LinkIcon color="primary"/>
          );
        } else {
          return '';
        }
      }
    }]
    if ('tenant' in runtime && runtime.tenant) {
      columns.splice(1, 0, {
        field: 'tid',
        title: 'Tenant',
        render: (data) => {
          let tenant = (Config.get('tenants', []).find(tenant => tenant.id === data.tid));
          if (tenant) {
            return tenant.name;
          } else {
            return data.tid;
          }
        }
      });
    }
    return columns;
  };

  const options = {
    search: true,
    pageSize: 10,
    pageSizeOptions: [10, 20, 50, 100],
    grouping: true,
    exportButton: true,
    actionsColumnIndex: -1,
    selection: true
  };

  const actions = [{
    tooltip: 'Check if URL´s resolve',
    icon: dataTableIcons.Link,
    onClick: (e, data) => onCheckHandler(e, data)
  }, {
    icon: dataTableIcons.Edit,
    tooltip: '',
    onClick: (e, rowData) => onUpdateHandler(e, rowData),
    position: 'row'
  }, {
    icon: dataTableIcons.Delete,
    tooltip: '',
    onClick: (e, rowData) => onDeleteHandler(e, rowData),
    position: 'row'
  }];

  const components = {
    Toolbar: props => (
      <div>
        <div className={clsx(classes.addWrapper)}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleOutlineIcon/>}
            component={Link}
            to="/asset"
          >
            New
          </Button>
        </div>
        <MTableToolbar {...props} />
      </div>
    )
  };

  const onCheckHandler = (e, rowData) => {
    setCheckData(true);
    rowData.forEach((d) => {
      Api.checkUrl(d.url).then((result) => {
        const clone = [...data]
        clone.find(item => item.id === d.id).check = result;
        dispatch({
          type: assetTypes.FETCH_ASSET_SUCCESS,
          payload: {data: clone}
        });
      });
    });
  }

  const onUpdateHandler = (e, data) => {
    history.push(`/asset/${data.id}/${data.uid}`);
  };

  const onDeleteHandler = (e, data) => {
    e.preventDefault();
    setCurrentItem(data);
    setOpenConfirmDialog(true);
  };

  const onDeleteDialogConfirmHandler = () => {
    if (!('id' in currentItem) || ('id' in currentItem && !currentItem.id)) {
      return null;
    }
    if (!('uid' in currentItem) || ('uid' in currentItem && !currentItem.uid)) {
      return null;
    }
    dispatch(assetOperations.deleteAsset(currentItem.id, currentItem.uid)).then(() => {
      setOpenConfirmDialog(false);
    });
  };

  useEffect(() => {
    setOpenBackdrop(loading === true);
    setOpenErrorMessage(error !== null);
  }, [error, loading]);

  useEffect(() => {
    dispatch(assetOperations.fetchAssets());
  }, [dispatch]);

  return (
    <React.Fragment>
      <App>
        <ErrorMessage open={openErrorMessage}>
          {error ? error : ''}
        </ErrorMessage>
        <MaterialTable
          title="Assets"
          icons={icons}
          data={data}
          columns={columns()}
          options={options}
          components={components}
          actions={actions}
          style={{boxShadow: 'none'}}
        />
        <Backdrop open={openBackdrop}>
          <CircularProgress color="inherit"/>
        </Backdrop>
        <ConfirmDialog open={openConfirmDialog} closeHandler={() => setOpenConfirmDialog(false)}
                       confirmHandler={onDeleteDialogConfirmHandler}/>
      </App>
    </React.Fragment>
  )
};
