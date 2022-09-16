import React, {useEffect, useState} from 'react';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton
} from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import MetaField from "./MetaField";

const MetaTable = (props) => {

  const [metas, setMetas] = useState([]);
  const [reset, setReset] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const renderMeta = (item, index) => {
    return (
      <React.Fragment key={item.id || index}>
        <TableRow>
          <TableCell style={{paddingLeft: 0, paddingRight: 0}}>
            <MetaField meta={item} reset={reset}
                       onChange={(meta) => onMetaChangeHandler(meta, index)}/>
          </TableCell>
          <TableCell align="right" style={{width: '25px', paddingLeft: 0, paddingRight: 0, verticalAlign: 'top'}}>
            <IconButton aria-label="add" onClick={(e) => {
              e.preventDefault();
              return onRemoveMetaClickHandler(index);
            }}>
              <RemoveCircleOutlineIcon/>
            </IconButton>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }

  const onMetaChangeHandler = (meta, index) => {
    setMetas((prevState) => {
      if (index in prevState) {
        const state = prevState.map((item, i) => {
          return (i === index) ? {...item, ...meta} : item;
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

  const onAddMetaClickHandler = (e) => {
    e.preventDefault();
    const state = {
      id: null,
      name: null,
      value: null
    }
    setMetas(prevState => [...prevState, ...[state]]);
  }

  const onRemoveMetaClickHandler = (index) => {
    setMetas((prevState) => {
      const state = prevState.filter((item, i) => i !== index)
      if ('onChange' in props) {
        props.onChange(state);
      }
      return state;
    });
  }

  useEffect(() => {
    setReset(false);
    if (props.metas && props.metas.length && !initialized) {
      setMetas(props.metas);
      setInitialized(true);
    } else if ((!props.metas || props.metas.length === 0)) {
      setReset(true);
    }
  }, [props.metas, initialized]);

  return (
    <React.Fragment>
      <Table aria-label="Asset table">
        <TableHead>
          <TableRow>
            <TableCell style={{paddingLeft: 0, paddingTop: 0, paddingBottom: 0}}>Meta Data</TableCell>
            <TableCell style={{paddingRight: 0, paddingTop: 0, paddingBottom: 0}} align="right">
              <IconButton aria-label="add" color="primary" style={{paddingRight: 0}} onClick={onAddMetaClickHandler}>
                <AddCircleIcon/>
              </IconButton>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {metas.map((item, index) => renderMeta(item, index))}
        </TableBody>
      </Table>
    </React.Fragment>
  );
}

export default React.memo(MetaTable);
