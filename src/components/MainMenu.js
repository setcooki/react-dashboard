import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {Link} from 'react-router-dom';
import {List} from '@material-ui/core';
import {ListItem} from '@material-ui/core';
import {ListItemIcon} from '@material-ui/core';
import {ListItemText} from '@material-ui/core';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import PeopleIcon from '@material-ui/icons/People';
import WidgetsIcon from '@material-ui/icons/Widgets';
import DomainIcon from '@material-ui/icons/Domain';
import AttachmentIcon from '@material-ui/icons/Attachment';
import AssessmentIcon from '@material-ui/icons/Assessment';
import {authentication} from "../services/authentication";

const useStyles = makeStyles(theme => ({
  listItemText: {
    fontSize: '.75rem',
    paddingLeft: '57px'
  },
  listItemIcon: {
    minWidth: '40px'
  }
}));

const MainMenu = (props) => {

  const classes = useStyles();

  return (
    <React.Fragment>
      <List>
        {(authentication.isSuper) &&
        <ListItem button dense component={Link} to="/tenants">
          <ListItemIcon>
            <DomainIcon className={classes.listItemIcon}/>
          </ListItemIcon>
          <ListItemText primary="Tenants"/>
        </ListItem>
        }
        {(authentication.isSuper || authentication.isAdmin) &&
        <ListItem button dense component={Link} to="/clients">
          <ListItemIcon>
            <WidgetsIcon className={classes.listItemIcon}/>
          </ListItemIcon>
          <ListItemText primary="Clients"/>
        </ListItem>
        }
        {(authentication.isSuper || authentication.isAdmin) &&
        <React.Fragment>
          <ListItem button dense component={Link} to="/users">
            <ListItemIcon>
              <PeopleIcon className={classes.listItemIcon}/>
            </ListItemIcon>
            <ListItemText primary="Users"/>
          </ListItem>
          <List disablePadding>
            <ListItem button dense component={Link} to="/user/groups">
              <ListItemText primary="Groups" disableTypography className={classes.listItemText}/>
            </ListItem>
          </List>
        </React.Fragment>
        }
        <ListItem button dense component={Link} to="/recommendations">
          <ListItemIcon>
            <ThumbUpIcon className={classes.listItemIcon}/>
          </ListItemIcon>
          <ListItemText primary="Recommendations"/>
        </ListItem>
        <List disablePadding>
          <ListItem button dense component={Link} to="/recommendation/categories">
            <ListItemText primary="Categories" disableTypography className={classes.listItemText}/>
          </ListItem>
        </List>
        <List disablePadding>
          <ListItem button dense component={Link} to="/recommendation/bundles">
            <ListItemText primary="Bundles" disableTypography className={classes.listItemText}/>
          </ListItem>
        </List>
        <List disablePadding>
          <ListItem button dense component={Link} to="/recommendation/blocks">
            <ListItemText primary="Blocks" disableTypography className={classes.listItemText}/>
          </ListItem>
        </List>
        <ListItem button dense component={Link} to="/assets">
          <ListItemIcon>
            <AttachmentIcon className={classes.listItemIcon}/>
          </ListItemIcon>
          <ListItemText primary="Assets"/>
        </ListItem>
        {(authentication.isSuper || authentication.isAdmin) ?
          <React.Fragment>
            <ListItem button dense component={Link} to="/surveys">
              <ListItemIcon>
                <AssessmentIcon className={classes.listItemIcon}/>
              </ListItemIcon>
              <ListItemText primary="Surveys"/>
            </ListItem>
            <List disablePadding>
              <ListItem button dense component={Link} to="/survey/groups">
                <ListItemText primary="Groups" disableTypography className={classes.listItemText}/>
              </ListItem>
            </List>
            <List disablePadding>
              <ListItem button dense component={Link} to="/survey/sessions">
                <ListItemText primary="Sessions" disableTypography className={classes.listItemText}/>
              </ListItem>
            </List>
          </React.Fragment>
          :
          <ListItem button dense component={Link} to="/survey">
            <ListItemIcon>
              <AssessmentIcon className={classes.listItemIcon}/>
            </ListItemIcon>
            <ListItemText primary="Survey"/>
          </ListItem>
        }
      </List>
    </React.Fragment>
  );
};

export default React.memo(MainMenu);
