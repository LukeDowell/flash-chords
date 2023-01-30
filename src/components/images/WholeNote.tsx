import * as React from "react";
import {SVGProps} from "react";

const SvgWholeNote = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19.5 11.003" {...props}>
    <path
      d="M9.125.003C4.035.185 0 2.586 0 5.503c0 3.036 4.368 5.5 9.75 5.5s9.75-2.464 9.75-5.5-4.368-5.5-9.75-5.5c-.21 0-.418-.007-.625 0zM7.5 1.066c1.358-.14 3.068.49 4.5 1.78 2.145 1.934 2.871 4.645 1.625 6.063l-.031.032c-1.271 1.41-4.063.974-6.219-.97C5.219 6.029 4.51 3.289 5.781 1.879c.427-.474 1.032-.742 1.719-.812z"
      style={{
        opacity: 1,
        fill: "#000",
        fillOpacity: 1,
        fillRule: "nonzero",
        stroke: "none",
        strokeWidth: 0.2,
        strokeMiterlimit: 4,
        strokeDasharray: "none",
        strokeDashoffset: 0,
        strokeOpacity: 1,
      }}
    />
  </svg>
);
export default SvgWholeNote;
