import styled from "@emotion/styled";
import {ReactComponent as WholeNoteSvg} from "../../images/whole-note.svg";
import {ReactComponent as SharpSvg} from "../../images/accidental-sharp.svg";
import {ReactComponent as FlatSvg} from "../../images/accidental-flat.svg";
import {MeasureStyles} from "./Measure";

export const StyledRoot = styled('div')<MeasureStyles>(props => ({
  display: 'flex',
  flexDirection: 'column',
  border: "1px solid black",
  borderBottom: '0px solid black',
  borderTop: 'none',
  width: `${props.width}px`,
  height: `${props.height}px`,
  position: 'relative',
}))

export const WhiteBar = styled('div')({
  height: `25%`,
  width: '100%',
  backgroundColor: 'white',
})

export const BlackLine = styled('div')({
  minHeight: '1px',
  height: '1%',
  width: '100%',
  backgroundColor: 'black',
})

export interface WholeNoteProps {
  top: number,
  left: number,
  linehint?: 'center' | 'bottom' | 'top'
}

export const WholeNote = styled(WholeNoteSvg)<WholeNoteProps>(props => ({
  color: 'black',
  position: 'absolute',
  transform: `translate(-50%, -50%)`,
  width: 'auto',
  height: `25%`,
  left: `${props.left}%`,
  top: `${props.top}%`,
  backgroundImage: props.linehint ? 'linear-gradient(black, black)' : '',
  backgroundRepeat: 'no-repeat',
  backgroundSize: '125% 1px',
  backgroundPosition: `-10px ${props.linehint}`,
}))

export interface AccidentalProps {
  height: number,
  top: number,
  left: number
}

export const SharpComponent = styled(SharpSvg)<AccidentalProps>(props => ({
  position: 'absolute',
  transform: `translate(-50%, -50%)`,
  height: `${props.height / 12}rem`,
  width: 'auto',
  left: `${props.left}%`,
  top: `${props.top}%`,
}))

export const FlatComponent = styled(FlatSvg)<AccidentalProps>(props => ({
  position: 'absolute',
  transform: `translate(-50%, -75%)`,
  height: `${props.height / 12}rem`,
  width: 'auto',
  left: `${props.left}%`,
  top: `${props.top}%`,
}))
