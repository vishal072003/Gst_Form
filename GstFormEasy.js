import React, { useState } from "react";
import "./App.css";   // <-- import the stylesheet

export default function GstFormEasy() {
  const [customer, setCustomer] = useState({ name: "", gstin: "" });
  const [isIntraState, setIsIntraState] = useState(true);
  const [cartage, setCartage] = useState(0);

  const blankItem = () => ({ desc: "", qty: 1, rate: 0, discountPct: 0, taxPct: 5 });
  const [items, setItems] = useState([blankItem()]);

  function updateItem(i, patch) {
    setItems(prev => prev.map((it, idx) => idx === i ? { ...it, ...patch } : it));
  }
  function addRow() { setItems(prev => [...prev, blankItem()]); }
  function removeRow(i) { if (items.length > 1) setItems(prev => prev.filter((_, idx) => idx !== i)); }

  function gross(it){ return Number(it.qty||0)*Number(it.rate||0); }
  function afterDisc(it){ const g=gross(it); const d=(Number(it.discountPct||0)/100)*g; return Math.max(0,g-d); }
  function lineTax(it){ return (Number(it.taxPct||0)/100)*afterDisc(it); }

  const totals = items.reduce((acc,it)=>{
    const g=gross(it), ad=afterDisc(it), t=lineTax(it);
    acc.subTotal += ad; acc.totalDiscount += g - ad;
    if(isIntraState){ acc.cgst += t/2; acc.sgst += t/2; } else { acc.igst += t; }
    return acc;
  },{subTotal:0,totalDiscount:0,cgst:0,sgst:0,igst:0});

  const grandTotal = totals.subTotal + totals.cgst + totals.sgst + totals.igst + Number(cartage||0);

  function saveOrder(){
    const payload = { customer, isIntraState, items, cartage: Number(cartage||0), totals: { ...totals, grandTotal } };
    console.log("Save payload:", payload);
    alert("Saved to console. Replace saveOrder with API call.");


  }


  return (
    <div className="container">
      <h2>Simple GST Sales Order</h2>

      <section className="section">
        <div className="box">
          <label>Customer Name
            <input value={customer.name} onChange={e=>setCustomer({...customer,name:e.target.value})}/>
          </label>
          <label>GSTIN
            <input value={customer.gstin} onChange={e=>setCustomer({...customer,gstin:e.target.value})}/>
          </label>
        </div>

        <div className="box small">
          <div>
            <span>Tax Type:</span>
            <label><input type="radio" checked={isIntraState} onChange={()=>setIsIntraState(true)}/> Intra (CGST/SGST)</label>
            <label><input type="radio" checked={!isIntraState} onChange={()=>setIsIntraState(false)}/> Inter (IGST)</label>
          </div>
          <label>Cartage / Charges
            <input type="number" value={cartage} onChange={e=>setCartage(e.target.value)}/>
          </label>
        </div>
      </section>

      <table className="items">
        <thead>
          <tr>
            <th>#</th><th>Item</th><th>Qty</th><th>Rate</th>
            <th>Disc %</th><th>Tax %</th><th>Line Total</th><th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((it,i)=>{
            const lineTotal = afterDisc(it) + lineTax(it);
            return (
              <tr key={i}>
                <td>{i+1}</td>
                <td><input value={it.desc} onChange={e=>updateItem(i,{desc:e.target.value})}/></td>
                <td><input type="number" value={it.qty} onChange={e=>updateItem(i,{qty:Number(e.target.value)})}/></td>
                <td><input type="number" value={it.rate} onChange={e=>updateItem(i,{rate:Number(e.target.value)})}/></td>
                <td><input type="number" value={it.discountPct} onChange={e=>updateItem(i,{discountPct:Number(e.target.value)})}/></td>
                <td><input type="number" value={it.taxPct} onChange={e=>updateItem(i,{taxPct:Number(e.target.value)})}/></td>
                <td>{lineTotal.toFixed(2)}</td>
                <td><button onClick={()=>removeRow(i)}>Remove</button></td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="actions">
        <button onClick={addRow}>+ Add Row</button>
        <button onClick={saveOrder}>Save</button>
       
      </div>

      <section className="summary">
        <h4>Summary</h4>
        <div><span>Sub Total:</span><b>{totals.subTotal.toFixed(2)}</b></div>
        <div><span>Total Discount:</span><b>{totals.totalDiscount.toFixed(2)}</b></div>
        <div><span>CGST:</span><b>{totals.cgst.toFixed(2)}</b></div>
        <div><span>SGST:</span><b>{totals.sgst.toFixed(2)}</b></div>
        <div><span>IGST:</span><b>{totals.igst.toFixed(2)}</b></div>
        <div><span>Cartage:</span><b>{Number(cartage||0).toFixed(2)}</b></div>
        <hr/>
        <div className="grand"><span>Grand Total:</span><b>{grandTotal.toFixed(2)}</b></div>
      </section>
    </div>
  );
}
