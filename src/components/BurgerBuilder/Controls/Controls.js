import React from 'react';
import { Card, CardBody, CardHeader, CardFooter, Button } from 'reactstrap';

const controls = [
    {label: "Salad", type: "salad"},
    {label: "Meat", type: "meat"},
    {label: "Cheese", type: "cheese"},
]

const BuildControl = props => {
    return (
        <div className='d-flex'>
            <div className='me-auto ms-5' style={{ fontWeight: "bold", fontSize: "1.3rem" }}>{props.label}</div>
            <button className='btn btn-danger btn-sm m-1 shadow-none' onClick={props.removed}>Less</button>
            <button className='btn btn-success btn-sm m-1 shadow-none' onClick={props.added}>More</button>
        </div>
    )
}
 
const Controls = props => {
    return (
        <div className='container text-center'>
            <Card style={{ marginTop: "30px", marginBottom: "30px" }}>
                <CardHeader style={{ background: "#d70f64", color: "white" }}><h4>Add Ingredients</h4></CardHeader>
                <CardBody>
                {
                    controls.map(item => {
                        return <BuildControl 
                            label={item.label} 
                            type={item.type} 
                            key={Math.random()} 
                            added={() => props.ingredientAdded(item.type)}
                            removed={() => props.ingredientRemoved(item.type)}
                        />
                    })
                }
                </CardBody>
                <CardFooter><h4>Price: <strong>{props.price}</strong> BDT</h4></CardFooter>
                <Button style={{ background: "#d70f64", borderColor: "#d70f64" }} className="shadow-none" onClick={props.toggleModal} disabled={!props.purchasable}>Order Now</Button>
            </Card>
        </div>
    );
};

export default Controls;