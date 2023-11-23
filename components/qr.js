"use client";
import React, { useState, useRef } from "react";
import axios from "axios";
import Image from "next/image";
import styles from "../app/qr.module.css";
import { jsPDF } from "jspdf";
const QRcode = () => {
  const [url, setUrl] = useState("https://taptohello.com");
  const [color, setColor] = useState("#3371A5");
  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [backgroundColor , setBackgroundColor] = useState('#ffffff')
  const hiddenFileInput = useRef(null);

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
  };

  const handleColorChange = (e) => {
    // console.log(e.target.value);
    setColor(e.target.value);
  };

  const handleBGColorChange = (e) => {
    // console.log(e.target.value);
    setBackgroundColor(e.target.value);
  };
  const handleFileChange = (event) => {
    const fileUploaded = event.target.files[0];
    // Process the file...
    hiddenFileInput.current.file = fileUploaded;
    setFileName(fileUploaded.name);
  };

  const generateQRCode = async () => {
    const formData = new FormData();
    formData.append("color", color);
    formData.append("url", url);
    // Use the file from the reference
    if (hiddenFileInput.current && hiddenFileInput.current.file) {
      formData.append("image", hiddenFileInput.current.file);
    }
    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://qr.taptohello.com/v1/qr",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          responseType: "blob",
        }
      );
      // Assuming the API returns the URL of the generated QR code image
      const qrCodeBlob = response.data;
      const reader = new FileReader();
      reader.readAsDataURL(qrCodeBlob);
      reader.onloadend = function () {
        const base64data = reader.result;
        // Set the Base64 string as the image source
        // console.log(base64data);
        setImage(base64data);
      };
      setUrl("https://taptohello.com");
      setColor("#3371A5");
      // setBackgroundColor("#ffffff")
      hiddenFileInput.current.file = null;
    } catch (error) {
      console.error("Error generating QR code", error);
      setUrl("https://taptohello.com");
      setColor("#3371A5");
      setBackgroundColor("#ffffff")
    } finally {
      setIsLoading(false);
    }
  };




  

//   const downloadImage = (data, filename = "QR.png") => {
//     const link = document.createElement("a");
//     link.href = data;
//     link.download = filename;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };
const downloadImage = (base64Image, filename = "QR.png") => {
    const image = document.createElement('img');
    image.src = base64Image;
  
    image.onload = () => {
      // Create an off-screen canvas
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
  
      // Set the canvas size
      canvas.width = image.width;
      canvas.height = image.height;
  
      // Draw the image onto the canvas
      ctx.drawImage(image, 0, 0);
  
      // Manipulate the pixels for background color
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data; // the array of RGBA values
  
      // Define the target background color (white by default in QR codes)
      const targetColor = { r: 255, g: 255, b: 255 };
  
      // Loop through every pixel to change the background color
      for (let i = 0; i < data.length; i += 4) {
        // Check if the pixel is white (background)
        if (data[i] === targetColor.r && data[i + 1] === targetColor.g && data[i + 2] === targetColor.b) {
          // Change to the desired background color
          data[i] = parseInt(backgroundColor.slice(1, 3), 16);     // R
          data[i + 1] = parseInt(backgroundColor.slice(3, 5), 16); // G
          data[i + 2] = parseInt(backgroundColor.slice(5, 7), 16); // B
        }
      }
  
      // Put the modified data back on the canvas
      ctx.putImageData(imageData, 0, 0);
  
      // Convert canvas to data URL and download
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
  };
  
  
  const base64ToSVG = (base64Image) => {
    return `
        <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
            <image href="${base64Image}" width="200" height="200"/>
        </svg>
    `;
  };

  const downloadSVG = (base64Image, filename = "QR.svg") => {
    const svgData = base64ToSVG(base64Image);
    const blob = new Blob([svgData], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Clean up to avoid memory leaks
  };

  const downloadPDF = (base64Image, filename = "QR.pdf") => {
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(base64Image);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Calculate the dimensions to maintain the aspect ratio of the image
    const imgWidth = 100; // Set the desired image width
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

    // Calculate positions to center the image
    const x = (pdfWidth - imgWidth) / 2;
    const y = (pdfHeight - imgHeight) / 2;

    pdf.addImage(base64Image, "PNG", x, y, imgWidth, imgHeight);
    pdf.save(filename);
  };
  return (
    <>
      <div className="container mx-auto p-4 md:p-8 mt-10">
        <div className="flex flex-col md:flex-row justify-between items-start">
          <div
            className={`${styles.bgCustoms} flex flex-col space-y-4 p-4 rounded-lg w-full md:w-1/2`}
          >
            <div>
              <p className="flex justify-center items-center text-black max-w-lg mx-auto overflow-hidden mb-4 text-2xl">
                Website URL
              </p>
              <div className="flex rounded-full shadow-lg max-w-xxl mx-auto overflow-hidden">
                <input
                  type="text"
                  placeholder="Enter website url"
                  className="sm:flex-grow sm:px-10 lg:p-4 md:p-4 text-base md:text-lg rounded-l-full "
                  value={url}
                  onChange={handleUrlChange}
                />
                <button
                  className="bg-orange-600 text-white sm:px-8 md:px-8 py-2 text-base md:text-lg rounded-r-full"
                  onClick={generateQRCode}
                >
                  Generate QR
                </button>
              </div>
            </div>
            <div>
              <p className="flex justify-center items-center text-black max-w-lg mx-auto overflow-hidden mb-4 text-2xl mt-4">
                QR Customization
              </p>
              <div className="bg-gray-200 h-0.5 w-full my-4"></div>
            </div>
            <div className="flex items-center justify-center space-x-4 ">
              <div className="flex flex-col items-center">
                <span className="text-black  mb-2">Add Logo on QR</span>
                {/* Hidden file input */}
                <input
                  type="file"
                  ref={hiddenFileInput}
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />

                {/* Button to open the file dialog */}
                <button
                  className="bg-white text-black px-7 py-3 rounded-full hover:bg-gray-100"
                  onClick={handleClick}
                >
                  {fileName || "Upload logo/image"}
                </button>
              </div>
              {/* QR Color*/}
              <div className="flex flex-col items-center">
                <span className="text-black  mb-2">Colour</span>
                <div className="flex rounded-full mx-auto overflow-hidden">
                  <input
                    type="text"
                    placeholder="color"
                    value={color}
                    className=" p-4 w-28 text-lg rounded-l-full focus:outline-none"
                    onChange={handleColorChange}
                  />
                  <button className="bg-white  px-6 py-3  ">
                    <input
                      type="color"
                      value={color}
                      className="w-6 h-6 bg-transparent border-none cursor-pointer rounded-full"
                      onChange={handleColorChange}
                    />
                  </button>
                </div>
              </div>

              {/* Background Color Image*/}
              <div className="flex flex-col items-center">
                <span className="text-black  mb-2">Background Colour</span>
                <div className="flex rounded-full mx-auto overflow-hidden">
                  <input
                    type="text"
                    placeholder="color"
                    value= {backgroundColor}
                    className=" p-4 w-28 text-lg rounded-l-full focus:outline-none"
                    onChange={handleBGColorChange}
                  />
                  <button className="bg-white  px-6 py-3  ">
                    <input
                      type="color"
                      value= {backgroundColor}
                      className={`${styles.colorInput} w-6 h-6 bg-transparent border-none cursor-pointer rounded-full `}
                      onChange={handleBGColorChange}
                    />
                  </button>
                </div>
              </div>
            </div>
            <div className="bg-gray-200 h-0.5 w-full my-5"></div>

            <div className="flex justify-between items-center my-5 px-6">
              <div className="text-left">
                <p className="text-sm  mt-5 text-gray-700">
                  Get Dynamic HelloCode (QR) with amazing
                </p>
                <p className="text-sm mb-5 text-gray-700">
                  Phygital networking features with Hello pro.
                </p>

                <button
                  className={` ${styles.blueButton} text-white px-5 py-2 mb-5 rounded-full shadow-lg flex items-center justify-center`}
                >
                  Subscribe to Hello Pro
                  <Image
                    className="w-4 h-4 ml-4"
                    src="/crown.svg"
                    alt="Hello Logo"
                    width={120}
                    height={44}
                    priority
                  />
                </button>
              </div>

              <div className="text-left">
                <p className="text-sm mt-5 text-gray-700">
                  Explore new-age Phygital networking for your
                </p>
                <p className="text-sm mb-5 text-gray-700">
                  organization/business with Hello Teams
                </p>

                <button className="bg-orange-600 text-white px-5 mb-5 py-2 rounded-full shadow-lg  transition-colors flex items-center justify-center">
                  Subscribe to Hello Teams
                  <Image
                    className="w-4 h-4 ml-4"
                    src="/crownWhite.svg"
                    alt="Hello Logo"
                    width={120}
                    height={44}
                    priority
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="w-px bg-gray-600 my-6 mx-auto md:mx-6 hidden md:block"></div>

          <div className="flex flex-col items-center justify-center space-y-4 p-6 w-full md:w-1/2">
            <p className="text-center text-base md:text-xl text-zinc-800 font-semibold">
              Scan it with your phone camera to test it.
            </p>
            <div
              className={`${styles.qrBox} w-64 h-64 md:w-[368px] md:h-[368px] bg-white rounded-[31px] flex items-center justify-center relative`}
            >
              {/* Your Image */}
              {isLoading ? (
                <div>Loading ...</div>
              ) : (
                <Image
                  className="object-cover" // Adjust the object-fit as needed
                  src={image || "/default.png"}
                  alt="Hello Logo"
                  width={300}
                  height={300}
                  priority
                />
              )}

              {/* Simulating the half border effect with overlaid divs */}
              {/* Top-left corner */}
              
              <div className="absolute top-8 left-8 w-12 h-[2px] bg-cyan-700 rounded-tr-[31px]"></div>
              <div className="absolute top-8 left-8 w-[2px] h-12 bg-cyan-700 rounded-br-[31px]"></div>
  

              {/* Top-right corner */}
              
              <div className="absolute top-8 right-8 w-12 h-[2px] bg-cyan-700 rounded-tl-[31px]"></div>
              <div className="absolute top-8 right-8 w-[2px] h-12 bg-cyan-700 rounded-bl-[31px]"></div>

              {/* Bottom-left corner */}
               
              <div className="absolute bottom-8 left-8 w-12 h-[2px] bg-cyan-700 rounded-br-[31px]"></div>
              <div className="absolute bottom-8 left-8 w-[2px] h-12 bg-cyan-700 rounded-tr-[31px]"></div>

              {/* Bottom-right corner */}
               
              <div className="absolute bottom-8 right-8 w-12 h-[2px] bg-cyan-700 rounded-bl-[31px]"></div>
              <div className="absolute bottom-8 right-8 w-[2px] h-12 bg-cyan-700 rounded-tl-[31px]"></div>

            </div>

            <div className="item-center justify-center">
              <p className="text-l font-semibold">Download as</p>
            </div>
            <div className="flex item-center justify-center">
              <div className="bg-white border border-cyan-700   rounded-full mx-4 px-6 py-2">
                <button
                  className="text-blue-600 font-bold"
                  onClick={() => downloadImage(image, "image.png")}
                >
                  PNG
                </button>
              </div>
              <div className="bg-white border border-cyan-700  rounded-full mx-4 px-6 py-2">
                <button
                  className="text-blue-600 font-bold"
                  onClick={() => downloadSVG(image)}
                >
                  SVG
                </button>
              </div>
              <div className="bg-white border border-cyan-700 rounded-full mx-4 px-6 py-2">
                <button
                  className="text-blue-600 font-bold"
                  onClick={() => downloadPDF(image)}
                >
                  PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default QRcode;
