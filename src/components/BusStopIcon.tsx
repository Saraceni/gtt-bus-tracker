import React from 'react';

const BusStopIcon = ({ width = "50px", height = "50px", mainColor = "#BDC3C7", className = "", ...props }) => {
  return (
    <svg 
      height={height} 
      width={width} 
      version="1.1" 
      id="Layer_1" 
      xmlns="http://www.w3.org/2000/svg" 
      xmlnsXlink="http://www.w3.org/1999/xlink" 
      viewBox="0 0 512 512" 
      xmlSpace="preserve" 
      fill="#000000"
      className={className}
      {...props}
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"/>
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"/>
      <g id="SVGRepo_iconCarrier"> 
        <g transform="translate(0 -1)"> 
          <g> 
            <path style={{fill:"#BDC3C7"}} d="M233.931,98.103h-52.966c-4.882,0-8.828-3.955-8.828-8.828c0-4.873,3.946-8.828,8.828-8.828h52.966 c4.882,0,8.828,3.955,8.828,8.828C242.759,94.149,238.813,98.103,233.931,98.103"/> 
            <path style={{fill:"#BDC3C7"}} d="M233.931,257h-52.966c-4.882,0-8.828-3.955-8.828-8.828c0-4.873,3.946-8.828,8.828-8.828h52.966 c4.882,0,8.828,3.955,8.828,8.828C242.759,253.045,238.813,257,233.931,257"/> 
          </g> 
          <path style={{fill:"#2F3744"}} d="M225.103,513H101.517c0-19.5,15.81-35.31,35.31-35.31h52.966 C209.293,477.69,225.103,493.5,225.103,513"/> 
          <path style={{fill:"#464F5D"}} d="M145.655,18.655V477.69h35.31V18.655C180.966,8.901,173.065,1,163.31,1 C153.556,1,145.655,8.901,145.655,18.655"/> 
          <polygon style={{fill:"#2F3744"}} points="233.931,309.963 410.483,309.963 410.483,27.48 233.931,27.48 "/> 
          <g> 
            <path style={{fill:mainColor}} d="M278.069,186.379c-4.882,0-8.828-3.955-8.828-8.828V89.276c0-4.873,3.946-8.828,8.828-8.828 s8.828,3.955,8.828,8.828v88.276C286.897,182.425,282.951,186.379,278.069,186.379"/> 
            <path style={{fill:mainColor}} d="M366.345,186.379c-4.882,0-8.828-3.955-8.828-8.828V89.276c0-4.873,3.946-8.828,8.828-8.828 s8.828,3.955,8.828,8.828v88.276C375.172,182.425,371.226,186.379,366.345,186.379"/> 
            <path style={{fill:mainColor}} d="M357.517,221.69h-70.621c-4.882,0-8.828-3.955-8.828-8.828c0-4.873,3.946-8.828,8.828-8.828h70.621 c4.882,0,8.828,3.955,8.828,8.828C366.345,217.735,362.399,221.69,357.517,221.69"/> 
            <path style={{fill:mainColor}} d="M375.172,265.828H269.241c-4.882,0-8.828-3.955-8.828-8.828c0-4.873,3.946-8.828,8.828-8.828 h105.931c4.882,0,8.828,3.955,8.828,8.828C384,261.873,380.054,265.828,375.172,265.828"/> 
            <path style={{fill:mainColor}} d="M286.897,133.411h70.621V80.446h-70.621V133.411z M366.345,151.066h-88.276 c-4.882,0-8.828-3.946-8.828-8.828V71.618c0-4.873,3.946-8.828,8.828-8.828h88.276c4.882,0,8.828,3.955,8.828,8.828v70.621 C375.172,147.12,371.226,151.066,366.345,151.066L366.345,151.066z"/> 
            <path style={{fill:mainColor}} d="M322.207,151.069c-4.882,0-8.828-3.955-8.828-8.828V71.621c0-4.873,3.946-8.828,8.828-8.828 s8.828,3.955,8.828,8.828v70.621C331.034,147.114,327.089,151.069,322.207,151.069"/> 
          </g> 
        </g> 
      </g>
    </svg>
  );
};

export default BusStopIcon; 