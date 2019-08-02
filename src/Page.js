import React, { PureComponent } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as PageActions from "./actions";
import Select from "react-select";

class Page extends PureComponent {
  state = {
    rate: [],
    sellPrice: null,
    buyPrice: null,
    didDataComeSell: false,
    didDataComeBuy: false,
    selectedOption: ""
  };

  fetchRate() {
    fetch(`https://api.canlidoviz.com/web/items?marketId=1&type=0`)
      .then(response => response.json())
      .then(data => {
        this.setState({
          rate: data
        });
      });
  }

  componentDidMount() {
    this.fetchRate();
  }
  handleChange = () => {
    console.log(this.state.selectedOption);
    if (
      this.state.didDataComeSell === true &&
      this.state.didDataComeBuy === false
    ) {
      let sumSellPrice = this.state.sellPrice * this.credit.value;
      this.props.actions.setPrincipal(sumSellPrice);
    } else if (
      this.state.didDataComeBuy === true &&
      this.state.didDataComeSell === false
    ) {
      let sumBuyPrice = this.state.buyPrice * this.credit.value;
      this.props.actions.setPrincipal(sumBuyPrice);
    } else if (
      this.state.didDataComeBuy === false &&
      this.state.didDataComeSell === false
    ) {
      debugger;
      this.props.actions.setPrincipal(this.credit.value);
    } else if (
      this.state.didDataComeBuy === true &&
      this.state.didDataComeSell === true
    ) {
      debugger;
      let sumMixed = this.state.buyPrice * this.credit.value;
      sumMixed = sumMixed / this.state.sellPrice;
      this.props.actions.setPrincipal(sumMixed);
    }

    this.props.actions.setRemainingPrincipal(this.credit.value);
    this.credit.value = "";

    this.props.actions.setMaturity(this.maturity.value);
    this.maturity.value = "";

    this.props.actions.setInterest(this.interest.value / 100);
    this.interest.value = "";
  };

  createOfInstallment = props => {
    this.props.actions.setList([]);
    let residual = this.props.state.credit;
    for (var i = 1; i <= this.props.state.maturity; i++) {
      let installmentPriceH =
        this.props.state.credit *
        ((this.props.state.interest *
          (parseFloat(this.props.state.interest) + 1) **
            this.props.state.maturity) /
          ((parseFloat(this.props.state.interest) + 1) **
            this.props.state.maturity -
            1));

      installmentPriceH = installmentPriceH.toFixed(2);
      let interestPriceH = residual * this.props.state.interest;
      interestPriceH = interestPriceH.toFixed(2);

      let principalPriceH = installmentPriceH - interestPriceH;
      principalPriceH = principalPriceH.toFixed(2);

      let remainingPrincipalH = residual - principalPriceH;
      remainingPrincipalH = remainingPrincipalH.toFixed(2);

      residual = parseFloat(residual) - parseFloat(principalPriceH);

      if (i == this.props.state.maturity) {
        if (remainingPrincipalH !== 0) {
          principalPriceH =
            parseFloat(remainingPrincipalH) + parseFloat(principalPriceH);
          installmentPriceH =
            parseFloat(remainingPrincipalH) + parseFloat(installmentPriceH);
          remainingPrincipalH = 0;
          installmentPriceH = installmentPriceH.toFixed(2);
          principalPriceH = principalPriceH.toFixed(2);
        }
      }

      const newInstallment = {
        period: i,
        installmentPrice: installmentPriceH,
        paidInterest: interestPriceH,
        paidPrincipal: principalPriceH,
        remainingPrincipal: remainingPrincipalH
      };
      this.props.actions.addInstallment(newInstallment);
    }
  };

  renderList = () => {
    return this.props.state.listOfInstallment.map(object => {
      return (
        <tr className="tablesonuc">
          <td>{object.period}</td>
          <td>{object.installmentPrice}</td>
          <td>{object.paidInterest}</td>
          <td>{object.paidPrincipal}</td>
          <td>{object.remainingPrincipal}</td>
        </tr>
      );
    });
  };

  renderSelectedBuy = () => {
    const { selectedContentBuy } = this.props.state;
    let options = [];
    this.state.rate.map(object => {
      options = [...options, object.name];
    });
    options = Array.from(new Set(options));

    let optionBuy = [];
    options.map(object => (optionBuy = [...optionBuy, { label: object }]));

    return (
      <Select
        value={selectedContentBuy}
        onChange={this.handleSelectedBuy}
        className="selectedBuy"
        placeholder="Para Birimi"
        options={optionBuy}
      />
    );
  };

  handleSelectedBuy = selectedContentBuy => {
    this.setState({ didDataComeBuy: true });
    this.props.actions.setRateBuy(selectedContentBuy.label);
  };
  renderBuyPrice = () => {
    return this.state.rate
      .filter(object => object.name === this.props.state.selectedContentBuy)
      .map(obj => {
        return (
          <div className="fiyat">{this.handleBuyPrice(obj.sellPrice)}</div>
        );
      });
  };

  handleBuyPrice = selectedContentBuy => {
    this.setState({ buyPrice: selectedContentBuy });
  };

  renderSelectedSell = () => {
    const { selectedContent } = this.props.state;
    let options = [];
    this.state.rate.map(object => {
      options = [...options, object.name];
    });
    options = Array.from(new Set(options));

    let option = [];
    options.map(object => (option = [...option, { label: object }]));

    return (
      <Select
        value={selectedContent}
        onChange={this.handleSelectedSell}
        className="selectedSell"
        placeholder="Para Birimi"
        options={option}
      />
    );
  };

  handleSelectedSell = selectedContent => {
    this.setState({ didDataComeSell: true });
    this.props.actions.setRate(selectedContent.label);
  };
  renderSellPrice = () => {
    return this.state.rate
      .filter(object => object.name === this.props.state.selectedContent)
      .map(obj => {
        return (
          <div className="fiyat">{this.handleSellPrice(obj.sellPrice)}</div>
        );
      });
  };

  handleSellPrice = selectedContent => {
    this.setState({ sellPrice: selectedContent });
  };
  onChangeOption = ({ target: { value } }) =>
    this.setState({ selectedOption: value });

  render() {
    return (
      <div className="container">
        <div className="rate-information">
          <h3>KUR BİLGİLERİ</h3>

          <h4>Alınacak Para Tipi</h4>
          <div className="box">{this.renderSelectedBuy()}</div>
          {this.renderBuyPrice()}

          <h4>Ödenecek Para Tipi</h4>
          <div className="box">{this.renderSelectedSell()}</div>
          {this.renderSellPrice()}
          <div className="comboresult">
            <div className="alert alert-light" role="alert">
              Alınacak Para Tipi
            </div>
            <div className="alert alert-info" role="alert">
              {this.props.state.selectedContentBuy}
            </div>
            <br />
            <div className="alert alert-light" role="alert">
              Ödenecek Para Tipi
            </div>
            <div className="alert alert-info" role="alert">
              {this.props.state.selectedContent}
            </div>
          </div>
        </div>
        <div className="clear" />
        <div className="operation-information">
          <h3>İŞLEM BİLGİLERİ</h3>
          <h4>İşlem Tipi</h4>
          <div class="custom-control custom-radio custom-control-inline">
            <input
              type="radio"
              className="custom-control-input"
              value="Secenek"
              id="customRadio"
              name="options"
              onChange={this.onChangeOption}
              onChecked={this.state.selectedOption === "customRadio"}
            />
            <label className="custom-control-label" for="customRadio">
              Eşit Anaparalı Taksit
            </label>
          </div>
          <br />
          <div class="custom-control custom-radio custom-control-inline">
            <input
              type="radio"
              className="custom-control-input"
              value="Secenek2"
              id="customRadio2"
              name="options"
              onChange={this.onChangeOption}
              onChecked={this.state.selectedOption === "customRadio2"}
            />
            <label className="custom-control-label" for="customRadio2">
              Eşit Faizli Taksit
            </label>
          </div>
          <br />
          <div class="custom-control custom-radio custom-control-inline">
            <input
              type="radio"
              className="custom-control-input"
              value="Secenek3"
              id="customRadio3"
              name="options"
              onChange={this.onChangeOption}
              onChecked={this.state.selectedOption === "customRadio3"}
            />
            <label className="custom-control-label" for="customRadio3">
              Eşit Taksit Tutarlı Taksit
            </label>
          </div>
          <div className="rate-type">
            <h4>Kredi Bilgileri</h4>
            <div className="input-group mb-3" id="inputs">
              <input
                type="text"
                key="kr"
                className="form-control"
                ref={kr => (this.credit = kr)}
                placeholder="Kredi Tutarı"
                aria-label=""
                aria-describedby="basic-addon1"
              />
            </div>
            <div className="input-group mb-3" id="inputs">
              <input
                type="text"
                key="vd"
                className="form-control"
                ref={vd => (this.maturity = vd)}
                placeholder="Kredi Vadesi"
                aria-label=""
                aria-describedby="basic-addon1"
              />
            </div>
            <div className="input-group mb-3" id="inputs">
              <input
                type="text"
                key="fz"
                className="form-control"
                ref={fz => (this.interest = fz)}
                placeholder="Faiz Oranı"
                aria-label=""
                aria-describedby="basic-addon1"
              />
            </div>
            <button
              type="button"
              className="btn btn-light"
              id="operationbutton"
              onClick={this.handleChange}
            >
              Kaydet
            </button>
            <button
              type="button"
              className="btn btn-light"
              id="operationbutton"
              onClick={this.createOfInstallment}
            >
              Hesapla
            </button>
          </div>
        </div>

        <div className="temizle" />
        {this.props.state.listOfInstallment.length > 1 && (
          <div className="result">
            <table className="table table-bordered">
              <thead class="table-info">
                <th> Dönem </th>
                <th> Taksit Tutarı </th>
                <th> Ödenen Faiz</th>
                <th> Ödenen Anapara</th>
                <th> Kalan Anapara</th>
              </thead>
              {this.renderList([])}
            </table>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  state: state
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(PageActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Page);
