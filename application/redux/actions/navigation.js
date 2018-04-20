import { NavigationActions } from '@expo/ex-navigation';
import Store from '../store';
import Router from '../../../Router';

export function goQRScannerIntro() {
  const navigatorUID = Store.getState().navigation.currentNavigatorUID;
  return NavigationActions.push(navigatorUID, Router.getRoute('QRScannerIntro'));
}

export function goToAuthorization(petitionLink) {
  const navigatorUID = Store.getState().navigation.currentNavigatorUID;
  const route = Router.getRoute('authorisation', { petitionLink });
  return NavigationActions.push(navigatorUID, route);
}

export function goToQRScanner() {
  const navigatorUID = Store.getState().navigation.currentNavigatorUID;
  return NavigationActions.push(navigatorUID, Router.getRoute('QRScanner'));
}

export function goToPetitionSummaryGet(petitionLink) {
  const navigatorUID = Store.getState().navigation.currentNavigatorUID;
  const route = Router.getRoute('petitionSummaryGet', { petitionLink });
  return NavigationActions.push(navigatorUID, route);
}

export function goToPetitionSummarySign(petitionLink) {
  const navigatorUID = Store.getState().navigation.currentNavigatorUID;
  const route = Router.getRoute('petitionSummarySign', { petitionLink });
  return NavigationActions.push(navigatorUID, route);
}

export function goToSignConfirmation() {
  const navigatorUID = Store.getState().navigation.currentNavigatorUID;
  return NavigationActions.push(navigatorUID, Router.getRoute('signConfirmation'));
}
