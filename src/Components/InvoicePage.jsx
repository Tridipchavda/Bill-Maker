import React, { forwardRef } from "react";
import { ToWords } from "to-words";
import logo from "../assets/logo.png";

import {
  Bank,
  CompanyAddress,
  CompanyEmail,
  CompanyGSTN,
  CompanyName,
  CompanyPhone,
} from "../utils/constants";

export const InvoicePage = forwardRef(({ bill }, ref) => {
  if (!bill?.items?.length) {
    return (
      <div
        ref={ref}
        className="p-6 text-center text-red-600 font-semibold bg-white border border-black shadow-md"
      >
        No bill data found. Please create a bill first.
      </div>
    );
  }

  const toWords = new ToWords({
    localeCode: "en-IN",
    converterOptions: {
      currency: true,
      ignoreDecimal: false,
      ignoreZeroCurrency: false,
      doNotAddOnly: false,
      currencyOptions: {
        // can be used to override defaults for the selected locale
        name: "Rupee",
        plural: "Rupees",
        symbol: "₹",
        fractionalUnit: {
          name: "Paisa",
          plural: "Paise",
          symbol: "",
        },
      },
    },
  });

  const total = bill.items.reduce(
    (sum, item) =>
      sum + (parseFloat(item.rate) || 0) * (parseFloat(item.quantity) || 0),
    0
  );
  const cgst = total * 0.025;
  const sgst = total * 0.025;
  const grandTotal = total + cgst + sgst;

  const grandTotalInWords = toWords.convert(grandTotal);

  return (
    <div
      ref={ref}
      className="invoice-container flex flex-col justify-between bg-white border border-black p-4 text-[12px]"
      style={{
        width: "210mm",
        minHeight: "297mm",
        margin: 0,
        fontFamily: "Arial, sans-serif",
        boxSizing: "border-box",
      }}
    >
      {/* PRINT CSS - NO LEFT MARGIN, NO ZOOM */}
      <style>
        {`
          @page {
            size: A4;
            margin: 0;
          }
          @media print {
            body {
              margin: 0 !important;
              padding: 0 !important;
              overflow: hidden !important;
            }
            .invoice-container {
              width: 210mm !important;
              min-height: 297mm !important;
              margin: 0 !important;
              padding: 18px !important;
              box-sizing: border-box;
            }
          }
        `}
      </style>

      <div>
        {/* HEADER */}
        <div className="grid grid-cols-[120px_auto] gap-6 border-b border-black pb-4 items-center">
          <div className="flex justify-center">
            <img
              src={logo}
              style={{ filter: "invert(100%)" }}
              alt="logo"
              className="w-[110px] h-[110px] object-contain"
            />
          </div>

          <div className="space-y-1">
            <p className="text-2xl font-bold uppercase tracking-wide" style={{marginBottom:"-5px"}}>
              {CompanyName}
            </p>

            <p className="leading-tight whitespace-pre-line">
              {CompanyAddress}
            </p>

            <p className="leading-tight">
              <b>GSTIN:</b> {CompanyGSTN}
            </p>

            <p className="leading-tight">
              <b>Mobile:</b> {CompanyPhone}
            </p>

            <p className="leading-tight">
              <b>Email:</b> {CompanyEmail}
            </p>
          </div>
        </div>
        {/* INVOICE */}
        <div className="grid grid-cols-3 border-b border-black py-4 px-2 text-[14px] font-medium">
          <div>
            <p>
              <b>Invoice No.</b> {bill.billNo}
            </p>
            <p>
              <b>Invoice Date:</b> {bill.billDate}
            </p>
            <p>
              <b>Due Date:</b> {bill.billDate}
            </p>
          </div>
        </div>

        {/* BILL TO + SHIP TO */}
        <div className="grid grid-cols-2 border-b border-black py-4 px-2 text-[14px]">
          <div>
            <p className="font-bold underline">BILL TO :</p>
            <p className="font-semibold">{bill.billTo.name}</p>
            <p className="leading-tight whitespace-pre-line mb-1">
              GSTIN: {bill.billTo.gstn}
            </p>
            <p className="leading-tight whitespace-pre-line text-[12px]">
              {bill.billTo.address}
            </p>
          </div>
          <div>
            <p className="font-bold underline">SHIP TO :</p>
            <p className="font-semibold">{bill.billTo.name}</p>
            <p className="leading-tight whitespace-pre-line mb-1">
              GSTIN: {bill.billTo.gstn}
            </p>
            <p className="leading-tight whitespace-pre-line text-[12px]">
              {bill.billTo.address}
            </p>
          </div>
        </div>
        {/* ITEMS TABLE */}
        <table className="w-full text-[13px] border border-black mt-[40px]">
          <thead className="bg-gray-100 border-b border-black">
            <tr>
              <th className="p-1 text-left w-6">S.No</th>
              <th className="p-1 text-left">Items</th>
              <th className="p-1 text-center">HSN</th>
              <th className="p-1 text-right">QTY</th>
              <th className="p-1 text-right">RATE</th>
              <th className="p-1 text-right">AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            {bill.items.map((item, i) => {
              const amt =
                (parseFloat(item.rate) || 0) * (parseFloat(item.quantity) || 0);

              return (
                <tr key={i} className="border-b border-black">
                  <td className="p-1">{i + 1}</td>
                  <td className="p-1">{item.name}</td>
                  <td className="p-1 text-center">{item.hsn}</td>
                  <td className="p-1 text-right">{item.quantity}</td>
                  <td className="p-1 text-right">{item.rate}</td>
                  <td className="p-1 text-right">{amt.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* TOTALS */}
        <div className="flex justify-end mt-2">
          <table className="w-72 border border-black text-[12px]">
            <tbody>
              <tr>
                <td className="p-1 font-semibold">TOTAL</td>
                <td className="p-1 text-right">{total.toFixed(2)}</td>
              </tr>
              <tr>
                <td className="p-1">CGST @2.5%</td>
                <td className="p-1 text-right">{cgst.toFixed(2)}</td>
              </tr>
              <tr>
                <td className="p-1">SGST @2.5%</td>
                <td className="p-1 text-right">{sgst.toFixed(2)}</td>
              </tr>
              <tr className="border-t border-black">
                <td className="p-1 font-bold">GRAND TOTAL</td>
                <td className="p-1 text-right font-bold">
                  ₹ {grandTotal.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* AMOUNT IN WORDS */}
        <p className="border border-black p-2 text-[12px] font-semibold mt-2">
          Total Amount (in words): {grandTotalInWords}
        </p>
      </div>

      {/* BANK + TERMS + SIGNATURE */}
      <div className="grid grid-cols-3 border border-black text-[12px]">
        <div className="p-2 space-y-1 border-r border-black">
          <p className="font-bold underline">Bank Details</p>
          <p>
            <b>Name:</b> {Bank.holerName}
          </p>
          <p>
            <b>IFSC:</b> {Bank.IFSC}
          </p>
          <p>
            <b>Account No:</b> {Bank.accountNo}
          </p>
          <p>
            <b>Bank:</b> {Bank.bankName}
          </p>
        </div>

        <div className="p-2 border-r border-black">
          <p className="font-bold underline mb-2">Terms and Conditions</p>

          <ul className="list-disc list-inside space-y-1 text-[12px] leading-tight">
            <li>Goods once sold will not be taken back.</li>
            <li>Subject to Ahmedabad Jurisdiction.</li>
            <li>
              18% interest will be charged annually if this bill is not paid.
            </li>
          </ul>
        </div>

        <div className="p-2 text-center">
          <div className="h-[70px]"></div>
          <p className="font-semibold">Authorized Signatory For</p>
          <p className="font-bold uppercase">{CompanyName}</p>
        </div>
      </div>
    </div>
  );
});
