import React, { useEffect, useState } from 'react';

function AADSInvoice() {
  const [invoiceData, setInvoiceData] = useState([]);

  useEffect(() => {
    fetch('')
      .then((response) => response.json())
      .then((data) => setInvoiceData(data))
      .catch((error) => console.error(error));
  }, []);

  function printInvoice() {
    window.print();
  }

  return (
    <div>
      {invoiceData.map((data) => (
        <div key={data._id} style={{ padding: '20px' }}>
          <div className="invoice-wrapper" style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)', paddingTop: '20px', paddingBottom: '20px' }}>
            <div className="invoice" style={{ maxWidth: '850px', marginRight: 'auto', marginLeft: 'auto', backgroundColor: '#fff', padding: '70px', border: '1px solid rgba(0, 0, 0, 0.2)', borderRadius: '5px', minHeight: '920px' }}>
              <div className="invoice-container">
<div className="invoice-head">
<div className="invoice-head-top">
<div className="invoice-head-top-left text-start">
<img src="logo.png" alt="Logo" />
</div>
<div className="invoice-head-top-right text-end">
<h3 className="text-blue">Invoice</h3>
</div>
</div>
<div className="hr"></div>
<div className="invoice-head-middle">
<div className="invoice-head-middle-left text-start">
<p>
<span className="text-bold">Date</span>: {data.created_at}
</p>
</div>
<div className="invoice-head-middle-right text-end">
<p>
<span className="text-bold">Invoice No:</span> {data._id}
</p>
</div>
</div>
<div className="hr"></div>
<div className="invoice-head-bottom">
<div className="invoice-head-bottom-left">
<ul>
<li className="text-bold">Invoiced To:</li>
<li>{data.customers_name}</li>
<li>{data.sales_Route}</li>
<li>{data.CSI_CRSI_Number}</li>
<li>Ethiopia</li>
</ul>
</div>
<div className="invoice-head-bottom-right">
<ul className="text-end">
<li className="text-bold">Pay To:</li>
<li>Koice Inc.</li>
<li>2705 N. Enterprise</li>
<li>Orange, CA 89438</li>
<li>contact@koiceinc.com</li>
</ul>
</div>
</div>
</div>
<div className="overflow-view">
<div className="invoice-body">
<table>
<thead>
<tr>
<td className="text-bold">Item</td>
<td className="text-bold">Description</td>
<td className="text-bold">Rate</td>
<td className="text-bold">QTY</td>
<td className="text-bold">Amount</td>
</tr>
</thead>
<tbody>
<tr>
<td>Qp</td>
<td>Quantity of Qp</td>
<td>$50.00</td>
<td>{data.Qp}</td>
<td className="text-end">$500.00</td>
</tr>
<tr>
<td>Hp</td>
<td>Quantity of Hp</td>
<td>$50.00</td>
<td>{data.Hp}</td>
<td className="text-end">$500.00</td>
</tr>
<tr>
<td>ONEp</td>
<td>Quantity of ONEp</td>
<td>$50.00</td>
<td>{data.ONEp}</td>
<td className="text-end">$500.00</td>
</tr>
<tr>
<td>TWOp</td>
<td>Quantity of TWOp</td>
<td>$50.00</td>
<td>{data.TWOp}</td>
<td className="text-end">$500.00</td>
</tr>
</tbody>
</table>
<div className="invoice-body-bottom">
<div className="invoice-body-info-item border-bottom">
<div className="info-item-td text-end text-bold">
Sub Total:
</div>
<div className="info-item-td text-end">$2150</div>
</div>
<div className="invoice-body-info-item border-bottom">
<div className="info-item-td text-end text-bold">
Tax (10%):
</div>
<div className="info-item-td text-end">$215.00</div>
</div>
<div className="invoice-body-info-item">
<div className="info-item-td text-end text-bold">
Total:
</div>
<div className="info-item-td text-end">$2365.00</div>
</div>
</div>
</div>
</div>
<div className="invoice-foot">
<p>
This is a sample invoice generated using React. For more information, please contact us at contact@koiceinc.com.
</p>
</div>
<div className="invoice-btns">
<button className="invoice-btn" onClick={printInvoice}>
Print Invoice
</button>
</div>
</div>
</div>
</div>
</div>
))}
</div>
);
}

export default AADSInvoice;

