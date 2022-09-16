import React, {useEffect, useState} from 'react';
import {Snackbar} from '@material-ui/core';
import {Alert} from "@material-ui/lab";

const SuccessMessage = (props) => {

  const [openSnackbar, setOpenSnackbar] = useState(props.open);

  const onSnackbarCloseHandler = (e) => {
    setOpenSnackbar(false);
  };

  useEffect(() => {
    setOpenSnackbar(props.open);
  }, [props.open]);

  return (
    <React.Fragment>
      <Snackbar open={openSnackbar} autoHideDuration={6000} anchorOrigin={{vertical: 'top', horizontal: 'center'}}
                onClose={onSnackbarCloseHandler}>
        <Alert onClose={onSnackbarCloseHandler} severity="success">{props.children}</Alert>
      </Snackbar>
    </React.Fragment>
  );
};

export default React.memo(SuccessMessage);
