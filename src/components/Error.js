import React, {useState} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {Dialog} from "@material-ui/core";
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(0),
    top: theme.spacing(0),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const {children, classes, onClose, ...other} = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon/>
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const Error = (props) => {

  const [open, setOpen] = useState(true);

  const onCloseHandler = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={onCloseHandler}
        fullWidth={true}
        maxWidth={"sm"}
        aria-labelledby="customized-dialog-title"
      >
        <DialogTitle id="customized-dialog-title" onClose={onCloseHandler}>
          Oops! An error occured!
        </DialogTitle>
        <DialogContent>
          <Alert variant="filled" severity="error">
            <AlertTitle>Error</AlertTitle>
            {props.error.toString()}
          </Alert>
        </DialogContent>
      </Dialog>
    </React.Fragment>);
}

export default React.memo(Error);
