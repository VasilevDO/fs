import React, { Component } from "react";
import "./PwnzCard.css";
import pwnzCardLogo from "../assets/CardLogo.jpg";

class PwnzCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: this.props.cardTitle || 'Card title'
    };
  }

  handleButtonClick = () => {
    const title = this.state.title;
    this.props.buttonHandler(title);
  }

  render() {
    const pwnzCardWidth = this.props.cardWidth || "";
    const pwnzCardTitle = this.state.title;
    const pwnzCardDescription =
      this.props.cardDescription || "Card description";
    const pwnzCardLogoWidth = this.props.logoWidth || "150px";
    const pwnzLogo = this.props.logo || pwnzCardLogo;
    const pwnzCardButtonText = this.props.buttonText || "Select";
    return (
      <>
        <div className="pwnz-card-body pwnz-mainTheme" style={{ height: pwnzCardWidth }}>
          <div className="pwnz-card-title">
            <p>{pwnzCardTitle}</p>
          </div>
          <img src={pwnzLogo} alt={pwnzCardTitle} style={{ width: pwnzCardLogoWidth }}></img>
          <div className="pwnz-card-description">
            <p> {pwnzCardDescription} </p>
          </div>
          <div className='pwnz-button pwnz-w100' >
            <div onClick={this.handleButtonClick}>{pwnzCardButtonText}</div>
          </div>
        </div>
      </>
    );
  }
}

export default PwnzCard;
