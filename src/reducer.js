import * as PageActionTypes from "./actionTypes";

const initialState = {
  interest: 0,
  maturity: 0,
  credit: 0,
  remaining: 0,
  option: [],
  optionBuy: [],
  selectedContent: "Türk Lirası",
  selectedContentBuy: "Türk Lirası",
  radioSelected: "",
  listOfInstallment: [
    {
      period: 1,
      installmentPrice: 0,
      paidInterest: 0,
      paidPrincipal: 0,
      remainingPrincipal: 0
    }
  ]
};

function addReducer(state = initialState, action) {
  switch (action.type) {
    case PageActionTypes.SET_PRINCIPAL:
      return {
        ...state,
        credit: action.options
      };
    case PageActionTypes.SET_INTEREST:
      return {
        ...state,
        interest: action.options
      };
    case PageActionTypes.SET_MATURITY:
      return {
        ...state,
        maturity: action.options
      };
    case PageActionTypes.ADD_INSTALLMENT:
      return {
        ...state,
        listOfInstallment: [...state.listOfInstallment, action.options]
      };
    case PageActionTypes.SET_REMAINING_PRINCIPAL:
      return {
        ...state,
        remaining: action.options
      };

    case PageActionTypes.SET_LIST:
      return {
        ...state,
        listOfInstallment: action.options
      };
    case PageActionTypes.SET_RATE:
      return {
        ...state,
        selectedContent: action.options
      };
    case PageActionTypes.SET_RATE_BUY:
      return {
        ...state,
        selectedContentBuy: action.options
      };

    case PageActionTypes.OPTION_LIST:
      return {
        ...state,
        option: [...state.option, action.options]
      };
    case PageActionTypes.SELECTED_RADIO:
      return {
        ...state,
        radioSelected: action.options
      };
    default:
      return state;
  }
}
export default addReducer;
