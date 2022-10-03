import React, { Component } from 'react';
import { Formik } from 'formik';
import {Button, Alert} from 'reactstrap';
import { auth } from '../../redux/authActionCreators';
import { connect } from 'react-redux';
import Spinner from '../Spinner/Spinner';

const mapStateToProps = state => {
    return {
        authLoading: state.authLoading,
        authFailedMsg: state.authFailedMsg
    }
}

const mapDispatchToProps = dispatch => {
    return {
        auth: (email, password, mode) => dispatch(auth(email, password, mode))
    }
}

class Auth extends Component {
    state = {
        mode: "Sign Up"
    }

    switchModeHandler = () => {
        this.setState({
            mode: this.state.mode === "Sign Up" ? "Login" : "Sign Up"
        });
    }

    addclass = () => {
        const errorList = document.querySelectorAll('.error');
        errorList.forEach(error => {
            error.style.display = 'inline-block';
            error.style.marginBottom = "12px";
        });
    }

    render() {
        let err = null;
        if (this.props.authFailedMsg !== null) {
            err = <Alert color="danger">{this.props.authFailedMsg}</Alert>
        }

        let form = null;
        if (this.props.authLoading) {
            form = <Spinner />
        } else {
            form = (
<Formik
                    initialValues={
                        {
                            email: "",
                            password: "",
                            passwordConfirm:""
                        }
                    }

                    onSubmit={
                        (values) => {
                            this.props.auth(values.email, values.password, this.state.mode)
                        }
                    }

                    validate={
                        (values) => {
                            this.addclass();
                            const errors = {};

                            if (!values.email) {
                                errors.email = "Required";
                            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                                errors.email = "Invalid email address!";
                            }

                            if (!values.password) {
                                errors.password = "Required";
                            } else if (values.password.length < 4) {
                                errors.password = "Must be at least 4 characters!";
                            }

                            if (this.state.mode === "Sign Up") {
                                if (!values.passwordConfirm) {
                                    errors.passwordConfirm = "Required";
                                } else if (values.password !== values.passwordConfirm) {
                                    errors.passwordConfirm = "Password field doesn't match!";
                                }
                            }

                            return errors;
                        }
                    }
                >
                    {({values, handleChange, handleSubmit, errors}) => (
                        <div style={{ border: "1px solid grey", boxShadow: "1px 1px #888888", borderRadius: "5px", padding: "15px" }} className="col-lg-8 col-md-10 m-auto">
                            <Button style={{ background: "#d70f64", borderColor: "#d70f64", fontSize: "18px" }} className="shadow-none w-100" onClick={this.switchModeHandler}>Switch to {this.state.mode === "Sign Up" ? "Login" : "Sign Up"}</Button>
                            <br /><br />
                            <form onSubmit={handleSubmit}>
                                <input 
                                    type="email"
                                    name='email'
                                    placeholder='Enter Your Email'
                                    className='form-control'
                                    value={values.email}
                                    onChange={handleChange}
                                />
                                <span className="text-danger error">{errors.email}</span>
                                <br />
                                <input 
                                    type="password"
                                    name='password'
                                    placeholder='Password'
                                    className='form-control'
                                    value={values.password}
                                    onChange={handleChange}
                                />
                                <span className="text-danger error">{errors.password}</span>
                                <br />
                                {this.state.mode === "Sign Up" ? <div>
                                    <input 
                                        type="password"
                                        name='passwordConfirm'
                                        placeholder='Confirm Password'
                                        className='form-control'
                                        value={values.passwordConfirm}
                                        onChange={handleChange}
                                    />
                                    <span className="text-danger error">{errors.passwordConfirm}</span>
                                    <br />
                                </div> : null}
                                <button type="submit" className="btn btn-success">{this.state.mode === "Sign Up" ? "Sign Up" : "Login"}</button>
                            </form>
                        </div>
                    )}
                </Formik>
            )
        }
        return (
            <div>
                {err}
                {form}
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth);