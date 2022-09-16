import React, {useEffect, useState} from 'react';
import App from '../../templates/App';
import MaterialTable, {MTableToolbar} from 'material-table';
import {
  Backdrop,
  Chip,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select
} from '@material-ui/core';
import clsx from 'clsx';
import CircularProgress from '@material-ui/core/CircularProgress';
import dataTableIcons from '../../utils/dataTableIcons';
import {Link, useHistory} from 'react-router-dom';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import ErrorMessage from '../../components/ErrorMessage';
import Config from '../../class/Config';
import {surveyOperations} from '../../store/ducks/survey';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import ConfirmDialog from '../../components/ConfirmDialog';
import PowerIcon from '@material-ui/icons/Power';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import * as Survey from 'survey-react';
import 'survey-react/survey.css';

const useStyles = makeStyles((theme) => ({
  addWrapper: {
    marginBottom: theme.spacing(2),
    textAlign: 'right'
  }
}));

export default function Surveys(props) {

  const {data, error, loading, runtime} = useSelector((state) => {
    return {
      data: state.surveys.survey.data,
      error: state.surveys.survey.error,
      loading: state.surveys.survey.loading,
      runtime: state.runtime.runtime.data
    };
  }, shallowEqual);

  const dispatch = useDispatch();
  const classes = useStyles();
  const history = useHistory();

  const [openPreviewDialog, setOpenPreviewDialog] = useState(false);
  const [openConnectDialog, setOpenConnectDialog] = useState(false);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [currentItem, setCurrentItem] = useState({});
  const [openErrorMessage, setOpenErrorMessage] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [surveyPreview, setSurveyPreview] = useState(null);
  const [client, setClient] = useState('');
  const [reload, setReload] = useState(false);

  const icons = dataTableIcons;

  const columns = () => {
    let columns = [{
      width: 50,
      field: 'id',
      title: 'ID'
    }, {
      field: 'title',
      title: 'Title'
    }, {
      field: '',
      title: 'Connect',
      render: (data) => {
        if ('clients' in data && data.clients.length) {
          const clients = Config.get('clients', []) || [];
          const client = clients.filter((client) => client.id === data.clients[0]);
          return (
            <Chip
              color="primary"
              variant="outlined"
              icon={<PowerIcon/>}
              label={(client.length) ? client[0].name : 'Connected'}
            />);
        } else {
          return (<Chip
            label="Connect"
            variant="outlined"
            icon={<PowerIcon/>}
            onClick={(e) => {
              setCurrentItem(data);
              onConnectButtonClickHandler(e);
            }}
          />);
        }
      },
      sorting: false
    }, {
      field: 'updated_at',
      title: 'Last update',
      type: 'datetime'
    }];
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
    exportButton: true,
    actionsColumnIndex: -1
  };

  const actions = [rowData => ({
    icon: dataTableIcons.Preview,
    tooltip: '',
    onClick: onPreviewHandler
  }), rowData => ({
    icon: dataTableIcons.Edit,
    tooltip: '',
    onClick: onUpdateHandler
  }), rowData => ({
    icon: dataTableIcons.Delete,
    tooltip: '',
    onClick: onDeleteHandler,
    disabled: ('clients' in rowData)
  })];

  const components = {
    Toolbar: props => (
      <div>
        <div className={clsx(classes.addWrapper)}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleOutlineIcon/>}
            component={Link}
            to="/survey"
          >
            New
          </Button>
        </div>
        <MTableToolbar {...props} />
      </div>
    )
  };

  const SurveyConnectContent = () => {
    const clients = Config.get('clients', []) || [];
    return (
      <React.Fragment>
        <form autoComplete="off">
          <FormControl required={true} variant="outlined" style={{width: '100%'}}>
            <InputLabel id="connect-helper-label">Client</InputLabel>
            <Select
              labelId="connect-helper-label"
              required={true}
              value={client}
              label="Client"
              onChange={onConnectClientChangeHandler}
            >
              {clients.map((client) => {
                return (<MenuItem key={client.id} value={client.id}>{client.name}</MenuItem>);
              })}
            </Select>
          </FormControl>
          <FormHelperText>Choose a client to connect survey to</FormHelperText>
        </form>
      </React.Fragment>
    );
  }

  const onConnectClientChangeHandler = (e) => {
    e.preventDefault();
    setClient(e.target.value);
  }

  const onConnectDialogConfirmClickHandler = (e) => {
    e.preventDefault();
    const _client = Config.get('clients', []).filter((c) => c.id === client);
    if (_client.length === 1) {
      dispatch(surveyOperations.connectSurvey(currentItem.id, currentItem.uid, _client[0].ckey)).then(() => {
        setOpenConnectDialog(false);
        setClient('');
        setReload(true);
      });
    }
  };

  const onConnectButtonClickHandler = (e) => {
    e.preventDefault();
    setOpenConnectDialog(true);
  }

  const onConnectDialogCloseClickHandler = (e) => {
    e.preventDefault();
    setOpenConnectDialog(false);
    setClient('');
  };

  const onPreviewDialogCloseClickHandler = (e) => {
    e.preventDefault();
    setOpenPreviewDialog(false);
    setSurveyPreview(null);
  };

  const onPreviewHandler = (e, data) => {
    e.preventDefault();
    const model = new Survey.Model(data.object);
    setSurveyPreview(<Survey.Survey model={model}/>);
    setOpenPreviewDialog(true);
  };

  const onUpdateHandler = (e, data) => {
    history.push(`/survey/${data.id}/${data.uid}`);
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
    dispatch(surveyOperations.deleteSurvey(currentItem.id, currentItem.uid)).then(() => {
      setOpenConfirmDialog(false);
    });
  };

  useEffect(() => {
    setOpenBackdrop(loading === true);
    setOpenErrorMessage(error !== null);
  }, [error, loading]);

  useEffect(() => {
    dispatch(surveyOperations.fetchSurveys()).then(() => {
      setReload(false);
    })
  }, [dispatch, reload]);

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
        <Dialog
          fullWidth
          maxWidth="md"
          id="preview-dialog"
          aria-labelledby="preview-dialog-title"
          disableEscapeKeyDown={false}
          open={openPreviewDialog}
          onClose={onPreviewDialogCloseClickHandler}
        >
          <DialogTitle id="preview-dialog-title">Survey preview</DialogTitle>
          <DialogContent>{surveyPreview}</DialogContent>
          <DialogActions>
            <Button onClick={onPreviewDialogCloseClickHandler} color="primary" autoFocus>Close</Button>
          </DialogActions>
        </Dialog>
        <Dialog
          id="connect-dialog"
          fullWidth={true}
          maxWidth="xs"
          aria-labelledby="connect-dialog-title"
          disableEscapeKeyDown={false}
          open={openConnectDialog}
          onClose={onConnectDialogCloseClickHandler}
        >
          <DialogTitle id="preview-dialog-title">Connect survey</DialogTitle>
          <DialogContent>
            <SurveyConnectContent/>
          </DialogContent>
          <DialogActions>
            <Button onClick={onConnectDialogCloseClickHandler} color="primary">Cancel</Button>
            <Button onClick={onConnectDialogConfirmClickHandler} color="primary" variant="contained"
                    autoFocus>Confirm</Button>
          </DialogActions>
        </Dialog>
      </App>
    </React.Fragment>
  )
};
