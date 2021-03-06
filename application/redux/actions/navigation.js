import { NavigationActions } from '@expo/ex-navigation';
import Router from '../../../Router';

export function goToAuthorization(petitionLink) {
  return (dispatch, getState) => {
    const navigatorUID = getState().navigation.currentNavigatorUID;
    const route = Router.getRoute('authorisation', { petitionLink });
    const action = NavigationActions.push(navigatorUID, route);
    dispatch(action);
  };
}

export function goToPetitionSummary() {
  return (dispatch, getState) => {
    const navigatorUID = getState().navigation.currentNavigatorUID;
    const route = Router.getRoute('petitionSummary');
    const action = NavigationActions.push(navigatorUID, route);
    dispatch(action);
  };
}

export function goToAttributesSummary() {
  return (dispatch, getState) => {
    const navigatorUID = getState().navigation.currentNavigatorUID;
    const route = Router.getRoute('attributesSummary', { petitionId: getState().petition.petition.id });
    const action = NavigationActions.push(navigatorUID, route);
    dispatch(action);
  };
}

export function goToAttributesLanding() {
  return (dispatch, getState) => {
    const navigatorUID = getState().navigation.currentNavigatorUID;
    const action = NavigationActions.push(navigatorUID, Router.getRoute('attributesLanding'));
    dispatch(action);
  };
}

export function goToSignOutcome() {
  return (dispatch, getState) => {
    const navigatorUID = getState().navigation.currentNavigatorUID;
    const action = NavigationActions.push(navigatorUID, Router.getRoute('signOutcome'));
    dispatch(action);
  };
}

export function goToPinSetup() {
  return (dispatch, getState) => {
    const navigatorUID = getState().navigation.currentNavigatorUID;
    const action = NavigationActions.push(navigatorUID, Router.getRoute('pinSetup'));
    dispatch(action);
  };
}

export function goToHome() {
  return (dispatch, getState) => {
    const navigatorUID = getState().navigation.currentNavigatorUID;
    const action = NavigationActions.push(navigatorUID, Router.getRoute('home'));
    dispatch(action);
  };
}

export function goToPilotScreen() {
  return (dispatch, getState) => {
    const link = getState().decidimInfo.petitionLink;
    if (link) {
      dispatch(goToAttributesSummary());
    } else {
      dispatch(goToAttributesLanding());
    }
  };
}

export function goToNewAttributes() {
  return (dispatch, getState) => {
    const navigatorUID = getState().navigation.currentNavigatorUID;
    const action = NavigationActions.push(navigatorUID, Router.getRoute('newAttributes'));
    dispatch(action);
  };
}

export function goToError() {
  return (dispatch, getState) => {
    const navigatorUID = getState().navigation.currentNavigatorUID;
    const action = NavigationActions.push(navigatorUID, Router.getRoute('error'));
    dispatch(action);
  };
}

export function goToNewDateOfBirthAttribute() {
  return (dispatch, getState) => {
    const navigatorUID = getState().navigation.currentNavigatorUID;
    const action = NavigationActions.push(navigatorUID, Router.getRoute('newDateOfBirthAttribute'));
    dispatch(action);
  };
}
