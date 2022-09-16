import React, {useRef} from 'react';
import {Provider} from 'react-redux';
import {createMuiTheme, MuiThemeProvider} from "@material-ui/core/styles";
import {ThemeProvider} from "@material-ui/styles";
import {ErrorBoundary} from "react-error-boundary";
import Error from "./components/Error";
import Store from "./store/store";
import Api from './class/Api';
import Router from "./components/Router";
import './class/i18n';
import IdleTimer from 'react-idle-timer'
import {authentication} from "./services/authentication";

const store = Store.init();
const api = Api.init();
const theme = createMuiTheme();

Object.assign(theme, {
  overrides: {
    MuiBackdrop: {
      root: {
        zIndex: 1300
      }
    },
    MuiDialog: {
      container: {
        zIndex: 1301,
        position: 'relative'
      }
    },
    MUIRichTextEditor: {
      root: {
        border: `1px solid ${theme.palette.grey[400]}`,
        borderRadius: theme.shape.borderRadius
      },
      container: {
        margin: 0,
        padding: 0,
      },
      toolbar: {
        padding: '4px 0',
        borderBottom: `1px solid ${theme.palette.grey[400]}`,
      },
      editor: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2)
      }
    }
  }
});

export default function App(props) {

  const idleTimer = useRef(null);

  const onActiveHandler = () => {
  }

  const onActionHandler = () => {
  }

  const onIdleHandler = () => {
    if (authentication.isCurrentUser) {
      authentication.logout();
    }
  }

  return (
    <React.Fragment>
      <Provider store={store} api={api}>
        <MuiThemeProvider theme={theme}>
          <ThemeProvider theme={theme}>
            <ErrorBoundary FallbackComponent={Error}>
              <IdleTimer
                ref={idleTimer}
                element={document}
                onActive={onActiveHandler}
                onIdle={onIdleHandler}
                onAction={onActionHandler}
                debounce={250}
                timeout={1000 * 60 * 30}/>
              <Router/>
            </ErrorBoundary>
          </ThemeProvider>
        </MuiThemeProvider>
      </Provider>
    </React.Fragment>
  );
}
