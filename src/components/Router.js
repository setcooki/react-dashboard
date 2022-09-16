import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import {PrivateRoute} from './PrivateRoute';
import Preloader from './Preloader';
import Home from '../modules/Home';
import Login from '../modules/Login';
import User from '../modules/user/User';
import Users from '../modules/user/Users';
import Client from '../modules/client/Client';
import Clients from '../modules/client/Clients';
import Tenants from '../modules/tenant/Tenants';
import Asset from '../modules/asset/Asset';
import Assets from '../modules/asset/Assets';
import Survey from '../modules/survey/Survey'
import Surveys from '../modules/survey/Surveys'
import SurveyGroup from '../modules/survey/SurveyGroup';
import SurveyGroups from '../modules/survey/SurveyGroups';
import SurveySessions from '../modules/survey/SurveySessions';
import UserGroups from '../modules/user/UserGroups';
import UserGroup from '../modules/user/UserGroup';
import Recommendation from '../modules/recommendation/Recommendation';
import Recommendations from '../modules/recommendation/Recommendations';
import RecommendationBundle from '../modules/recommendation/RecommendationBundle';
import RecommendationBundles from '../modules/recommendation/RecommendationBundles';
import RecommendationBlock from '../modules/recommendation/RecommendationBlock';
import RecommendationBlocks from '../modules/recommendation/RecommendationBlocks';
import RecommendationCategory from '../modules/recommendation/RecommendationCategory';
import RecommendationCategories from '../modules/recommendation/RecommendationCategories';

export default function Router(props) {
  return (
    <React.Fragment>
      <BrowserRouter>
        <Preloader/>
        <Switch>
          <Route path="/login" component={Login}/>
          <PrivateRoute path="/" component={Home} exact/>
          <PrivateRoute path="/user/group/:id?/:uid?" component={UserGroup} exact/>
          <PrivateRoute path="/user/groups" component={UserGroups} exact/>
          <PrivateRoute path="/users" component={Users} exact/>
          <PrivateRoute path="/user/:id?/:uid?" component={User} exact/>
          <PrivateRoute path="/client/:id?/:uid?" component={Client} exact/>
          <PrivateRoute path="/clients" component={Clients} exact/>
          <PrivateRoute path="/tenants" component={Tenants} exact/>
          <PrivateRoute path="/assets" component={Assets} exact/>
          <PrivateRoute path="/asset/:id?/:uid?" component={Asset} exact/>
          <PrivateRoute path="/survey/group/:id?/:uid?" component={SurveyGroup} exact/>
          <PrivateRoute path="/survey/groups" component={SurveyGroups} exact/>
          <PrivateRoute path="/survey/sessions" component={SurveySessions} exact/>
          <PrivateRoute path="/survey/:id?/:uid?" component={Survey} exact/>
          <PrivateRoute path="/surveys" component={Surveys} exact/>
          <PrivateRoute path="/recommendation/bundle/:id?/:uid?" component={RecommendationBundle} exact/>
          <PrivateRoute path="/recommendation/bundles" component={RecommendationBundles} exact/>
          <PrivateRoute path="/recommendation/block/:id?/:uid?" component={RecommendationBlock} exact/>
          <PrivateRoute path="/recommendation/blocks" component={RecommendationBlocks} exact/>
          <PrivateRoute path="/recommendation/category/:id?/:uid?" component={RecommendationCategory} exact/>
          <PrivateRoute path="/recommendation/categories" component={RecommendationCategories} exact/>
          <PrivateRoute path="/recommendation/:id?/:uid?" component={Recommendation} exact/>
          <PrivateRoute path="/recommendations" component={Recommendations} exact/>
          <PrivateRoute component={Home}/>
        </Switch>
      </BrowserRouter>
    </React.Fragment>);
};
