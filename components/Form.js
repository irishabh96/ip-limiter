import React from "react";
import Input from "./Input";
import RecaptchaInp from "./RecaptchaInp";
import fetch from "isomorphic-unfetch";
import { form as formConfig } from "../config";
import Alert from "./Alert";

const initialState = {
  signup: {
    name: "",
    email: "",
    password: ""
  },
  requestStarted: false,
  isValidated: true,
  showCaptcha: false,
  isCreated: false,
  error: false
};
export default class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  ipCount = async () => {
    try {
      let result = await fetch("http://localhost:3000/test");
      let data = await result.json();

      data.result > 3
        ? await this.setState({
            showCaptcha: true,
            isValidated: false
          })
        : "";
    } catch (err) {
      console.log(err);
    }
  };

  handleRecaptcha = e => {
    if (e) {
      this.setState({
        isValidated: true,
        requestStarted: false
      });
    }
  };

  onChange = e => {
    let name = e.target.name;
    let value = e.target.value;

    let newState = Object.assign({}, this.state);
    newState.signup[name] = value;
    this.setState(newState);
  };

  onSubmit = e => {
    e.preventDefault();

    this.setState({
      requestStarted: true
    });

    fetch("http://localhost:3000/test", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(this.state.signup)
    }).then(response => {
      if (response.status == 200) {
        this.setState({ isCreated: true, message: "User Successfully Created", requestStarted: false });
      } else if (response.status == 409) {
        this.setState({ isCreated: false, error: true, message: "User Already Exists", requestStarted: false });
      } else {
        this.setState({ isCreated: false, error: true, message: "Something Went Wrong!", requestStarted: false });
      }

      setTimeout(() => {
        this.ipCount();
        window.location.reload();
      }, 3000);
    });
  };

  componentWillMount() {
    this.ipCount();
  }

  render() {
    let { signup, error, isCreated, message, showCaptcha, isValidated, requestStarted } = this.state;
    return (
      <div>
        <div className="wrapper fadeInDown">
          <div id="formContent">
            <div className="fadeIn p-2 first">
              <h3>Register</h3>
            </div>
            {error || isCreated ? <Alert message={message} /> : ""}

            <form onSubmit={this.onSubmit}>
              {Object.keys(formConfig).map((item, index) => (
                <Input
                  key={index}
                  type={item == "password" ? "password" : item == "email" ? "email" : "text"}
                  name={item}
                  placeholder={formConfig[item].title}
                  required
                  onChange={this.onChange}
                  value={signup[item]}
                />
              ))}
              {this.state.showCaptcha && <RecaptchaInp handleRecaptcha={this.handleRecaptcha} />}
              <button className="fadeIn third disabled" disabled={isValidated ? false : true}>
                {requestStarted ? (
                  <span className="spinner-grow mr-3 spinner-grow-sm" role="status" aria-hidden="true" />
                ) : (
                  ""
                )}
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
