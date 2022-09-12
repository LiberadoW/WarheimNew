import { useRef } from "react";
import { jsPDF } from "jspdf";
import UnitTable from "../Components/UnitTable";
import { armies } from "../layouts/Builder";

export default function PDF({ unitList, heroes }) {
  const pdfRef = useRef(null);
  console.log(pdfRef)

  const handleDownload = () => {
    const content = pdfRef.current;

    const doc = new jsPDF();
    doc.html(content, {
      callback: function (doc) {
        doc.save("sample.pdf");
      },
      html2canvas: { scale: 0.2 }, // change the scale to whatever number you need
    });
  };

  return (
    <div>
      
   
      <div ref={pdfRef}><UnitTable unitList={unitList} heroes={heroes} /></div>
      <footer>
        <button onClick={handleDownload}>Download</button>
      </footer>
    </div>
  );
}
