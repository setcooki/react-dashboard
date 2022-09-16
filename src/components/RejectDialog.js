import React, {useEffect, useState} from 'react';
import {Button} from "@material-ui/core";
import {Dialog} from "@material-ui/core";
import {DialogTitle} from "@material-ui/core";
import {DialogActions} from "@material-ui/core";
import {DialogContent} from "@material-ui/core";

const RejectDialog = (props) => {

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

  const Actions = () => {
    return (
      <DialogActions>
        <Button onClick={onCloseHandler} variant="contained" color="primary">Cancel</Button>
      </DialogActions>
    );
  };

  useEffect(() => {
    setOpen(props.open || false);
  }, [props.open]);

  useEffect(() => {
    setOpen(props.title || 'Action rejected');
  }, [props.title]);

  useEffect(() => {
    setContent(props.children || 'This action can not be executed!');
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

export default React.memo(RejectDialog);
