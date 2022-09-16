import React, {useEffect, useState} from 'react';
import App from '../../templates/App';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {Link, useHistory} from 'react-router-dom';
import dataTableIcons from '../../utils/dataTableIcons';
import clsx from 'clsx';
import {Backdrop, Button} from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import MaterialTable, {MTableToolbar} from 'material-table';
import ErrorMessage from '../../components/ErrorMessage';
import CircularProgress from '@material-ui/core/CircularProgress';
import ConfirmDialog from '../../components/ConfirmDialog';
import {makeStyles} from '@material-ui/core/styles';
import {surveyOperations} from '../../store/ducks/survey';
import Config from '../../class/Config';

const useStyles = makeStyles((theme) => ({
  addCategoryWrapper: {
    marginBottom: theme.spacing(2),
    textAlign: 'right'
  }
}));

export default function SurveyGroups(props) {
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

  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [openErrorMessage, setOpenErrorMessage] = useState(false);
  const [currentItem, setCurrentItem] = useState({});
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const icons = dataTableIcons;

  const columns = () => {
    let columns = [{
      width: 50,
      field: 'id',
      title: 'ID'
    }, {
      field: 'name',
      title: 'Name'
    }, {
      field: 'survey_id',
      title: 'Survey',
      render: (data) => {
        return <Link
          to={`/survey/${data.survey_id}/${data.survey_uid}`}>{data.survey_title}</Link>
      }
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
    exportAllData: true,
    actionsColumnIndex: -1
  };

  const actions = [rowData => ({
    icon: dataTableIcons.Edit,
    tooltip: '',
    onClick: onUpdateHandler
  }), rowData => ({
    icon: dataTableIcons.Delete,
    tooltip: '',
    onClick: onDeleteHandler
  })];

  const components = {
    Toolbar: props => (
      <div>
        <div className={clsx(classes.addCategoryWrapper)}>
          <Button
            size="small"
            variant="contained"
            color="primary"
            className={clsx(classes.button)}
            startIcon={<AddCircleOutlineIcon/>}
            component={Link}
            to="/survey/group"
          >
            Add
          </Button>
        </div>
        <MTableToolbar {...props} />
      </div>
    )
  };

  const onUpdateHandler = (e, data) => {
    e.preventDefault();
    history.push(`/survey/group/${data.id}/${data.uid}`);
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
    dispatch(surveyOperations.deleteSurveyGroup(currentItem.id, currentItem.uid)).then(() => {
      setOpenConfirmDialog(false);
    });
  };

  useEffect(() => {
    setOpenBackdrop(loading === true);
    setOpenErrorMessage(error !== null);
  }, [error, loading]);

  useEffect(() => {
    dispatch(surveyOperations.fetchSurveyGroups());
  }, [dispatch, runtime]);

  return (
    <React.Fragment>
      <App>
        <ErrorMessage open={openErrorMessage}>
          {error ? error : ''}
        </ErrorMessage>
        <MaterialTable
          title="Survey Groups"
          icons={icons}
          data={data}
          columns={columns()}
          options={options}
          actions={actions}
          components={components}
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
