import React, {useEffect, useState} from 'react';
import App from '../../templates/App';
import MaterialTable from 'material-table';
import dataTableIcons from '../../utils/dataTableIcons';
import Config from '../../class/Config';
import {shallowEqual, useSelector} from 'react-redux';

export default function Tenants(props) {

  const {runtime} = useSelector((state) => {
    return {
      runtime: state.runtime.runtime.data
    };
  }, shallowEqual);

  const [data, setData] = useState(Config.get('tenants') || []);

  const icons = dataTableIcons;

  const columns = () => {
    return [{
      width: 50,
      field: 'id',
      title: 'ID'
    }, {
      field: 'tkey',
      title: 'Tenant Key'
    }, {
      field: 'name',
      title: 'Name'
    }];
  };

  const options = {
    search: true,
    pageSize: 10,
    pageSizeOptions: [10, 20, 50, 100],
    exportButton: true,
    exportAllData: true
  };

  useEffect(() => {
    if (runtime.init) {
      setData(Config.get('tenants') || []);
    }
  }, [runtime.init]);

  return (
    <React.Fragment>
      <App>
        <MaterialTable
          title="Tenants"
          icons={icons}
          data={data}
          columns={columns()}
          options={options}
          style={{boxShadow: 'none'}}
        />
      </App>
    </React.Fragment>
  )
};
