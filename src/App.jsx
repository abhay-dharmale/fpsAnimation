import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import React, { useEffect, useRef, useState } from "react";


gsap.registerPlugin(ScrollTrigger);

const App = () => {

  const [vals, setVals] = useState({ currentIndex: 1, maxIndex: 422 });

  const imagesLoaded = useRef(0);

  const imageObjectsLoaded = useRef([]);

  const canvasRef = useRef(null);

  const preloadImages = () => {
    for (let i = 0; i <= vals.maxIndex; i++) {
      const imageUrl = `./extractedframes/frame_${i.toString().padStart(4, "0")}.jpg`;
      const img = new Image();
      img.src = imageUrl;

      img.onload = () => {
        imagesLoaded.current++;
        if (imagesLoaded.current === vals.maxIndex) {
          loadImage(vals.currentIndex)
        }
      };
      imageObjectsLoaded.current.push(img);
    }
  };

  const loadImage = (index) => {
    if (index >= 0 && index <= vals.maxIndex) {
      const img = imageObjectsLoaded.current[index];
      const canvas = canvasRef.current;

      if (canvas && img) {
        let ctx = canvas.getContext("2d");
        if (ctx) {
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;

          const scaleX = canvas.width / img.width;
          const scaleY = canvas.height / img.height;

          const scale = Math.max(scaleX, scaleY);

          const newWidth = img.width * scale;
          const newHeight = img.height * scale;

          const offsetX = (canvas.width - newWidth) / 2;
          const offsetY = (canvas.height - newHeight) / 2;

          ctx.clearRect(0, 0, canvas.width, canvas.height);

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(img, offsetX, offsetY, newWidth, newHeight);

          setVals((prevVals)=>({
            ...prevVals,
            currentIndex: index,
          }));
        }
      }
    }
  };

  const parentdivRef = useRef(null);

  useGSAP(()=>{
    const tl = gsap.timeline({
      scrollTrigger:{
        trigger: parentdivRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 2,
      }
    });

    tl.to(vals, {
      currentIndex: vals.maxIndex,
      onUpdate: ()=>{
        loadImage(Math.floor(vals.currentIndex))
      }
    })
  })

  useEffect(() => {
    preloadImages();
  }, []);

  return (
    <div className="w-full bg-zinc-900">
      <div ref={parentdivRef} className="w-full h-[500vh] ">
        <div className="w-full h-52 bg-red-800 sticky left-0 top-0">
          <canvas ref={canvasRef} className="w-full h-screen"></canvas>
        </div>
      </div>
    </div>
  );
};

export default App;
