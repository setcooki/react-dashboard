import React, {useEffect, useState} from "react";
import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
}
  from "@material-ui/core";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import RemoveCircleOutlineIcon from "@material-ui/icons/RemoveCircleOutline";
import BundleDescriptionForm from "./BundleDescriptionForm";

const BundleDescriptionTable = (props) => {

  const [descriptions, setDescriptions] = useState([]);
  const [reset, setReset] = useState(false);
  const [errors, setErrors] = useState([]);
  const [initialized, setInitialized] = useState(false);

  const onDescriptionChangeHandler = (description, index) => {
    setDescriptions((prevState) => {
      if (index in prevState) {
        const state = prevState.map((item, i) => {
          return (i === index) ? {...item, ...description} : item;
        });
        if ('onChange' in props) {
          props.onChange(state);
        }
        return state;
      } else {
        return prevState;
      }
    });
    //error + overlapping range check
    setErrors(prevState1 => {
      const m = descriptions.find((d, i) => {
        if (i !== index) {
          if (
            (parseInt(description.min) >= parseInt(d.min) && parseInt(description.min) <= parseInt(d.max))
            ||
            (parseInt(description.max) >= parseInt(d.min) && parseInt(description.max) <= parseInt(d.max))
          ) {
            return true;
          }
        }
        return false;
      })
      if (m !== undefined || parseInt(description.min) >= parseInt(description.max)) {
        if (!prevState1.includes(index)) {
          return [...prevState1, index];
        }
      } else {
        if (prevState1.includes(index)) {
          return prevState1.filter(item => item !== index);
        }
      }
      return prevState1;
    });
  }

  const onDescriptionClickHandler = (e) => {
    e.preventDefault();
    const state = {
      id: null
    }
    setDescriptions(prevState => [...prevState, ...[state]]);
  }

  const onRemoveDescriptionClickHandler = (index) => {
    setDescriptions((prevState) => {
      const state = prevState.filter((item, i) => i !== index)
      if ('onChange' in props) {
        props.onChange(state);
      }
      return state;
    });
  }

  useEffect(() => {
    if (props.descriptions && props.descriptions.length && !initialized) {
      setDescriptions(props.descriptions || []);
      setInitialized(true);
    } else if (!props.descriptions || (props.descriptions && !props.descriptions.length)) {
      setDescriptions([]);
    }
  }, [props.descriptions, initialized]);

  const renderDescription = (item, index) => {
    return (
      <React.Fragment key={item.id || index}>
        <TableRow>
          <TableCell style={{paddingLeft: 0, paddingRight: 0}}>
            <BundleDescriptionForm
              error={errors.includes(index)}
              description={item}
              reset={reset}
              onChange={(description) => onDescriptionChangeHandler(description, index)}
            />
          </TableCell>
          <TableCell align="right" style={{width: '35px', paddingLeft: 0, paddingRight: 0}}>
            <IconButton aria-label="add" onClick={(e) => {
              e.preventDefault();
              return onRemoveDescriptionClickHandler(index);
            }}>
              <RemoveCircleOutlineIcon/>
            </IconButton>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  };

  useEffect(() => {
    setReset(false);
    if (props.descriptions && props.descriptions.length && !initialized) {
      setInitialized(true);
    } else if ((!props.descriptions || props.descriptions.length === 0)) {
      setReset(true);
    }
  }, [props.descriptions, initialized]);

  return (
    <React.Fragment>
      <Table aria-label="Bundle description table">
        <TableHead>
          <TableRow>
            <TableCell style={{paddingLeft: 0, paddingTop: 0, paddingBottom: 0}}>Weighted Descriptions</TableCell>
            <TableCell style={{paddingRight: 0, paddingTop: 0, paddingBottom: 0}} align="right">
              <IconButton aria-label="add" color="primary" onClick={onDescriptionClickHandler}>
                <AddCircleIcon/>
              </IconButton>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {descriptions.map((item, index) => renderDescription(item, index))}
        </TableBody>
      </Table>
    </React.Fragment>
  );
}

export default React.memo(BundleDescriptionTable);
