import React, { useRef } from "react";
// import html2pdf from "html2pdf.js";
import Html from "react-pdf-html";

import { Page, Text, Document, StyleSheet, View, Font } from "@react-pdf/renderer";

// RichTextToPDF is a functional React component that takes a render prop function, a rich text string,
// an optional style object, and an optional filename string as its props
function RichTextToPDF({ render, richText, style, filename }) {
  // Create a ref to store the DOM node containing the rich text content
  const contentRef = useRef(null);

  // Asynchronously download the PDF
  // const downloadPDF = async () => {
  //   // Check if the content ref is not null
  //   if (contentRef.current === null) {
  //     console.error("Content reference not found");
  //     return;
  //   }

  //   // Convert the Rich Text to a PDF using html2pdf library
  //   const worker = html2pdf()
  //     .from(contentRef.current) // Use the content ref as the source
  //     .set({
  //       margin: 0, // Set the margin to 0
  //       // Set the filename of the downloaded PDF to the provided filename or use a default value
  //       filename: filename || "download.pdf",
  //        pagebreak: { mode: "avoid-all" },
  //       image: { type: "jpeg", quality: 1 }, // Set the image format and quality
  //       html2canvas: { scale: 2 }, // Set the scale factor for html2canvas
  //       jsPDF: { unit: "pt", format: "letter", orientation: "portrait" }, // Set jsPDF options such as unit, format, and orientation
  //     });

  //   // Save the PDF
  //   await worker.save();
  // };

  // // Return the component's JSX
  // return (
  //   <div style={style || {}}>
  //     {/* Invoke the render prop function, passing in the downloadPDF function */}
  //     {render && render(downloadPDF)}
  //     {/* Hide the rich text content from view by wrapping it in a div with display set to 'none' */}
  //     <div style={{ display: "none" }}>
  //       {/* Set the rich text content using dangerouslySetInnerHTML and the content ref */}
  // <div
  //   dangerouslySetInnerHTML={{ __html: richText }}
  //   ref={contentRef}
  //   style={{
  //     padding: "80px 40px",
  //   }}
  // />
  //     </div>
  //   </div>
  // );


  const styles = StyleSheet.create({
    body: {
      textAlign: "justify",
      padding: "10px 10px",
      fontSize: 12,
      
    },
    title: {
      fontSize: 24,
      textAlign: "center",
    },
    text: {
      fontSize: 12,
      // textAlign: "justify",
      fontSize: 13,
      margin:"10px 15px",
      // fontFamily: "AntonFamily",
    },
    header: {
      fontSize: 12,
      marginBottom: 20,
      textAlign: "center",
      color: "grey",
      // fontFamily: "AntonFamily",
    },
    pageNumber: {
      position: "absolute",
      fontSize: 12,
      bottom: 30,
      left: 0,
      right: 0,
      textAlign: "center",
      color: "grey",
      // fontFamily: "AntonFamily",
    },
  });
  const stylesheet = {
    ol: {
     margin:"5px 10px",
    },
    ul:{
      margin:"5px 10px",
    }, 
    li:{
      margin:"5px 15px",
    }
 
  };


  return (
    <Document>
      <Page style={styles.body}>
        <Text style={styles.header} fixed />
        <Html style={{ ...styles.text, ...style }} stylesheet={stylesheet}>{richText}</Html>
      </Page>
    </Document>
  );
}

export default RichTextToPDF;
