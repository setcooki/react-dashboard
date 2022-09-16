import React, {useEffect, useState} from 'react';
import {Link, useHistory} from 'react-router-dom';
import clsx from 'clsx';
import {useSelector, useDispatch, shallowEqual} from 'react-redux';
import MaterialTable, {MTableToolbar} from 'material-table';
import {makeStyles} from '@material-ui/core/styles';
import {Backdrop} from '@material-ui/core';
import {Button} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import dataTableIcons from '../../utils/dataTableIcons';
import ConfirmDialog from '../../components/ConfirmDialog';
import {recommendationOperations} from '../../store/ducks/recommendation';
import Config from '../../class/Config';
import App from '../../templates/App';
import ErrorMessage from '../../components/ErrorMessage';

const useStyles = makeStyles((theme) => ({
  addWrapper: {
    marginBottom: theme.spacing(2),
    textAlign: 'right'
  }
}));

export default function Recommendations(props) {

  const {data, error, loading, runtime} = useSelector((state) => {
    return {
      data: state.recommendations.recommendation.data,
      error: state.recommendations.recommendation.error,
      loading: state.recommendations.recommendation.loading,
      runtime: state.runtime.runtime.data
    };
  }, shallowEqual);

  const dispatch = useDispatch();
  const classes = useStyles();
  const history = useHistory();

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
      field: 'title',
      title: 'Title'
    }, {
      field: 'category_name',
      title: 'Category',
      render: (data) => {
        if (data && 'category_id' in data && data.category_id) {
          return <Link
            to={`/recommendation/category/${data.category_id}/${data.category_uid}`}>{data.category_name}</Link>
        } else {
          return '-';
        }
      }
    }, {
      field: 'tags',
      title: 'Tags',
      render: (data) => {
        if (data && 'tags' in data && data.tags) {
          return data.tags.map((tag) => {
            return tag.name;
          }).join(', ')
        } else {
          return '-';
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
    grouping: true,
    exportButton: true,
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
        <div className={clsx(classes.addWrapper)}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleOutlineIcon/>}
            component={Link}
            to="/recommendation"
          >
            New
          </Button>
        </div>
        <MTableToolbar {...props} />
      </div>
    )
  };

  const onUpdateHandler = (e, data) => {
    history.push(`/recommendation/${data.id}/${data.uid}`);
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
    dispatch(recommendationOperations.deleteRecommendation(currentItem.id, currentItem.uid)).then(() => {
      setOpenConfirmDialog(false);
    });
  };

  useEffect(() => {
    setOpenBackdrop(loading === true);
    setOpenErrorMessage(error !== null);
  }, [error, loading]);

  useEffect(() => {
    dispatch(recommendationOperations.fetchRecommendations());
  }, [dispatch]);

  useEffect(() => {
    if ('tenant' in runtime && runtime.tenant !== undefined) {
      dispatch(recommendationOperations.fetchRecommendations());
    }
  }, [dispatch, runtime]);

  return (
    <React.Fragment>
      <App>
        <ErrorMessage open={openErrorMessage}>
          {error ? error : ''}
        </ErrorMessage>
        <MaterialTable
          title={"Recommendations"}
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
