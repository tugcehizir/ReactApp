import * as PageActionTypes from "./actionTypes";

export function setInterest(options) {
  return {
    type: PageActionTypes.SET_INTEREST,
    options: options
  };
}

export function setMaturity(options) {
  return {
    type: PageActionTypes.SET_MATURITY,
    options: options
  };
}

export function setPrincipal(options) {
  return {
    type: PageActionTypes.SET_PRINCIPAL,
    options: options
  };
}

export function addInstallment(options) {
  return {
    type: PageActionTypes.ADD_INSTALLMENT,
    options: options
  };
}
export function setList(options) {
  return {
    type: PageActionTypes.SET_LIST,
    options: options
  };
}
export function setRemainingPrincipal(options) {
  return {
    type: PageActionTypes.SET_REMAINING_PRINCIPAL,
    options: options
  };
}
export function setRate(options) {
  return {
    type: PageActionTypes.SET_RATE,
    options: options
  };
}
export function optionList(options) {
  return {
    type: PageActionTypes.OPTION_LIST,
    options: options
  };
}
export function setRateBuy(options) {
  return {
    type: PageActionTypes.SET_RATE_BUY,
    options: options
  };
}
export function selectedRadio(options) {
  return {
    type: PageActionTypes.SELECTED_RADIO,
    options: options
  };
}
