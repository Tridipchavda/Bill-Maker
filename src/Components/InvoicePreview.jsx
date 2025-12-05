import React, { useRef, useEffect, useState } from "react";
import { InvoicePage } from "./InvoicePage";
import { useReactToPrint } from "react-to-print";

export default function InvoicePreview() {
  const invoiceRef = useRef(null);
  const [bill, setBill] = useState(null);

  const handlePrint = useReactToPrint({
    contentRef: invoiceRef,
    documentTitle: `Invoice-${bill?.billNo || "print"}`,
    pageStyle: `
      @page {
        size: A4;
        margin: 8mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          margin: 0 !important;
          padding: 0 !important;
          zoom: 100% !important;
          background: white !important;
        }
        .invoice-container {
          width: 100% !important;
          max-width: 794px !important;
          min-height: 1123px !important;
          margin: 0 auto !important;
          transform: none !important;
          box-shadow: none !important;
        }
        button, .print-btn {
          display: none !important;
        }
      }
    `,
  });

  useEffect(() => {
    const storedBill = JSON.parse(localStorage.getItem("billData") || "null");
    setBill(storedBill);
  }, []);

  return (
    <div className="bg-gray-200 flex flex-col items-center p-3">
      {/* PRINT BUTTON */}
      <div className="w-full max-w-[794px] flex justify-end mb-3">
        <button
          onClick={() => handlePrint()}
          className="print-btn bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save as PDF
        </button>
      </div>

      {/* A4 PREVIEW WRAPPER */}
      <div className="preview-wrapper flex justify-center w-full overflow-auto">
        <div
          className="bg-white shadow-md"
          style={{
            width: "794px",
          }}
        >
          <InvoicePage ref={invoiceRef} bill={bill} />
        </div>
      </div>
    </div>
  );
}
