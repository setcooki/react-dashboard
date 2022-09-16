import React, {useEffect, useState} from 'react';
import {Button} from "@material-ui/core";
import {Dialog} from "@material-ui/core";
import {DialogTitle} from "@material-ui/core";
import {DialogActions} from "@material-ui/core";
import {DialogContent} from "@material-ui/core";

const ConfirmDialog = (props) => {

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const Title = () => {
    return (<DialogTitle>{title}</DialogTitle>);
  };

  const Content = () => {
    return (<DialogContent>{content}</DialogContent>);
  };

  const onCloseHandler = () => {
    if ('closeHandler' in props) {
      props.closeHandler();
    }
    setOpen(false);
  };

  const onConfirmHandler = () => {
    if ('confirmHandler' in props) {
      props.confirmHandler();
    }
    setOpen(false);
  };

  const Actions = () => {
    return (
      <DialogActions>
        <Button onClick={onCloseHandler} color="primary">Cancel</Button>
        <Button onClick={onConfirmHandler} variant="contained" color="primary" autoFocus>OK</Button>
      </DialogActions>
    );
  };

  useEffect(() => {
    setOpen(props.open || false);
  }, [props.open]);

  useEffect(() => { q
    setTitle(props.title || 'Confirm action');
  }, [props.title]);

  useEffect(() => {
    setContent(props.children || 'You must accept this action');
  }, [props.children]);

  return (
    <React.Fragment>
      <Dialog onClose={onCloseHandler} open={open}>
        <Title/>
        <Content/>
        <Actions/>
      </Dialog>
    </React.Fragment>
  );
}

export default React.memo(ConfirmDialog);
