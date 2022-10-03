import React from 'react';
import { Button, Modal, ModalBody } from 'reactstrap';
import { connect } from 'react-redux';
import axios from 'axios';
import Spinner from '../../Spinner/Spinner';
import { resetIngredients } from '../../../redux/actionCreators';
import { Formik } from 'formik';

const mapStateToProps = state => {
    return {
        ingredients: state.ingredients,
        totalPrice: state.totalPrice,
        purchasable: state.purchasable,
        userId: state.userId,
        token: state.token
    }
}

const mapDispatchToProps = dispatch => {
    return {
        resetIngredients: () => dispatch(resetIngredients())
    }
}
 
class Checkout extends React.Component {
    state = {
        isLoading: false,
        isModalOpen: false,
        modalMsg: null
    }

    goBack = () => {
        this.props.history.goBack('/');
    }

    submitHandler = (values) => {
        this.setState({
            isLoading: true
        });
        const order = {
            ingredients: this.props.ingredients,
            customer: values,
            price: this.props.totalPrice,
            userId: this.props.userId
        }
        let url = process.env.REACT_APP_BACKEND_URL;
        axios.post(`${url}/api/order`, order, { headers: { 'Authorization': `Bearer ${this.props.token}` } })
            .then(response => {
                if (response.status === 201) {
                    this.setState({
                        isLoading: false,
                        isModalOpen: true,
                        modalMsg: "Order Placed Successfully!",
                    });
                    this.props.resetIngredients();
                } else {
                    this.setState({
                        isLoading: false,
                        isModalOpen: true,
                        modalMsg: "Something Went Wrong! Order Again!"
                    });
                }
            })
            .catch(error => {
                this.setState({
                    isLoading: false,
                    isModalOpen: true,
                    modalMsg: "Something Went Wrong! Order Again!"
                });
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
        let form = (
            <div>
                <h4 style={{ border: "1px solid grey", boxShadow: "1px 1px #888888", borderRadius: "5px", padding: "20px" }}>Payment: {this.props.totalPrice} BDT</h4>
                <Formik
                    initialValues={
                        {
                           deliveryAddress: "",
                           phone: "",
                           paymentType: "Cash On Delivery"
                        }
                    }

                    onSubmit={
                        (values) => {
                            this.submitHandler(values);
                        }
                    }

                    validate={
                        (values) => {
                            this.addclass();

                            const errors = {};

                            if (!values.deliveryAddress) {
                                errors.deliveryAddress = "Required";
                            }

                            if (!values.phone) {
                                errors.phone = "Required";
                            } else if (isNaN(values.phone)) {
                                errors.phone = "Invalid phone number!";
                            }
                         
                            return errors;
                        }
                    }
                >
                    {({values, handleChange, handleSubmit, errors}) => (
                        <form style={{ border: "1px solid grey", boxShadow: "1px 1px #888888", borderRadius: "5px", padding: "20px" }} onSubmit={handleSubmit}>
                        <textarea name='deliveryAddress' value={values.deliveryAddress} className="form-control" placeholder='Your Address' onChange={handleChange}></textarea>
                        <span className="text-danger error">{errors.deliveryAddress}</span>
                        <br />
                        <input type="text" name='phone' value={values.phone} className="form-control" placeholder='Your Phone Number' onChange={handleChange} />
                        <span className="text-danger error">{errors.phone}</span>
                        <br />
                        <select name="paymentType" value={values.paymentType} className='form-control' onChange={handleChange}>
                            <option value="Cash On Delivery">Cash On Delivery</option>
                            <option value="Bkash">Bkash</option>
                        </select>
                        <br />
                        <Button style={{ background: "#d70f64", borderColor: "#d70f64" }} className="shadow-none me-2" disabled={!this.props.purchasable} type="submit">Place Order</Button>
                        <Button color='secondary' className='shadow-none' onClick={this.goBack}>Cancel</Button>
                    </form>
                    )}
                </Formik>
            </div>
        )
        return (
            <div className='row'>
                <div className='col-lg-8 m-auto'>
                    {this.state.isLoading ? <Spinner /> : form}
                    <Modal isOpen={this.state.isModalOpen} onClick={this.goBack}>
                        <ModalBody>
                            <p style={{ marginBottom: "0" }}>{this.state.modalMsg}</p>
                        </ModalBody>
                    </Modal>
                </div>
            </div>
        );
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Checkout);