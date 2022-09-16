import React, {useEffect, useState} from 'react';
import {useLocation} from "react-router-dom";
import clsx from "clsx";
import {Backdrop, CircularProgress} from "@material-ui/core";
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import Api from "../class/Api";
import Config from "../class/Config";
import {runtimeActions} from "../store/ducks/runtime";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: 3000
  }
}));

const Preloader = (props) => {

  const {runtime} = useSelector((state) => {
    return {
      runtime: state.runtime.runtime.data
    };
  }, shallowEqual);

  const location = useLocation();
  const classes = useStyles();
  const dispatch = useDispatch();

  const [initialized, setInitialized] = useState(false);
  const [openBackdrop, setOpenBackdrop] = useState(false);

  useEffect(() => {
    if (runtime.user && !initialized) {
      setOpenBackdrop(true);
      Api.get('/config/init').then((config) => {
        setOpenBackdrop(false);
        Config.init(config);
        setInitialized(true);
      }).catch(() => {
        setOpenBackdrop(false);
      })
    }
  }, [dispatch, initialized, runtime.user]);

  useEffect(() => {
    dispatch(runtimeActions.updateRuntime({init: initialized}));
  }, [dispatch, location, initialized]);

  return (
    <React.Fragment>
      <Backdrop open={openBackdrop} className={clsx(classes.backdrop)}>
        <CircularProgress color="inherit"/>
      </Backdrop>
    </React.Fragment>
  );
}

export default React.memo(Preloader);
