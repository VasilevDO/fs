import React, { Component } from "react";
import "./PwnzCard.css";
import pwnzCardLogo from "../assets/CardLogo.jpg";

class PwnzCard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const pwnzCardWidth = this.props.cardWidth || "";
    const pwnzCardTitle = this.props.cardTitle || "Card title";
    const pwnzCardDescription =
      this.props.cardDescription || "Card description";
    const pwnzCardLogoWidth = this.props.logoWidth || "150px";
    const pwnzLogo = this.props.logo || pwnzCardLogo;
    const pwnzCardButtonText = this.props.buttonText || "Select";
    return (
      <>
        <div className="pwnz-card-body" style={{ height: pwnzCardWidth }}>
          <div className="pwnz-card-title">
            <p>{pwnzCardTitle}</p>
          </div>
          <img src={pwnzLogo} style={{ width: pwnzCardLogoWidth }}></img>
          <div className="pwnz-card-description">
            <p> {pwnzCardDescription} </p>
          </div>
          <button className="pwnz-card-button">{pwnzCardButtonText}</button>
        </div>
      </>
    );
  }
}

export default PwnzCard;
