import React, {useEffect, useState} from 'react';
import {Link, useHistory} from 'react-router-dom';
import App from '../../templates/App';
import MaterialTable, {MTableToolbar} from 'material-table';
import {Backdrop, Chip, Button, Link as HTMLLink} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import dataTableIcons from '../../utils/dataTableIcons';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import Config from '../../class/Config';
import {userOperations} from '../../store/ducks/user';
import {authentication} from '../../services/authentication';
import clsx from 'clsx';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import {makeStyles} from '@material-ui/core/styles';
import ErrorMessage from '../../components/ErrorMessage';
import ConfirmDialog from '../../components/ConfirmDialog';

const useStyles = makeStyles((theme) => ({
  addWrapper: {
    marginBottom: theme.spacing(2),
    textAlign: 'right'
  }
}));

export default function Users(props) {

  const {data, error, loading, runtime} = useSelector((state) => {
    return {
      data: state.users.user.data,
      error: state.users.user.error,
      loading: state.users.user.loading,
      runtime: state.runtime.runtime.data
    };
  }, shallowEqual);

  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();

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
      field: 'email',
      title: 'E-Mail',
      render: (data) => {
        return <HTMLLink href={`mailto:${data.email}`}>{data.email}</HTMLLink>
      }
    }, {
      field: 'forename',
      title: 'Forename'
    }, {
      field: 'surname',
      title: 'Surname'
    }, {
      field: 'role',
      title: 'Role'
    }, {
      field: 'clients',
      title: 'Clients',
      render: (data) => {
        if (data && 'clients' in data) {
          return data.clients.map((client) => {
            return (<Chip
                label={client.name}
                size="small"
                variant="outlined" onClick={(e) => {
                history.push(`client/${client.id}/${client.uid}`)
              }}/>
            );
          });
        } else {
          return '-';
        }
      },
      sorting: false
    }, {
      field: 'groups',
      title: 'Groups',
      render: (data) => {
        if (data && 'groups' in data) {
          return data.groups.map((group) => {
            return (<Chip
                label={group.name}
                size="small"
                variant="outlined" onClick={(e) => {
                history.push(`group/${group.id}/${group.uid}`)
              }}/>
            );
          });
        } else {
          return '-';
        }
      },
      sorting: false
    }, {
      field: 'enabled',
      title: 'Enabled',
    }, {
      field: 'updated_at',
      title: 'Last update',
      type: 'datetime'
    }];
    if (authentication.isSuper) {
      columns.splice(1, 0, {
        field: 'tid',
        title: 'Tenant',
        render: (data) => {
          if (data.tid) {
            const tenant = Config.get('tenants', []).find(tenant => tenant.id === data.tid);
            if (tenant) {
              return tenant.name;
            }
          }
          return data.tid || '-';
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
    icon: dataTableIcons.Statistics,
    tooltip: '',
  }), rowData => ({
    icon: dataTableIcons.Edit,
    tooltip: '',
    onClick: onUpdateHandler,
    disabled: (rowData.role === 'super')
  }), rowData => ({
    icon: dataTableIcons.Delete,
    tooltip: '',
    onClick: onDeleteHandler,
    disabled: (rowData.role === 'super')
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
            to="/user"
          >
            New
          </Button>
        </div>
        <MTableToolbar {...props} />
      </div>
    )
  };

  const onUpdateHandler = (e, data) => {
    history.push(`/user/${data.id}/${data.uid}`);
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
    dispatch(userOperations.deleteUser(currentItem.id, currentItem.uid)).then(() => {
      setOpenConfirmDialog(false);
    });
  };

  useEffect(() => {
    setOpenBackdrop(loading === true);
    setOpenErrorMessage(error !== null);
  }, [error, loading]);

  useEffect(() => {
    dispatch(userOperations.fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    if (('tenant' in runtime && runtime.tenant !== undefined) || ('client' in runtime && runtime.client !== undefined)) {
      dispatch(userOperations.fetchUsers());
    }
  }, [dispatch, runtime]);

  return (
    <React.Fragment>
      <App>
        <ErrorMessage open={openErrorMessage}>
          {error ? error : ''}
        </ErrorMessage>
        <MaterialTable
          title="Users"
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
