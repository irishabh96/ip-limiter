import React, { Component } from "react";

export default class Input extends Component {
  render() {
    return (
      <div>
        <input {...this.props} />
      </div>
    );
  }
}
