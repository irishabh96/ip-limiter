import React, { Component } from "react";
import Recaptcha from "react-recaptcha";
import { recaptcha as key } from "../config";
class RecaptchaInp extends Component {
  render() {
    return (
      <div>
        <Recaptcha sitekey={key} render="explicit" verifyCallback={this.props.handleRecaptcha} />
      </div>
    );
  }
}

export default RecaptchaInp;
