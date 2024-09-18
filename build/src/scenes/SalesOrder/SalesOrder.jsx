import React, { useState, useEffect } from 'react';
import { Box, Button, TextField,Checkbox,FormControlLabel, MenuItem } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const SalesOrder = () => {
const [customers, setCustomers] = useState([]);
const [selectedCustomer, setSelectedCustomer] = useState('');
const [selectedCustomerId, setSelectedCustomerId] = useState('');
const [salesRoute, setSalesRoute] = useState('');
const [Q, setQ] = useState('');
const [H, setH] = useState('');
const [ONE, setONE] = useState('');
const [TWO, setTWO] = useState('');
const [Qp, setQp] = useState('');
const [Hp, setHp] = useState('');
const [ONEp, setONEp] = useState('');
const [TWOp, setTWOp] = useState('');
const [Q_CASH, setQ_CASH] = useState('');
const [H_CASH, setH_CASH] = useState('');
const [ONE_CASH, setONE_CASH] = useState('');
const [TWO_CASH, setTWO_CASH] = useState('');
const [Totalp, setTotalp] = useState('');
const [TotalCash, setTotalCash] = useState('');
const [ledgerBalance, setLedgerBalance] = useState('');
const [plate, setPlate] = useState('');
const [TransportationFee, setTransportationFee] = useState('');
const [payment, setPayment] = useState(null);
const [Route, setRoute] = useState('');
const [plateOptions, setPlateOptions] = useState([]);
const [selectedPlate, setSelectedPlate] = useState('');

useEffect(() => {
// Fetching customer data from API
fetch(process.env.REACT_APP_API_URL+'/api/webcustomer/approve/list/')
.then((response) => response.json())
.then((data) => setCustomers(data))
.catch((error) => console.log(error));
}, []);

useEffect(() => {
  // Fetching plate options from API
  fetch(process.env.REACT_APP_API_URL+'/commerce/plate-retrieve/')
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

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

useEffect(() => {
if (salesRoute) {
// Fetching Q, H, ONE, TWO values from API based on sales_route
fetch(process.env.REACT_APP_API_URL+`/commerce/sort_price/${salesRoute}/`)
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


useEffect(() => {
  if (selectedCustomerId) {
    // Fetching ledger balance from API based on selectedCustomerId
    fetch(process.env.REACT_APP_API_URL+`/commerce/ledger-deposit-view/${selectedCustomerId}`)
      .then((response) => response.json())
      .then((data) => setLedgerBalance(data.Balance)) // Update here
      .catch((error) => console.log(error));
      
  }
}, [selectedCustomerId]);

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
  const totalp = (Qp || 0) + (Hp || 0) + (ONEp || 0) + (TWOp || 0);
  setTotalp(totalp || '');

  const totalCash = parseInt(Q_CASH || 0) + parseInt(H_CASH || 0) + parseInt(ONE_CASH || 0) + parseInt(TWO_CASH || 0) + parseInt(TransportationFee || 0);
  setTotalCash(totalCash || '');
}, [Qp, Hp, ONEp, TWOp, Q_CASH, H_CASH, ONE_CASH, TWO_CASH, TransportationFee]);


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
formData.append('ledgerBalance', ledgerBalance);
formData.append('Route', Route);
formData.append('TransportationFee', TransportationFee)
console.log(formData);
fetch(process.env.REACT_APP_API_URL+`/commerce/sales-order/create/${selectedCustomerId}`, {
  method: 'POST',
  body: formData,
  
})
.then((response) => {
  if (response.status === 400) {
    throw new Error('Not enough balance.');
    toast.error('NOT ENOUGH BALANCE!!!')
  }
  return response.json();
})
.then((data) => {
  // Handle successful response
  console.log(data);
  toast.success('Order created successfully!');
  setSelectedCustomer('');
  setSelectedCustomerId('');
  setSalesRoute('');
  setQ('');
  setH('');
  setONE('');
  setTWO('');
  setQp('');
  setHp('');
  setONEp('');
  setTWOp('');
  setQ_CASH('');
  setH_CASH('');
  setONE_CASH('');
  setTWO_CASH('');
  setTotalp('');
  setTotalCash('');
  setLedgerBalance('');
  setPlate('');
  setTransportationFee('');
  setPayment(null);
  setRoute('');
  setSelectedPlate('');
})
.catch((error) => {
  // Handle error
  console.log(error);
  toast.error(error.message || 'An error occurred. Please try again.');
});
};


return (
  


  <div  style={{ display: "flex", flexDirection: "column",  padding: "20px",  width: "100%", minWidth:"100%"}}>
  <Header
        title="Create Sales Order"
        subtitle="Use the form below to register an Order"
      /> 
    <ToastContainer />
    

    <form onSubmit={handleFormSubmit}>
      <div style={{display: "flex",   width: "100%", padding: "20px", alignItems:"center",   justifyContent: "space-between"}}>
<div style={{ display: "flex", flexDirection: "row",  alignItems:"center",marginBottom: "10px" }}>
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
          width: "100%",
          maxWidth:"100%",     
          minWidth:"30%",
          display: "block",
      
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
</div>
  
<div>
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
                width: "100%",
          maxWidth:"100%",
        
          minWidth:"30%",
                display: "block",
             
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
             
   
   <div>
   <input
  type="text"
  id="ledgerBalance"
  placeholder="Ledger Balance"
  value={ledgerBalance}
  readOnly
  style={{
    margin:" 0 auto",
    padding: "0.7rem 2rem",
    backgroundColor: "rgb(255, 255, 255)",
    border: "none",
    width: "100%",
          maxWidth:"100%",   
          minWidth:"30%",
    display: "block",
    borderbottom: "0.3rem solid transparent",
    transition: "all 0.3s",
  }}
/>
   </div>
            

<div style={{ display: "flex", flexDirection: "row",  alignItems:"center", marginBottom: "10px" }}>
<input
        type="text"
        id="salesRoute"
        placeholder="Area"
        value={salesRoute}
        readOnly
        style={{
          margin:" 0 auto",
          padding: "0.7rem 2rem",
          backgroundColor: "rgb(255, 255, 255)",
          border: "none",
          width: "100%",
          maxWidth:"100%",
          minWidth:"30%",
          display: "block",
        
          borderbottom: "0.3rem solid transparent",
          transition: "all 0.3s",
        }}
      />
</div>


 
     


          
  </div>


     

   
     <div style={{display: "flex",   width: "100%", padding: "20px", alignItems:"center",   justifyContent: "space-between"}} >

  <div style={{ display: "flex", flexDirection: "row",  alignItems:"center",marginBottom: "10px" }}>
  <input
        type="number"
        id="Qp"
        label="0.35ml"
        placeholder="0.3ml Qty:"
        value={Qp}
        onChange={handleQpChange}
        style={{
          margin:" 0 auto",
          padding: "0.7rem 2rem",
          backgroundColor: "rgb(255, 255, 255)",
          border: "none",
          width: "100%",
          maxWidth:"100%",     
          minWidth:"30%",
          display: "block",
       
          borderbottom: "0.3rem solid transparent",
          transition: "all 0.3s",
        }}
      />

  </div>
     
      
<div style={{ display: "flex", flexDirection: "row",  alignItems:"center",marginBottom: "10px" }}>
<input
        type="number"
        id="Hp"
        placeholder="0.6ml Qty:"
        value={Hp}
        onChange={handleHpChange}
        style={{
          margin:" 0 auto",
          padding: "0.7rem 2rem",
          backgroundColor: "rgb(255, 255, 255)",
          border: "none",
          width: "100%",
          maxWidth:"100%",     
          minWidth:"30%",
          display: "block",
       
          borderbottom: "0.3rem solid transparent",
          transition: "all 0.3s",
        }}
      />

</div>

<div style={{ display: "flex", flexDirection: "row",  alignItems:"center",marginBottom: "10px" }}>
<input
        type="number"
        id="ONEp"
        placeholder="1L Qty:"
        value={ONEp}
        onChange={handleONEpChange}
        style={{
          margin:" 0 auto",
          padding: "0.7rem 2rem",
          backgroundColor: "rgb(255, 255, 255)",
          border: "none",
          width: "100%",
          maxWidth:"100%",     
          minWidth:"30%",
          display: "block",
        
          borderbottom: "0.3rem solid transparent",
          transition: "all 0.3s",
        }}
      />



</div>


       <div style={{ display: "flex", flexDirection: "row",  alignItems:"center",marginBottom: "10px" }}> 
       <input
        type="number"
        id="TWOp"
        placeholder="2L Qty:"
        value={TWOp}
        onChange={handleTWOpChange}
        style={{
          margin:" 0 auto",
          padding: "0.7rem 2rem",
          backgroundColor: "rgb(255, 255, 255)",
          border: "none",
          
          width: "100%",
          maxWidth:"100%",     
          minWidth:"30%",
          display: "block",
        
          borderbottom: "0.3rem solid transparent",
          transition: "all 0.3s",
        }}
      />    
        </div>  

    </div>

<div style={{display: "flex",   width: "100%", padding: "20px", alignItems:"center",   justifyContent: "space-between"}}>

  
  <div>
  <input
        type="text"
        id="Q_CASH" 
        placeholder="0.35ml in Value"
        value={Q_CASH}
        style={{
          margin:" 0 auto",
          padding: "0.7rem 2rem",
          backgroundColor: "rgb(255, 255, 255)",
          border: "none",
          width: "100%",
          maxWidth:"100%",     
          minWidth:"30%",
          display: "block",
      
          borderbottom: "0.3rem solid transparent",
          transition: "all 0.3s",
       
        }}
      />
  </div>

  

 <div>
 <input
        type="text"
        id="H_CASH"
        placeholder="0.6ml in Value"
        value={H_CASH}
        style={{
          margin:" 0 auto",
          padding: "0.7rem 2rem",
          backgroundColor: "rgb(255, 255, 255)",
          border: "none",
          width: "100%",
          maxWidth:"100%",     
          minWidth:"30%",
          display: "block",
       
          borderbottom: "0.3rem solid transparent",
          transition: "all 0.3s",
        }}
      />


 </div>
  
  <div>
  <input
        type="text"
        id="ONE_CASH"
        placeholder="1L in Value"
        value={ONE_CASH}
        style={{
          margin:" 0 auto",
          padding: "0.7rem 2rem",
          backgroundColor: "rgb(255, 255, 255)",
          border: "none",
          width: "100%",
          maxWidth:"100%",     
          minWidth:"30%",
          display: "block",
        
          borderbottom: "0.3rem solid transparent",
          transition: "all 0.3s",
        }}
      />
  </div>



<div>

<input
        type="text"
        placeholder="2L in Value"
        id="TWO_CASH"
        value={TWO_CASH}
        style={{
          margin:" 0 auto",
          padding: "0.7rem 2rem",
          backgroundColor: "rgb(255, 255, 255)",
          border: "none",
          width: "100%",
          maxWidth:"100%",     
          minWidth:"30%",
          display: "block",
      
          borderbottom: "0.3rem solid transparent",
          transition: "all 0.3s",
        }}
      />   

</div>


    





</div>
  
     

  <div style={{display: "flex",   width: "100%", padding: "20px", alignItems:"center",   justifyContent: "space-between"}}>


   
<div>
<input
        type="text"
        id="Transportation Fee"
        placeholder="Transportation Fee"
        value={TransportationFee}
        onChange={handleTransportationFee}
        style={{
          margin:" 0 auto",
          padding: "0.7rem 2rem",
          backgroundColor: "rgb(255, 255, 255)",
          border: "none",
          width: "100%",
          maxWidth:"100%",     
          minWidth:"30%",
          display: "block",
       
          borderbottom: "0.3rem solid transparent",
          transition: "all 0.3s",
        }}
      />
</div>
   

<div>
    
<input
        type="text"
        id="handleRouteChange"
        placeholder="Route"
        value={Route}
        onChange={handleRouteChange}
        style={{
          margin:" 0 auto",
          padding: "0.7rem 2rem",
          backgroundColor: "rgb(255, 255, 255)",
          border: "none",
          width: "100%",
          maxWidth:"100%",     
          minWidth:"30%",
          display: "block",
        

          borderbottom: "0.3rem solid transparent",
          transition: "all 0.3s",
        }}
      />   
</div>
  

<div>
<input
    type="text"
    id="totalCashInput"
    placeholder="Total in Value"
    value={TotalCash}
        style={{
          margin:" 0 auto",
          padding: "0.7rem 2rem",
          backgroundColor: "rgb(255, 255, 255)",
          border: "none",
          width: "100%",
          maxWidth:"100%",     
          minWidth:"30%",
          display: "block",
        
          borderbottom: "0.3rem solid transparent",
          transition: "all 0.3s",
        }}
      />   
</div>

<div>

<input
  type="text"
  id="totalQtyInput"
  value={Totalp}
  placeholder="Total Qty"
        style={{
          margin:" 0 auto",
          padding: "0.7rem 2rem",
          backgroundColor: "rgb(255, 255, 255)",
          border: "none",
         
          width: "100%",
          maxWidth:"100%",     
          minWidth:"30%",
          display: "block",
        
          borderbottom: "0.3rem solid transparent",
          transition: "all 0.3s",
        }}
      />   
</div>


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

);
};
export default SalesOrder;

/*
import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, MenuItem } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SalesOrder = () => {
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
const [payment, setPayment] = useState(null);

useEffect(() => {
// Fetching customer data from API
fetch('http://localhost:8000/api/webcustomer/approve/list/')
.then((response) => response.json())
.then((data) => setCustomers(data))
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
setPlate(event.target.value);
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
const totalCash = Q_CASH + H_CASH + ONE_CASH + TWO_CASH;
setTotalCash(totalCash);
}, [Q_CASH, H_CASH, ONE_CASH, TWO_CASH]);

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
formData.append('plate', plate);
formData.append('payment', payment);
console.log(formData);
fetch(`http://localhost:8000/commerce/sales-order/create/${selectedCustomerId}`, {
  method: 'POST',
  body: formData,
  
})
  .then((response) => response.json())
  .then((data) => {
    // Handle successful response
    console.log(data);
  })
  .catch((error) => {
    // Handle error
    console.log(error);
  });
};

return (
  <Box m="20px">
  <Header
    title="Customer Registration Form"
    subtitle="Use the form below to register a customer"
  />

    <form onSubmit={handleFormSubmit}>
      <label htmlFor="customer">Select Customer:</label>
      <select 
        id="customer" 
        value={selectedCustomer} 
        onChange={handleCustomerChange}
        style={{
          marginBottom: '10px',
          padding: '5px',
          borderRadius: '3px',
          border: '1px solid blue',
          width: '200px'
        }}
      >
        <option value="">-- Select Customer --</option>
        {customers.map((customer) => (
          <option key={customer._id} value={customer.customer_name}>
            {customer.customer_name}
          </option>
        ))}
      </select>
    

      <label htmlFor="salesRoute">Sales Route:</label>
      <input 
        type="text" 
        id="salesRoute" 
        value={salesRoute} 
        readOnly 
        style={{
          marginBottom: '10px',
          padding: '5px',
          borderRadius: '3px',
          border: '1px solid blue',
          width: '200px'
        }}
      />


      <label htmlFor="Qp">Qp:</label>
      <input 
        type="number" 
        id="Qp" 
        value={Qp} 
        onChange={handleQpChange} 
        style={{
          marginBottom: '10px',
          padding: '5px',
          borderRadius: '3px',
          border: '1px solid blue',
          width: '200px'
        }}
      />
      <br />

      <label htmlFor="Hp">Hp:</label>
      <input 
        type="number" 
        id="Hp" 
        value={Hp} 
        onChange={handleHpChange} 
        style={{
          marginBottom: '10px',
          padding: '5px',
          borderRadius: '3px',
          border: '1px solid blue',
          width: '200px'
        }}
      />
     

      <label htmlFor="ONEp">ONEp:</label>
      <input 
        type="number" 
        id="ONEp" 
        value={ONEp} 
        onChange={handleONEpChange} 
        style={{
          marginBottom: '10px',
          padding: '5px',
          borderRadius: '3px',
          border: '1px solid blue',
          width: '200px'
        }}
      />
  

      <label htmlFor="TWOp">TWOp:</label>
      <input 
        type="number" 
        id="TWOp" 
        value={TWOp} 
        onChange={handleTWOpChange} 
        style={{
          marginBottom: '10px',
          padding: '5px',
          borderRadius: '3px',
          border: '1px solid blue',
          width: '200px'
        }}
      />
   

      <label htmlFor="plate">Plate:</label>
      <input 
        type="text" 
        id="plate" 
        value={plate} 
        onChange={handlePlateChange} 
        style={{
          marginBottom: '10px',
          padding: '5px',
          borderRadius: '3px',
          border: '1px solid blue',
          width: '200px'
        }}
      />
      

      <label htmlFor="payment">Payment:</label>
      <input 
        type="file" 
        id="payment" 
        onChange={handlePaymentChange} 
        style={{ marginBottom: '10px' }}
      />
      <br />

      <p>Q_CASH: {Q_CASH}</p>
      <p>H_CASH: {H_CASH}</p>
      <p>ONE_CASH: {ONE_CASH}</p>
      <p>TWO_CASH: {TWO_CASH}</p>
      <br />

      <p>Totalp: {Totalp}</p>
      <p>TotalCash: {TotalCash}</p>
      <br />

      <button 
        type="submit" 
        style={{
          padding: '10px',
          borderRadius: '3px',
          backgroundColor: 'blue',
          color: 'white',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        Submit
      </button>
    </form>
   </Box>
);
};

export default SalesOrder;
/*
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState, useEffect } from 'react';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import Header from "../../components/Header";
import useMediaQuery from "@mui/material/useMediaQuery";

function App() {
const [customers, setCustomers] = useState([]);
const [selectedCustomer, setSelectedCustomer] = useState('');
const [salesRoute, setSalesRoute] = useState('');
const isNonMobile = useMediaQuery("(min-width:600px)");
const [Q, setQ] = useState('');
const [H, setH] = useState('');
const [ONE, setONE] = useState('');
const [TWO, setTWO] = useState('');
const [Total, setTotal] = useState('');
const [Q_CASH, setQ_CASH] = useState('');
const [H_CASH, setH_CASH] = useState('');
const [ONE_CASH, setONE_CASH] = useState('');
const [TWO_CASH, setTWO_CASH] = useState('');
const [Total_CASH, setTotal_CASH] = useState('');
const [payment, setPayment] = useState(null);

useEffect(() => {
fetch('http://localhost:8000/api/webcustomer/approve/list/')
.then(response => response.json())
.then(data => setCustomers(data))
.catch(error => console.log(error));
}, []);

const handleCustomerChange = event => {
const selectedCustomerId = event.target.value;
setSelectedCustomer(selectedCustomerId);
const selectedCustomer = customers.find(customer => customer._id === selectedCustomerId);
if (selectedCustomer) {
  const { sales_route } = selectedCustomer;
  setSalesRoute(sales_route || ''); // Set sales_route or empty string if it is undefined/null

  fetch(`http://localhost:8000/commerce/setprice/${sales_route}/`)
    .then(response => response.json())
    .then(data => {
      const { Q, H, ONE, TWO } = data;
      console.log(Q, H, ONE, TWO)
      const q = parseFloat(Q) || 0;
      const h = parseFloat(H) || 0;
      const one = parseFloat(ONE) || 0;
      const two = parseFloat(TWO) || 0;
      console.log(q, h, one, two)
      const qCash = (q * parseFloat(Q)).toFixed(2);
      const hCash = (h * parseFloat(H)).toFixed(2);
      const oneCash = (one * parseFloat(ONE)).toFixed(2);
      const twoCash = (two * parseFloat(TWO)).toFixed(2);
      console.log(qCash, hCash, oneCash, twoCash)
    })
    .catch(error => console.log(error));
}

};

const handleCustomerChange = event => {
  const selectedCustomerId = event.target.value;
  setSelectedCustomer(selectedCustomerId);

  const selectedCustomer = customers.find(customer => customer._id === selectedCustomerId);
  if (selectedCustomer) {
    const { sales_route } = selectedCustomer;
    setSalesRoute(sales_route || '');

    fetch(`http://localhost:8000/commerce/setprice/${sales_route}/`)
      .then(response => response.json())
      .then(data => {
        const { Q, H, ONE, TWO } = data;
        console.log(Q)
        const q = parseFloat(Q) || 0;
        const qCash = (q * parseFloat(Q)).toFixed(2);
        setQ_CASH(qCash);
        console.log(qCash)
      })
      .catch(error => console.log(error));
  }
};

const calculateTotal = () => {
const q = parseFloat(Q) || 0;
const h = parseFloat(H) || 0;
const one = parseFloat(ONE) || 0;
const two = parseFloat(TWO) || 0;

const total = q + h + one + two;
setTotal(total.toFixed(2)); // Fix the total to 2 decimal places

const qCash = parseFloat(Q_CASH) || 0;
const hCash = parseFloat(H_CASH) || 0;
const oneCash = parseFloat(ONE_CASH) || 0;
const twoCash = parseFloat(TWO_CASH) || 0;

const totalCash = qCash + hCash + oneCash + twoCash;
setTotal_CASH(totalCash.toFixed(2)); // Fix the total cash to 2 decimal places
};

const handleSubmit = event => {
event.preventDefault();

const url = `http://localhost:8000/commerce/sales-order/create/${selectedCustomer}`;
const data = new FormData();
data.append('sales_Route', salesRoute);
data.append('Qp', Qp);
data.append('Hp', Hp);
data.append('ONEp', ONEp);
data.append('TWOp', TWOp);
data.append('Q_CASH', Q_CASH);
data.append('H_CASH', H_CASH);
data.append('ONE_CASH', ONE_CASH);
data.append('TWO_CASH', TWO_CASH);
data.append('Total_CASH', Total_CASH);
data.append('plate', 'plate')
data.append('payment', payment);

fetch(url, {
  method: 'POST',
  body: data
})
  .then(response => response.json())
  .then(data => {
    console.log(data);
    toast.success('Form submitted successfully!');
  })
  .catch(error => {
    console.log(error);
    toast.error('An error occurred while submitting the form.');
  });
};

return (
<Box m="20px">
<Header
title="Create Sales Order"
subtitle="Use the form below to create a sales order"
/>

  <form onSubmit={handleSubmit}>
    <Box
      display="grid"
      gap="30px"
      gridTemplateColumns="repeat(4, minmax(0, 1fr))"
      sx={{
        "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
      }}
    >
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <FormControl fullWidth variant="filled">
        <InputLabel>Customer Name</InputLabel>
        <Select
          value={selectedCustomer}
          onChange={handleCustomerChange}
        >
          <MenuItem value="">Select a customer</MenuItem>
          {customers.map(customer => (
            <MenuItem key={customer._id} value={customer._id}>
              {customer.customer_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        fullWidth
        variant="filled"
        type="number"
        label="0.3ml"
        value={value.Q}
        sx={{ gridColumn: "span 2" }}
      />

<TextField
  fullWidth
  variant="filled"
  type="text"
  label="Q_CASH_VALUE"
  value={Q_CASH}
  onChange={event => setQ_CASH(event.target.value)}
  sx={{ gridColumn: "span 2" }}
/>

      <TextField
        fullWidth
        variant="filled"
        type="number"
        label="0.6ml"
        value={H}
        onChange={event => {
          setH(event.target.value);
          calculateTotal();
        }}
        sx={{ gridColumn: "span 2" }}
      />

<TextField
  fullWidth
  variant="filled"
  type="text"
  label="H_CASH_VALUE"
  value={H_CASH}
  onChange={event => setH_CASH(event.target.value)}
  sx={{ gridColumn: "span 2" }}
/>

      <TextField
        fullWidth
        variant="filled"
        type="number"
        label="1L"
        value={ONE}
        onChange={event => {
          setONE(event.target.value);
          calculateTotal();
        }}
        sx={{ gridColumn: "span 2" }}
      />

   

<TextField
  fullWidth
  variant="filled"
  type="text"
  label="ONE_CASH_VALUE"
  value={ONE_CASH}
  onChange={event => setONE_CASH(event.target.value)}
  sx={{ gridColumn: "span 2" }}
/>

      <TextField
        fullWidth
        variant="filled"
        type="number"
        label="2L"
        value={TWO}
        onChange={event => {
          setTWO(event.target.value);
          calculateTotal();
        }}
        sx={{ gridColumn: "span 2" }}
      />

<TextField
  fullWidth
  variant="filled"
  type="text"
  label="TWO_CASH_VALUE"
  value={TWO_CASH}
  onChange={event => setTWO_CASH(event.target.value)}
  sx={{ gridColumn: "span 2" }}
/>




      <TextField
        fullWidth
        variant="filled"
        type="text"
        label="Total"
        value={Total}
        onChange={event => setTotal(event.target.value)}
        sx={{ gridColumn: "span 2" }}
        disabled
      />

      <TextField
        fullWidth
        variant="filled"
        type="text"
        label="Total CASH"
        value={Total_CASH}
        onChange={event => setTotal_CASH(event.target.value)}
        sx={{ gridColumn: "span 2" }}
        disabled
      />

      <TextField
        fullWidth
        variant="filled"
        type="text"
        label="Payment"
        value={payment}
        onChange={event => setPayment(event.target.value)}
        sx={{ gridColumn: "span 2" }}
      />

      <Button variant="contained" type="submit">
        Submit
      </Button>
    </Box>
  </form>
</Box>
);
}

export default App;
*/