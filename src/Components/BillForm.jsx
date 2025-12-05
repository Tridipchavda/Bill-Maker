import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BillForm() {
  const navigate = useNavigate();

  // Base bill data
  const [billNo, setBillNo] = useState("");
  const [billDate, setBillDate] = useState("");

  // Billing details
  const [billTo, setBillTo] = useState({ name: "", address: "", gstn: ""});

  // Items
  const [items, setItems] = useState([{ name: "", hsn: "", rate: "", quantity: "" }]);

  const calculateItemTotal = (item) => {
    const r = parseFloat(item.rate) || 0;
    const q = parseFloat(item.quantity) || 0;
    return r * q;
  };

  const grandTotal = items.reduce(
    (sum, item) => sum + calculateItemTotal(item),
    0
  );

  const addItem = () =>
    setItems([...items, { name: "", hsn: "", rate: "", quantity: "" }]);

  const removeItem = (i) => setItems(items.filter((_, idx) => idx !== i));

  const handleItemChange = (i, field, val) => {
    const list = [...items];
    list[i][field] = val;
    setItems(list);
  };

  const handleSubmit = () => {
    const bill = {
      billNo,
      billDate,
      billTo,
      items,
    };

    localStorage.setItem("billData", JSON.stringify(bill));
    navigate("/invoice");
  };

  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-5">
      <h1 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6">
        Create New Bill
      </h1>

      <form className="space-y-6 bg-white shadow-md p-4 sm:p-6 rounded-lg border">

        {/* Bill Details */}
        <h2 className="font-semibold text-lg border-b pb-2">Bill Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-medium text-xs sm:text-sm">Bill No.</label>
            <input className="w-full border rounded p-2 text-sm" value={billNo} onChange={(e)=>setBillNo(e.target.value)}/>
          </div>

          <div>
            <label className="font-medium text-xs sm:text-sm">Bill Date</label>
            <input type="date" className="w-full border rounded p-2 text-sm"
              value={billDate} onChange={(e) => setBillDate(e.target.value)} />
          </div>
        </div>

        {/* Bill To Is Ship To for Now*/}
        <h2 className="font-semibold text-lg border-b pb-2">Billing Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Bill To */}
          <div>
            <p className="text-sm font-semibold mb-1">Bill To</p>
            <input placeholder="Name" className="border rounded p-2 text-sm w-full mb-2"
              value={billTo.name} onChange={(e) => setBillTo({ ...billTo, name: e.target.value })} />
            <input placeholder="GSTN" className="border rounded p-2 text-sm w-full mb-2"
              value={billTo.gstn} onChange={(e) => setBillTo({ ...billTo, gstn: e.target.value })} />
            <textarea rows="2" placeholder="Address" className="border rounded p-2 text-sm w-full"
              value={billTo.address} onChange={(e) => setBillTo({ ...billTo, address: e.target.value })} />
          </div>
        </div>

        {/* Items */}
        <h2 className="text-base sm:text-lg font-semibold border-t pt-4">Items</h2>

        {items.map((item, index) => (
          <div key={index}
            className="flex flex-col sm:grid grid-cols-12 gap-3 border rounded-lg p-4 bg-gray-50">
            <input className="border p-2 rounded text-sm col-span-4"
              placeholder="Item name"
              value={item.name}
              onChange={(e) => handleItemChange(index, "name", e.target.value)} />

            <input className="border p-2 rounded text-sm col-span-2"
              placeholder="HSN"
              value={item.hsn}
              onChange={(e) => handleItemChange(index, "hsn", e.target.value)} />

            <input className="border p-2 rounded text-sm col-span-2"
              placeholder="Rate" type="number"
              value={item.rate}
              onChange={(e) => handleItemChange(index, "rate", e.target.value)} />

            <input className="border p-2 rounded text-sm col-span-2"
              placeholder="Qty" type="number"
              value={item.quantity}
              onChange={(e) => handleItemChange(index, "quantity", e.target.value)} />

            <p className="font-semibold text-green-700 text-center col-span-2 text-sm">
              ₹ {calculateItemTotal(item).toFixed(2)}
            </p>

            <button
              className="bg-red-600 text-white py-2 rounded text-sm col-span-2"
              type="button"
              onClick={() => removeItem(index)}>
              Remove
            </button>
          </div>
        ))}

        <button type="button"
          className="bg-gray-700 text-white px-4 py-2 rounded text-sm"
          onClick={addItem}>
          + Add Item
        </button>

        {/* Grand Total */}
        <div className="text-right text-lg sm:text-xl font-bold pt-6 border-t">
          Grand Total:
          <span className="text-blue-600"> ₹ {grandTotal.toFixed(2)}</span>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          type="button"
          className="w-full bg-blue-600 text-white text-base sm:text-lg py-3 rounded mt-2">
          Generate Invoice
        </button>
      </form>
    </div>
  );
}
