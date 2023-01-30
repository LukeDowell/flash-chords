import * as React from "react";
import {SVGProps} from "react";

const SvgAccidentalSharp = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1.1 3" {...props}>
    <text
      transform="translate(-31.775 -1.36)"
      fontSize={2.2}
      style={{
        fontSize: "2.20009995px",
        textAnchor: "start",
        fill: "currentColor",
        fontFamily: "Century Schoolbook L",
      }}
    />
    <path
      transform="matrix(.004 0 0 -.004 0 1.5)"
      d="M216-312c0-10-8-19-18-19s-19 9-19 19v145l-83-31v-158c0-10-9-19-19-19s-18 9-18 19v145l-32-12c-2-1-5-1-7-1-11 0-20 9-20 20v60c0 8 5 16 13 19l46 16V51L27 40c-2-1-5-1-7-1C9 39 0 48 0 59v60c0 8 5 15 13 18l46 17v158c0 10 8 19 18 19s19-9 19-19V167l83 31v158c0 10 9 19 19 19s18-9 18-19V211l32 12c2 1 5 1 7 1 11 0 20-9 20-20v-60c0-8-5-16-13-19l-46-16V-51l32 11c2 1 5 1 7 1 11 0 20-9 20-20v-60c0-8-5-15-13-18l-46-17v-158zM96 65V-95l83 30V95z"
      style={{
        fill: "currentColor",
      }}
    />
  </svg>
);
export default SvgAccidentalSharp;
