import React, { Component, useRef, useEffect } from "react";


const scrollToRef = ref => window.scrollTo(0, ref.current.offsetTop);
const useMountEffect = fun => useEffect(fun, []);

export default function ScrollDemo() {
  const myRef = useRef(null);
  const myRef2 = useRef(null);
  const myRef3 = useRef(null);

  useMountEffect(() => scrollToRef(myRef)); // Scroll on mount

  return (
    <>
      {" "}
      {/* React.Fragment*/}
      <button onClick={() => scrollToRef(myRef)}>Click to scroll </button>
      <button onClick={() => scrollToRef(myRef2)}>Click to scroll </button>
      <button onClick={() => scrollToRef(myRef3)}>Click to scroll </button>
      <div style={{ height: 600 }} /> {/* just to demonstrate scroll*/}
      <div style={{ height: 600 }} ref={myRef}>
        I wanna be seen
              </div>
      <div style={{ height: 1500 }} ref={myRef2}>
        I wanna be with you
      </div>
      {/* Attach ref object to a dom element */}
      <div style={{ height: 1500 }} /> {/* just to demonstrate scroll*/}
      <div ref={myRef3}>I wanna be with you to</div>
      {/* Scroll on click */}
    </>
  );
};
