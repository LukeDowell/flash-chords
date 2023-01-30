import * as React from "react";
import {SVGProps} from "react";

const SvgAccidentalFlat = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 0.908 2.512" {...props}>
    <text
      transform="translate(-24.035 -1)"
      fontSize={2.2}
      style={{
        fontSize: "2.20009995px",
        textAnchor: "start",
        fill: "currentColor",
        fontFamily: "Century Schoolbook L",
      }}
    />
    <path
      transform="matrix(.004 0 0 -.004 .108 1.86)"
      d="m27 41-1-66v-11c0-22 1-44 4-66 45 38 93 80 93 139 0 33-14 67-43 67-31 0-52-30-53-63zm-42-179-12 595c8 5 18 8 27 8s19-3 27-8l-7-345c25 21 58 34 91 34 52 0 89-48 89-102 0-80-86-117-147-169-15-13-24-38-45-38-13 0-23 11-23 25z"
      style={{
        fill: "currentColor",
      }}
    />
  </svg>
);
export default SvgAccidentalFlat;
