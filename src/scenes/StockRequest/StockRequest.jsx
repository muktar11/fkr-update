import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, MenuItem } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StockRequest = () => {
const [customers, setCustomers] = useState([]);
const [selectedCustomer, setSelectedCustomer] = useState('');
const [selectedCustomerId, setSelectedCustomerId] = useState('');
const [salesRoute, setSalesRoute] = useState('');
const [Q, setQ] = useState(0);
const [H, setH] = useState(0);
const [ONE, setONE] = useState(0);
const [TWO, setTWO] = useState(0);
const [Qp, setQp] = useState(0);
const [Hp, setHp] = useState(0);
const [ONEp, setONEp] = useState(0);
const [TWOp, setTWOp] = useState(0);
const [Q_CASH, setQ_CASH] = useState(0);
const [H_CASH, setH_CASH] = useState(0);
const [ONE_CASH, setONE_CASH] = useState(0);
const [TWO_CASH, setTWO_CASH] = useState(0);
const [Totalp, setTotalp] = useState(0);
const [TotalCash, setTotalCash] = useState(0);
const [plate, setPlate] = useState('');
const [TransportationFee, setTransportationFee] = useState(0);
const [payment, setPayment] = useState(null);
const [Route, setRoute] = useState('');
const [plateOptions, setPlateOptions] = useState([]);
const [selectedPlate, setSelectedPlate] = useState('');

useEffect(() => {
// Fetching customer data from API
fetch('http://localhost:8000/api/webcustomer/approve/list/')
.then((response) => response.json())
.then((data) => setCustomers(data))
.catch((error) => console.log(error));
}, []);

useEffect(() => {
  // Fetching plate options from API
  fetch('http://localhost:8000/commerce/plate-retrieve/')
    .then((response) => response.json())
    .then((data) => setPlateOptions(data))
    .catch((error) => console.log(error));
}, []);

const handleCustomerChange = (event) => {
const selectedCustomerName = event.target.value;
setSelectedCustomer(selectedCustomerName);

// Finding the corresponding sales_route value for the selected customer
const selectedCustomer = customers.find(
  (customer) => customer.customer_name === selectedCustomerName
);
if (selectedCustomer) {
  setSalesRoute(selectedCustomer.sales_route);
  setSelectedCustomerId(selectedCustomer._id);
}
};


useEffect(() => {
if (salesRoute) {
// Fetching Q, H, ONE, TWO values from API based on sales_route
fetch(`http://localhost:8000/commerce/setprice/${salesRoute}/`)
    .then((response) => response.json())
    .then((data) => {
setQ(data.Q);
setH(data.H);
setONE(data.ONE);
setTWO(data.TWO);
// You can set TWO value here if needed
})
.catch((error) => console.log(error));
}
}, [salesRoute]);

const handleQpChange = (event) => {
const newQp = parseInt(event.target.value);
setQp(newQp);
setQ_CASH(newQp * Q); // Calculating Q_CASH

console.log('Q_CASH:', newQp * Q);
};

const handleTransportationFee = (event) => {
  setTransportationFee(event.target.value)
}
const handleHpChange = (event) => {
const newHp = parseInt(event.target.value);
setHp(newHp);
setH_CASH(newHp * H); // Calculating H_CASH

console.log('H_CASH:', newHp * H);
};

const handleONEpChange = (event) => {
const newONEp = parseInt(event.target.value);
setONEp(newONEp);
setONE_CASH(newONEp * ONE); // Calculating ONE_CASH

console.log('ONE_CASH:', newONEp * ONE);
};

const handleTWOpChange = (event) => {
const newTWOp = parseInt(event.target.value);
setTWOp(newTWOp);
setTWO_CASH(newTWOp * TWO); // Calculating ONE_CASH
console.log('TWO_CASH:', newTWOp * TWO);
};


const handlePlateChange = (event) => {
  setSelectedPlate(event.target.value);
};

const handleRouteChange = (event) => {
  setRoute(event.target.value);
};

const handlePaymentChange = (event) => {
const file = event.target.files[0];
setPayment(file);
};

useEffect(() => {
const totalp = Qp + Hp + ONEp + TWOp;
setTotalp(totalp);
}, [Qp, Hp, ONEp, TWOp]);

useEffect(() => {
const totalCash = Q_CASH + H_CASH + ONE_CASH + TWO_CASH +  parseInt(TransportationFee);
setTotalCash(totalCash);
}, [Q_CASH, H_CASH, ONE_CASH, TWO_CASH, TransportationFee]);

const handleFormSubmit = (event) => {
event.preventDefault();
  
if (!selectedCustomer) {
  console.log("No customer selected");
  return;
}

const formData = new FormData();
formData.append('sales_Route', salesRoute);
formData.append('Qp', Qp);
formData.append('Hp', Hp);
formData.append('ONEp', ONEp);
formData.append('TWOp', TWOp);
formData.append('Totalp', Totalp);
formData.append('Q_CASH', Q_CASH);
formData.append('H_CASH', H_CASH);
formData.append('ONE_CASH', ONE_CASH);
formData.append('TWO_CASH', TWO_CASH);
formData.append('Total_CASH', TotalCash);
formData.append('plate', selectedPlate);
formData.append('payment', payment);
formData.append('Route', Route);
formData.append('TransportationFee', TransportationFee)
console.log(formData);
fetch(`http://localhost:8000/commerce/sales-order/create/${selectedCustomerId}`, {
  method: 'POST',
  body: formData,
  
})
  .then((response) => response.json())
  .then((data) => {
    // Handle successful response
    console.log(data);
    toast.success('Order created successfully!');
  })
  .catch((error) => {
    // Handle error
    console.log(error);
    toast.error('An error occurred. Please try again.');
  });
};

return (
  
  <div
  
  style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth:"50%",
    width: "50%",
    minWidth:"30%",
    
    padding: '20px',
    borderRadius: '10px',
    width: '100wh',
    minWidth: '800px',
  

  }}
>
  <div>
  <Header
        title="INTERSTORE TRANSFER REQUEST"
        subtitle="Use the form below to request an Order"
      /> 
    <ToastContainer />
    <form onSubmit={handleFormSubmit}>
      <div style={{display: "flex", alignItems:"center", padding: "20px", justifyContent: "space-between"}}>
      <label htmlFor="salesRoute">To</label>
      <select
        id="customer"
        value={selectedCustomer}
        onChange={handleCustomerChange}
        style={{
          color: "#333",
          margin:" 0 auto",
          padding: "0.7rem 2rem",
          backgroundColor: "rgb(255, 255, 255)",
          border: "none",
          width: "50%",
          maxWidth:"50%",
          width: "50%",
          minWidth:"30%",
          display: "block",
          marginLeft: "1rem",
          marginRight: "2rem",
          borderbottom: "0.3rem solid transparent",
          transition: "all 0.3s",
        }}
      >
        <option value="">-- Select Customer --</option>
        {customers.map((customer) => (
          <option key={customer._id} value={customer.customer_name}>
            {customer.customer_name}
          </option>
        ))}
      </select>
     
     
  <label htmlFor="plate">From:</label>
            <select
              id="plate"
              value={selectedPlate}
              onChange={handlePlateChange}
              style={{
                color: "#333",
                margin:" 0 auto",
                padding: "0.7rem 2rem",
                backgroundColor: "rgb(255, 255, 255)",
                border: "none",
                width: "50%",
                maxWidth:"50%",
                width: "50%",
                minWidth:"30%",
                display: "block",
                marginLeft: "1rem",
                marginRight: "2rem",
                borderbottom: "0.3rem solid transparent",
                transition: "all 0.3s",
              }}
            >
              <option value="">-- Select Plate Number --</option>
              {plateOptions.map((plate) => (
                <option key={plate._id} value={plate.plate_no}>
                  {plate.plate_no}
                </option>
              ))}
            </select>
  </div>





     

   
     <div style={{display: "flex", alignItems:"center", padding:'20px'}} >

     <label htmlFor="Qp">0.3ml Qty:</label>
      <input
        type="number"
        id="Qp"
        label="0.35ml"
        value={Qp}
        onChange={handleQpChange}
        style={{
          margin:" 0 auto",
          padding: "0.7rem 2rem",
          backgroundColor: "rgb(255, 255, 255)",
          border: "none",
          width: "50%",
          maxWidth:"50%",
          width: "50%",
          minWidth:"30%",
          display: "block",
          marginLeft: "2rem",
          marginRight: "1rem",
          borderbottom: "0.3rem solid transparent",
          transition: "all 0.3s",
        }}
      />

      

<label htmlFor="Q_CASH">0.35ml in Value</label>
      <input
        type="text"
        id="Q_CASH"
        value={Q_CASH}
        style={{
          margin:" 0 auto",
          padding: "0.7rem 2rem",
          backgroundColor: "rgb(255, 255, 255)",
          border: "none",
          width: "50%",
          maxWidth:"50%",
          width: "50%",
          minWidth:"30%",
          display: "block",
          marginLeft: "3rem",
          marginRight: "1rem",
          borderbottom: "0.3rem solid transparent",
          transition: "all 0.3s",
       
        }}
      />
 
  

<label htmlFor="TOTAlq">Total  Qty </label>
      <input
        type="text"
        id="Totalp"
        value={Totalp}
        style={{
          margin:" 0 auto",
          padding: "0.7rem 2rem",
          backgroundColor: "rgb(255, 255, 255)",
          border: "none",
          width: "50%",
          maxWidth:"50%",
          width: "50%",
          minWidth:"30%",
          display: "block",
          marginLeft: "3.2rem",
          marginRight: "2rem",
          borderbottom: "0.3rem solid transparent",
          transition: "all 0.3s",
        }}
      />   


 

   

    </div>

<div style={{display: "flex", alignItems:"center", padding:'20px'}}>
<label htmlFor="Hp">0.6ml Qty:</label>
      <input
        type="number"
        id="Hp"
        value={Hp}
        onChange={handleHpChange}
        style={{
          margin:" 0 auto",
          padding: "0.7rem 2rem",
          backgroundColor: "rgb(255, 255, 255)",
          border: "none",
          width: "50%",
          maxWidth:"50%",
          width: "50%",
          minWidth:"30%",
          display: "block",
          marginLeft: "1.8rem",
          marginRight: "2rem",
          borderbottom: "0.3rem solid transparent",
          transition: "all 0.3s",
        }}
      />
     
     <label htmlFor="H_CASH">0.6ml in Value</label>
      <input
        type="text"
        id="H_CASH"
        value={H_CASH}
        style={{
          margin:" 0 auto",
          padding: "0.7rem 2rem",
          backgroundColor: "rgb(255, 255, 255)",
          border: "none",
          width: "50%",
          maxWidth:"50%",
          width: "50%",
          minWidth:"30%",
          display: "block",
          marginLeft: "2.5rem",
          marginRight: "2rem",
          borderbottom: "0.3rem solid transparent",
          transition: "all 0.3s",
        }}
      />

<label htmlFor="TOTAL_CASH">Total in Value</label>
      <input
        type="text"
        id="Total CASH"
        value={TotalCash}
        style={{
          margin:" 0 auto",
          padding: "0.7rem 2rem",
          backgroundColor: "rgb(255, 255, 255)",
          border: "none",
          width: "50%",
          maxWidth:"50%",
          width: "50%",
          minWidth:"30%",
          display: "block",
          marginLeft: "3rem",
          marginRight: "2rem",
          borderbottom: "0.3rem solid transparent",
          transition: "all 0.3s",
        }}
      />   





</div>
  
     

  <div style={{display: "flex", alignItems:"center", padding:'20px'}}>

  <label htmlFor="ONEp">1L Qty:</label>
      <input
        type="number"
        id="ONEp"
        value={ONEp}
        onChange={handleONEpChange}
        style={{
          margin:" 0 auto",
          padding: "0.7rem 2rem",
          backgroundColor: "rgb(255, 255, 255)",
          border: "none",
          width: "50%",
          maxWidth:"20%",
          width: "50%",
          minWidth:"30%",
          display: "block",
          marginLeft: "3rem",
          marginRight: "2rem",
          borderbottom: "0.3rem solid transparent",
          transition: "all 0.3s",
        }}
      />

<label htmlFor="ONE_CASH">1L in Value</label>
      <input
        type="text"
        id="ONE_CASH"
        value={ONE_CASH}
        style={{
          margin:" 0 auto",
          padding: "0.7rem 2rem",
          backgroundColor: "rgb(255, 255, 255)",
          border: "none",
          width: "50%",
          maxWidth:"50%",
          width: "30%",
          minWidth:"30%",
          display: "block",
          marginLeft: "2rem",
          marginRight: "1.5rem",
          borderbottom: "0.3rem solid transparent",
          transition: "all 0.3s",
        }}
      />

           
<label htmlFor="Transportation Fee">Transportation Fee</label>
      <input
        type="text"
        id="Transportation Fee"
        value={TransportationFee}
        onChange={handleTransportationFee}
        style={{
          margin:" 0 auto",
          padding: "0.7rem 2rem",
          backgroundColor: "rgb(255, 255, 255)",
          border: "none",
          width: "50%",
          maxWidth:"50%",
          width: "30%",
          minWidth:"30%",
          display: "block",
          marginLeft: "0.5rem",
          marginRight: "0.11rem",
          borderbottom: "0.3rem solid transparent",
          transition: "all 0.3s",
        }}
      />



</div>
 <div style={{display: "flex", alignItems:"center", padding:'20px'}}>
       
      
<label htmlFor="TWOp">2L Qty:</label>
      <input
        type="number"
        id="TWOp"
        value={TWOp}
        onChange={handleTWOpChange}
        style={{
          margin:" 0 auto",
          padding: "0.7rem 2rem",
          backgroundColor: "rgb(255, 255, 255)",
          border: "none",
          
          maxWidth:"50%",
          width: "30%",
          minWidth:"30%",
          display: "block",
          marginLeft: "2.7rem",
          marginRight: "1rem",
          borderbottom: "0.3rem solid transparent",
          transition: "all 0.3s",
        }}
      />


<label htmlFor="TWO_CASH">2L in Value</label>
      <input
        type="text"
        id="TWO_CASH"
        value={TWO_CASH}
        style={{
          margin:" 0 auto",
          padding: "0.7rem 2rem",
          backgroundColor: "rgb(255, 255, 255)",
          border: "none",
          width: "50%",
          maxWidth:"50%",
          width: "30%",
          minWidth:"30%",
          display: "block",
          marginLeft: "3rem",
          marginRight: "2rem",
          borderbottom: "0.3rem solid transparent",
          transition: "all 0.3s",
        }}
      />   

      
<label htmlFor="handleRouteChange">Sales Route</label>
      <input
        type="text"
        id="handleRouteChange"
        value={Route}
        onChange={handleRouteChange}
        style={{
          margin:" 0 auto",
          padding: "0.7rem 2rem",
          backgroundColor: "rgb(255, 255, 255)",
          border: "none",
          width: "50%",
          maxWidth:"50%",
          width: "30%",
          minWidth:"30%",
          display: "block",
          marginLeft: "3rem",
          marginRight: "2rem",

          borderbottom: "0.3rem solid transparent",
          transition: "all 0.3s",
        }}
      />   
      


</div> 

<div style={{display: "flex", Width:"800px", justifyContent:"space-between", alignItems:"center", padding:'20px'}}>

     
      <button
        type="submit"
        style={{
          padding: '5px',
          borderRadius: '3px',
          backgroundColor: 'blue',
          width: '100px',
          color: 'white',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        Submit
      </button>
</div>

    </form>
  </div>
</div>
);
};
export default StockRequest;