import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, MenuItem } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AADDSalesOrderForm = () => {
  const [salesPersons, setSalesPersons] = useState([]);
  const [selectedSalesPerson, setSelectedSalesPerson] = useState('');
  const [selectedSalesPersonId, setSelectedSalesPersonId] = useState('');
  const [plateOptions, setPlateOptions] = useState([]);
  const [selectedPlate, setSelectedPlate] = useState('');
  const [selectedPlateId, setSelectedPlateId] = useState('');
  const [Route, setRoute] = useState('');
  const [Q, setQ] = useState('');
  const [H, setH] = useState('');
  const [ONE, setONE] = useState('');
  const [TWO, setTWO] = useState('');
  const [Qp, setQp] = useState('');
  const [Hp, setHp] = useState('');
  const [ONEp, setONEp] = useState('');
  const [TWOp, setTWOp] = useState('');
  const [TransportationFee, setTransportationFee] = useState('');
  const [Q_CASH, setQ_CASH] = useState('');
  const [H_CASH, setH_CASH] = useState('');
  const [ONE_CASH, setONE_CASH] = useState('');
  const [TWO_CASH, setTWO_CASH] = useState('');
  const [Totalp, setTotalp] = useState('');
  const [TotalCash, setTotalCash] = useState('');
  const [plate, setPlate] = useState('');
  const [payment, setPayment] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetching salesPerson data from API
    fetch(process.env.REACT_APP_API_URL+'/commerce/sales-person-retrieve/')
      .then((response) => response.json())
      .then((data) => setSalesPersons(data))
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    // Fetching plate options from API
    fetch(process.env.REACT_APP_API_URL+'/commerce/plate-retrieve/')
      .then((response) => response.json())
      .then((data) => setPlateOptions(data))
      .catch((error) => console.log(error));
  }, []);

  
  const handleSelectPlateChange = (event) => {
    const selectedPlateNumber = event.target.value;
    
    // Find the corresponding plate object using the selected plate number
    const selectedPlateObject = data.find((item) => item.plate_no === selectedPlateNumber);
    
    // Assign the _id of the selected plate object to selectedPlateId
    setSelectedPlateId(selectedPlateObject._id);
    
    // Update the selectedPlate state with the selected plate number
    setSelectedPlate(selectedPlateNumber);
    
    console.log('Selected value:', selectedPlateObject._id);
  };

  const handleSalesPersonChange = (event) => {
    const selectedSalesPersonName = event.target.value;
    setSelectedSalesPerson(selectedSalesPersonName);
  
    // Finding the corresponding sales_route value for the selected salesPerson
    const selectedSalesPerson = salesPersons.find(
      (salesPerson) => salesPerson.sales_person === selectedSalesPersonName
    );
    if (selectedSalesPerson) {
      setRoute(selectedSalesPerson.Route);
      setSelectedSalesPersonId(selectedSalesPerson._id);
    }
  };



  useEffect(() => {
    if (Route) {
      // Fetching Q, H, ONE, TWO values from API based on sales_route
      fetch(process.env.REACT_APP_API_URL+`/commerce/sort_price/${Route}/`)
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
  }, [Route]);

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
    setTWO_CASH(newTWOp * TWO); // Calculating TWO_CASH
    console.log('TWO_CASH:', newTWOp * TWO);
  };

  const handleTransportationFee = (event) => {
    setTransportationFee(event.target.value);
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
  
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_API_URL+'/commerce/plate-retrieve/');
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.log('Error:', error);
      }
    };

    fetchData();
  }, []);


  const handleFormSubmit = (event) => {
    event.preventDefault();
      
    if (!selectedSalesPerson) {
      console.log("No customer selected");
      return;
    }
    
    const formData = new FormData();
    formData.append('Route', Route);
    formData.append('Qp', Qp);
    formData.append('Hp', Hp);
    formData.append('ONEp', ONEp);
    formData.append('TWOp', TWOp);
    formData.append('Totalp', Totalp);
    formData.append('TransportationFee', TransportationFee);
    formData.append('Q_CASH', Q_CASH);
    formData.append('H_CASH', H_CASH);
    formData.append('ONE_CASH', ONE_CASH);
    formData.append('TWO_CASH', TWO_CASH);
    formData.append('Total_CASH', TotalCash);
    formData.append('plate', plate);
    formData.append('payment', payment);
    formData.append('plate', selectedPlate);
    console.log(formData);
    console.log(selectedSalesPersonId)
    console.log(selectedPlateId)
    fetch(process.env.REACT_APP_API_URL+`/commerce/create-AADDSales_Order/${selectedSalesPersonId}/${selectedPlateId}/`, {
      method: 'POST',
      body: formData,
      
    })
    .then((response) => {
      if (response.status === 400) {
        
        toast.error('SalesPerson has already been checked!');
        return Promise.reject();
      }
      return response.json();
    })
      .then((data) => {
        // Handle successful response
        console.log(data);
        toast.success('Order created successfully!');
          // Reset the form values
  setSelectedSalesPerson('');
  setSelectedSalesPersonId('');
  setSelectedPlate('');
  setSelectedPlateId('');
  setRoute('');
  setQ('');
  setH('');
  setONE('');
  setTWO('');
  setQp('');
  setHp('');
  setONEp('');
  setTWOp('');
  setTransportationFee('');
  setQ_CASH('');
  setH_CASH('');
  setONE_CASH('');
  setTWO_CASH('');
  setTotalp('');
  setTotalCash('');
  setPlate('');
  setPayment(null);
  setData([]);
      })
      .catch((error) => {
        // Handle error
        console.log(error);
        toast.error('An error occurred. Please try again.');
      });
    };
    
  return (
<div style={{ display: "flex", flexDirection: "column",  padding: "20px", width: "100%", minWidth:"100%"}}>
<Header
title="Create AADS Sales Order"
subtitle="Use the form below to register a AADS Order"
/>
<ToastContainer />
<form onSubmit={handleFormSubmit}>
<div style={{ display: "flex", flexDirection: "row", marginBottom: "20px",  justifyContent: "space-between", alignItems:"center",  }}>
<div style={{ display: "flex", flexDirection: "row",  alignItems:"center",marginBottom: "10px" }}>

<select
id="salesPerson"
value={selectedSalesPerson}
onChange={handleSalesPersonChange}
style={{
  margin:" 0 auto",
  padding: "0.7rem 2rem",
  backgroundColor: "rgb(255, 255, 255)",
  border: "none",
  width: "100%",
  minWidth:"30%",
  display: "block",
 
  borderbottom: "0.3rem solid transparent",
  transition: "all 0.3s",

}}
>
<option value="">SalesPerson</option>
{salesPersons.map((salesPerson) => (
<option key={salesPerson._id} value={salesPerson.sales_person}>
{salesPerson.sales_person}
</option>
))}
</select>
</div>

  <div style={{ display: "flex", flexDirection: "row", position:"center",alignItems:"center", marginBottom: "10px" }}>
  
    <select
      id="plate"
      value={selectedPlate}
      onChange={handleSelectPlateChange}
      style={{
        margin:" 0 auto",
        padding: "0.7rem 2rem",
        backgroundColor: "rgb(255, 255, 255)",
        border: "none",
        width: "100%",
        minWidth:"30%",
        display: "block",
        
        borderbottom: "0.3rem solid transparent",
        transition: "all 0.3s",
      }}
    >
      <option value="">plate number</option>
      {data.map((item) => (
        <option key={item._id} value={item.plate_no}>
          {item.plate_no}
        </option>
      ))}
    </select>
  </div>

  <div style={{ display: "flex", flexDirection: "row", position:"right",alignItems:"center", marginBottom: "10px" }}>
   
    <input
      type="text"
      id="salesRoute"
      value={Route}
      placeholder="salesRoute"
      readOnly
      style={{
        margin:" 0 auto",
          padding: "0.7rem 2rem",
          backgroundColor: "rgb(255, 255, 255)",
          border: "none",
          width: "100%",
          minWidth:"30%",
          display: "block",
          borderbottom: "0.3rem solid transparent",
          transition: "all 0.3s",
      }}
    />
  </div>
</div>

<div style={{ display: "flex", flexDirection: "row",  marginBottom: "20px", justifyContent: "space-between", alignItems:"center",  }}>
  <div style={{ display: "flex", flexDirection: "row",alignItems:"center", marginBottom: "10px" }}>
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
        minWidth:"30%",
        display: "block",
        borderbottom: "0.3rem solid transparent",
        transition: "all 0.3s",
      }}
    />
  </div>

  <div style={{ display: "flex", flexDirection: "row",alignItems:"center", marginBottom: "10px" }}>
 
    <input
      type="text"
      id="Q_CASH"
      placeholder="0.3ml Value:"
      value={Q_CASH}
      style={{
        margin:" 0 auto",
        margin:" 0 auto",
        padding: "0.7rem 2rem",
        backgroundColor: "rgb(255, 255, 255)",
        border: "none",
      
        width: "100%",
        minWidth:"30%",
        display: "block",
        borderbottom: "0.3rem solid transparent",
        transition: "all 0.3s",
      }}
    />
  </div>

  <div style={{ display: "flex", flexDirection: "row", alignItems:"center",marginBottom: "10px" }}>
    <input
      type="text"
      id="Total CASH"
      value={TotalCash}
      placeholder="Total Value"
      style={{
        margin:" 0 auto",
        padding: "0.7rem 2rem",
        backgroundColor: "rgb(255, 255, 255)",
        border: "none",
      
        width: "100%",
        minWidth:"30%",
        display: "block",
        borderbottom: "0.3rem solid transparent",
        transition: "all 0.3s",
      }}
    />
  </div>
</div>

<div style={{ display: "flex", flexDirection: "row", marginBottom: "20px" , justifyContent: "space-between", alignItems:"center",}}>
  <div style={{ display: "flex", flexDirection: "row",  alignItems:"center",marginBottom: "10px" }}>
    <input
      type="number"
      id="Hp"
      value={Hp}
      placeholder="0.6ml Qty:"
      onChange={handleHpChange}
      style={{
        margin:" 0 auto",
        padding: "0.7rem 2rem",
        backgroundColor: "rgb(255, 255, 255)",
        border: "none",
      
        width: "100%",
        minWidth:"30%",
        display: "block",
        borderbottom: "0.3rem solid transparent",
        transition: "all 0.3s",
      }}
    />
  </div>

  <div style={{ display: "flex", flexDirection: "row",alignItems:"center", marginBottom: "10px" }}>
    <input
      type="text"
      id="H_CASH"
      placeholder="0.6ml Value"
      value={H_CASH}
      style={{
        margin:" 0 auto",
        padding: "0.7rem 2rem",
        backgroundColor: "rgb(255, 255, 255)",
        border: "none", 
        width: "100%",
        minWidth:"30%",
        display: "block",
        borderbottom: "0.3rem solid transparent",
        transition: "all 0.3s",
      }}
    />
  </div>

  <div style={{ display: "flex", flexDirection: "row",alignItems:"center", marginBottom: "10px" }}>
    <input
      type="text"
      id="Totalp"
      placeholder="Total Qty:"
      value={Totalp}
      style={{
        margin:" 0 auto",
        padding: "0.7rem 2rem",
        backgroundColor: "rgb(255, 255, 255)",
        border: "none", 
        width: "100%",
        minWidth:"30%",
        display: "block",
        borderbottom: "0.3rem solid transparent",
        transition: "all 0.3s",
      }}
    />
  </div>
</div>

<div style={{ display: "flex", flexDirection: "row", marginBottom: "20px" , justifyContent: "space-between", alignItems:"center", }}>
  <div style={{ display: "flex", flexDirection: "row",  alignItems:"center",marginBottom: "10px" }}>
    <input
      type="number"
      id="ONEp"
      value={ONEp}
      placeholder="1Liter Qty::"
      onChange={handleONEpChange}
      style={{
        margin:" 0 auto",
        padding: "0.7rem 2rem",
        backgroundColor: "rgb(255, 255, 255)",
        border: "none",
      
        width: "100%",
        minWidth:"30%",
        display: "block",
        borderbottom: "0.3rem solid transparent",
        transition: "all 0.3s",
      }}
    />
  </div>

  <div style={{ display: "flex", flexDirection: "row",alignItems:"center", marginBottom: "10px" }}>

    <input
      type="text"
      id="ONE_CASH"
      value={ONE_CASH}
      placeholder="1L Value:"
      style={{
        margin:" 0 auto",
        margin:" 0 auto",
        padding: "0.7rem 2rem",
        backgroundColor: "rgb(255, 255, 255)",
        border: "none",
    
        width: "100%",
        minWidth:"30%",
        display: "block",
       
        borderbottom: "0.3rem solid transparent",
        transition: "all 0.3s",
      }}
    />
  </div>

  
  <div style={{ display: "flex", flexDirection: "row",alignItems:"center", marginBottom: "10px" }}>
    <input
      type="number"
      id="TransportationFee"
      label="TransportationFee"
      placeholder="Transportaton:"
      value={TransportationFee}  
      onChange={handleTransportationFee}
      style={{
        margin:" 0 auto",
        padding: "0.7rem 2rem",
        backgroundColor: "rgb(255, 255, 255)",
        border: "none",
      
        width: "100%",
        minWidth:"30%",
        display: "block",
      
        borderbottom: "0.3rem solid transparent",
        transition: "all 0.3s",
      }}
    />
  </div>

</div>

<div style={{ display: "flex", flexDirection: "row", marginBottom: "20px" , justifyContent: "space-between", alignItems:"center", }}>
  <div style={{ display: "flex", flexDirection: "row",  alignItems:"center", marginBottom: "10px" }}>
    <input
      type="number"
      id="TWOp"
      value={TWOp}
      onChange={handleTWOpChange}
      placeholder="2Liter Qty:"
      style={{
        margin:" 0 auto",
        padding: "0.7rem 2rem",
        backgroundColor: "rgb(255, 255, 255)",
        border: "none",
      
        width: "100%",
        minWidth:"30%",
        display: "block",
        borderbottom: "0.3rem solid transparent",
        transition: "all 0.3s",
      }}
    />
  </div>

  <div style={{ display: "flex", flexDirection: "row",alignItems:"center", marginBottom: "10px", marginLeft:"10px" }}>
    <input
      type="text"
      id="TWO_CASH"
      value={TWO_CASH}
      placeholder="2L Value:"
      style={{
        margin:" 0 auto",
        padding: "0.7rem 2rem",
        backgroundColor: "rgb(255, 255, 255)",
        border: "none",
      
        width: "100%",
        minWidth:"30%",
        display: "block",
        borderbottom: "0.3rem solid transparent",
        transition: "all 0.3s",
      }}
    />
  </div>

  <div style={{ display: "flex", flexDirection: "row",     marginLeft: "6rem", alignItems:"center", marginBottom: "10px" }}>
  <Button
        type="submit"
        variant="contained"
        color="secondary"
        style={{ width: "150px",   alignSelf: "center" }}
      >
        Submit
      </Button>
    
  </div>


      </div>
  
     
    </form>
  </div>
  );
};
export default AADDSalesOrderForm;