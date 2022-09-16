import React, {useEffect, useState} from 'react';
import App from '../../templates/App';
import MaterialTable from 'material-table';
import dataTableIcons from '../../utils/dataTableIcons';
import Config from '../../class/Config';
import {shallowEqual, useDispatch, useSelector} from 'react-redux';
import {useHistory} from "react-router-dom";
import {clientOperations} from "../../store/ducks/client";
import {Backdrop} from "@material-ui/core";
import CircularProgress from '@material-ui/core/CircularProgress';
import ErrorMessage from "../../components/ErrorMessage";

export default function Clients(props) {

  const {data, error, loading, runtime} = useSelector((state) => {
    return {
      data: state.clients.client.data,
      error: state.clients.client.error,
      loading: state.clients.client.loading,
      runtime: state.runtime.runtime.data
    };
  }, shallowEqual);

  const dispatch = useDispatch();
  const history = useHistory();

  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [openErrorMessage, setOpenErrorMessage] = useState(false);

  const icons = dataTableIcons;

  const columns = () => {
    let columns = [{
      width: 50,
      field: 'id',
      title: 'ID'
    }, {
      field: 'ckey',
      title: 'Client Key'
    }, {
      field: 'name',
      title: 'Name'
    }, {
      field: 'enabled',
      title: 'Enabled'
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
    onClick: onUpdateHandler,
    disabled: (rowData.role === 'super')
  })];

  const onUpdateHandler = (e, data) => {
    history.push(`/client/${data.id}/${data.uid}`);
  };

  useEffect(() => {
    setOpenBackdrop(loading === true);
    setOpenErrorMessage(error !== null);
  }, [error, loading]);

  useEffect(() => {
    dispatch(clientOperations.fetchClients());
  }, [dispatch]);

  useEffect(() => {
    if (('tenant' in runtime && runtime.tenant !== undefined) || ('client' in runtime && runtime.client !== undefined)) {
      dispatch(clientOperations.fetchClients());
    }
  }, [dispatch, runtime]);

  return (
    <React.Fragment>
      <App>
        <ErrorMessage open={openErrorMessage}>
          {error ? error : ''}
        </ErrorMessage>
        <MaterialTable
          title="Clients"
          icons={icons}
          data={data}
          columns={columns()}
          options={options}
          actions={actions}
          style={{boxShadow: 'none'}}
        />
        <Backdrop open={openBackdrop}>
          <CircularProgress color="inherit"/>
        </Backdrop>
      </App>
    </React.Fragment>
  )
};
