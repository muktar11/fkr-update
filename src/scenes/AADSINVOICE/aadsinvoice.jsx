import React, { useEffect, useState } from 'react';


function AADSInvoice() {
const [invoiceData, setInvoiceData] = useState([]);

useEffect(() => {
fetch('http://localhost:8000/commerce/sales-order/')
.then((response) => response.json())
.then((data) => setInvoiceData(data))
.catch((error) => console.error(error));
}, []);

return (
<div>
{invoiceData.map((data) => (
<div key={data._id}>
{/* Render the Invoice component with the fetched data */}
<Invoice invoiceData={data} />
</div>
))}
</div>
);
}

function Invoice({ invoiceData }) {
return (
<div className="invoice-wrapper" id="print-area">
<div className="invoice">
<div className="invoice-container">
<div className="invoice-head">
<div className="invoice-head-top">
<div className="invoice-head-top-left text-start">
<img src="logo.png" alt="Logo" />
</div>
<div className="invoice-head-top-right text-end">
<h3>Invoice</h3>
</div>
</div>
<div className="hr"></div>
<div className="invoice-head-middle">
<div className="invoice-head-middle-left text-start">
<p>
<span className="text-bold">Date</span>: {invoiceData.created_at}
</p>
</div>
<div className="invoice-head-middle-right text-end">
<p>
<span className="text-bold">Invoice No:</span> {invoiceData._id}
</p>
</div>
</div>
<div className="hr"></div>
<div className="invoice-head-bottom">
<div className="invoice-head-bottom-left">
<ul>
<li className="text-bold">Invoiced To:</li>
<li>{invoiceData.customers_name}</li>
<li>{invoiceData.sales_Route}</li>
<li>{invoiceData.CSI_CRSI_Number}</li>
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
<td>{invoiceData.Qp}</td>
<td className="text-end">$500.00</td>
</tr>
<tr>
<td>Hp</td>
<td>Quantity of Hp</td>
<td>$50.00</td>
<td>{invoiceData.Hp}</td>
<td className="text-end">$500.00</td>
</tr>
<tr>
<td>ONEp</td>
<td>Quantity of ONEp</td>
<td>$50.00</td>
<td>{invoiceData.ONEp}</td>
<td className="text-end">$500.00</td>
</tr>
<tr>
<td>TWOp</td>
<td>Quantity of TWOp</td>
<td>$50.00</td>
<td>{invoiceData.TWOp}</td>
<td className="text-end">$500.00</td>
</tr>
</tbody>
</table>
<div className="invoice-body-bottom">
<div className="invoice-body-info-item border-bottom">
<div className="info-item-td text-end text-bold">
Sub Total:
</div>
<div className="info-item-td text-end">$2150.00</div>
</div>
<div className="invoice-body-info-item border-bottom">
<div className="info-item-td text-end text-bold">Tax:</div>
<div className="info-item-td text-end">$215.00</div>
</div>
<div className="invoice-body-info-item">
<div className="info-item-td text-end text-bold">Total:</div>
<div className="info-item-td text-end">$21365.00</div>
</div>
</div>
</div>
</div>
<div className="invoice-foot text-center">
<p>
<span className="text-bold text-center">NOTE: </span>This is
computer-generated receipt and does not require a physical signature.
</p>

        <div className="invoice-btns">
          <button type="button" className="invoice-btn" onClick={printInvoice}>
            <span>
              <i className="fa-solid fa-print"></i>
            </span>
            <span>Print</span>
          </button>
          <button type="button" className="invoice-btn">
            <span>
              <i className="fa-solid fa-download"></i>
            </span>
            <span>Download</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
);
}

function printInvoice() {
window.print();
}

export default AADSInvoice;