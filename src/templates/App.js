import React, {useEffect, useState} from 'react';
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import CssBaseline from "@material-ui/core/CssBaseline";
import {
  AppBar,
  Box, Button,
  Container,
  Divider,
  Drawer,
  FormControl,
  IconButton,
  MenuItem,
  Paper, Select,
  Toolbar,
  Typography,
} from "@material-ui/core";
import clsx from "clsx";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import MainMenu from "../components/MainMenu";
import {makeStyles} from "@material-ui/core/styles";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import {authentication} from '../services/authentication';
import Config from '../class/Config';
import {runtimeActions} from "../store/ducks/runtime";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import ProfileForm from "../components/ProfileForm";

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    display: 'flex',
  },
  title: {
    flexGrow: 1,
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  appBarSpacer: theme.mixins.toolbar,
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  paper: {
    marginTop: theme.spacing(3)
  },
  form: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  select: {
    minWidth: '120px',
    '& > div': {
      fontSize: '.8rem',
      color: '#fff',
      padding: '5px 8px',
      backgroundColor: theme.palette.primary.dark
    },
    '& > svg': {
      color: '#fff'
    },
    '& > fieldset': {
      borderColor: '#fff'
    }
  },
  inputLabel: {
    color: '#fff'
  },
  toolbarButton: {
    padding: '0 0 0 5px'
  }
}));

const drawerWidth = 240;

function _getTitle() {
  let path = window.location.hash.substring(1);
  switch (true) {
    case /\/recommendation/.test(path):
      return 'Recommendations';
    default:
      return 'Home';
  }
}

export default function Wrapper({children}) {

  const {runtime} = useSelector((state) => {
    return {
      runtime: state.runtime.runtime.data
    };
  }, shallowEqual);

  const classes = useStyles();
  const dispatch = useDispatch();

  const [title, setTitle] = useState(_getTitle());
  const [tenant, setTenant] = useState('');
  const [client, setClient] = useState('');
  const [clients, setClients] = useState([]);
  const [open, setOpen] = useState(true);
  const [openProfile, setOpenProfile] = useState(false);
  const [submitProfile, setSubmitProfile] = useState(0);

  const onDrawerOpenHandler = () => {
    setOpen(true);
  };

  const onDrawerCloseHandler = () => {
    setOpen(false);
  };

  const onLogoutClickHandler = (e) => {
    e.preventDefault();
    authentication.logout();
    window.location.reload(true);
  };

  const onProfileClickHandler = (e) => {
    e.preventDefault();
    setOpenProfile(true);
  };

  const onProfileCloseHandler = (e) => {
    e.preventDefault();
    setOpenProfile(false);
  };

  const onProfileSaveHandler = (e) => {
    e.preventDefault();
    setSubmitProfile(submitProfile + 1);
  }

  const onTenantChooseHandler = (e) => {
    let id = e.target.value;
    let tenant = Config.get('tenants', []).find(tenant => tenant.id === id);
    if (tenant) {
      setClients(Config.get('clients', []).filter(client => client.tid === id));
      dispatch(runtimeActions.updateRuntime({tenant: tenant}));
      localStorage.setItem('currentTenant', tenant.tkey);
    } else {
      setClients(Config.get('clients', []));
      dispatch(runtimeActions.updateRuntime({tenant: null}));
      localStorage.removeItem('currentTenant');
    }
    setTenant(id);
  }

  const onClientChooseHandler = (e) => {
    let id = e.target.value;
    let client = Config.get('clients', []).find(client => client.id === id);
    if (client) {
      dispatch(runtimeActions.updateRuntime({client: client}));
      localStorage.setItem('currentClient', client.ckey);
    } else {
      dispatch(runtimeActions.updateRuntime({client: null}));
      localStorage.removeItem('currentClient');
    }
    setClient(id);
  }

  const getTitle = () => {
    setTitle(_getTitle());
  };

  const LogoutButton = () => {
    if (!authentication.isCurrentUser) {
      return null;
    }
    return (
      <IconButton color="inherit" onClick={onLogoutClickHandler} className={clsx(classes.toolbarButton)}>
        <ExitToAppIcon/>
      </IconButton>
    );
  }

  const ProfileButton = () => {
    if (!authentication.isCurrentUser) {
      return null;
    }
    return (
      <IconButton color="inherit" onClick={onProfileClickHandler} className={clsx(classes.toolbarButton)}>
        <AccountBoxIcon/>
      </IconButton>
    );
  }

  const TenantChooser = () => {
    if (authentication.isSuper) {
      return (
        <FormControl style={{marginRight: '10px'}}>
          <Select
            autoWidth
            displayEmpty
            variant="filled"
            value={tenant}
            label="Tenant"
            onChange={onTenantChooseHandler}
            className={clsx(classes.select)}
          >
            <MenuItem dense key="" value=""><em>--- All Tenants ---</em></MenuItem>
            {Config.get('tenants', []).map((t) => {
              return (<MenuItem dense key={t.id} value={t.id}>{t.name}</MenuItem>);
            })}
          </Select>
        </FormControl>
      );
    } else {
      return null;
    }
  }

  const ClientChooser = () => {
    if (authentication.isSuper || authentication.isAdmin) {
      return (
        <FormControl>
          <Select
            autoWidth
            displayEmpty
            variant="filled"
            value={client}
            label="Client"
            onChange={onClientChooseHandler}
            className={clsx(classes.select)}
          >
            <MenuItem dense key="" value=""><em>--- All Clients ---</em></MenuItem>
            {clients.map((c) => {
              return (<MenuItem dense key={c.id} value={c.id}>{c.name}</MenuItem>);
            })}
          </Select>
        </FormControl>
      );
    } else {
      return null;
    }
  }

  useEffect(() => {
    if (runtime.client) {
      setClient(runtime.client.id);
    }
  }, [runtime.client]);

  useEffect(() => {
    if (runtime.init) {
      let tenant = null;
      let client = null;
      let currentTenant = localStorage.getItem('currentTenant') || null;
      let currentClient = localStorage.getItem('currentClient') || null;
      if (currentTenant) {
        tenant = Config.get('tenants', []).find(tenant => tenant.tkey === currentTenant);
      } else if (authentication.currentUserValue.tenant) {
        tenant = authentication.currentUserValue.tenant;
      }
      if (tenant) {
        setClients(Config.get('clients', []).filter(client => client.tid === tenant.id));
        setTenant(tenant.id);
        dispatch(runtimeActions.updateRuntime({tenant: tenant}));
      }
      if (currentClient) {
        client = Config.get(clients, []).find(client => client.ckey === currentClient)
      } else if (authentication.currentUserValue.client) {
        client = authentication.currentUserValue.client;
      }
      if (client) {
        setClient(client.id);
        dispatch(runtimeActions.updateRuntime({client: client}));
      }
    }
  }, [dispatch, clients, runtime.init]);

  useEffect(() => {
    window.addEventListener('hashchange', getTitle, false);
  }, []);

  return (
    <div className={classes.root}>
      <CssBaseline>
        <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={onDrawerOpenHandler}
              className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
            >
              <MenuIcon/>
            </IconButton>
            <Typography component="h1" variant="h6" color="inherit" noWrap
                        className={classes.title}>{title}</Typography>
            <form className={clsx(classes.form)} noValidate autoComplete="off">
              <TenantChooser/>
              <ClientChooser/>
            </form>
            <ProfileButton/>
            <LogoutButton/>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          classes={{
            paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
          }}
          open={open}
        >
          <div className={classes.toolbarIcon}>
            <IconButton onClick={onDrawerCloseHandler}>
              <ChevronLeftIcon/>
            </IconButton>
          </div>
          <Divider/>
          <MainMenu/>
          <Divider/>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.appBarSpacer}>
            <Container maxWidth={false} className={classes.container}>
              <Paper className={classes.paper}>
                <Box p={2}>
                  {children}
                </Box>
              </Paper>
            </Container>
          </div>
        </main>
        <Dialog
          id="profile-dialog"
          fullWidth={true}
          maxWidth="xs"
          aria-labelledby="profile-dialog-title"
          disableEscapeKeyDown={false}
          open={openProfile}
          onClose={onProfileCloseHandler}
        >
          <DialogTitle id="profile-dialog-title">Your profile</DialogTitle>
          <DialogContent>
            <ProfileForm submit={submitProfile}/>
          </DialogContent>
          <DialogActions>
            <Button onClick={onProfileCloseHandler} color="primary">Cancel</Button>
            <Button onClick={onProfileSaveHandler} color="primary" variant="contained"
                    autoFocus>Save</Button>
          </DialogActions>
        </Dialog>
      </CssBaseline>
    </div>
  );
}
