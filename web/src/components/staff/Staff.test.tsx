import {render, screen} from "@testing-library/react";
import Staff from "./Staff";
import {MAJOR_KEYS} from "../../music/Keys";

describe('the staff', () => {
  it('should render', () => {
    render(<Staff/>)
  })

  it('should have a treble cleff marker', () => {
    render(<Staff clef={'treble'}/>)
    expect(screen.getByTestId('treble-cleff-marker')).toBeInTheDocument()
    expect(screen.findByTestId('bass-cleff-marker')).not.toBeInTheDocument()
  })

  it('should have a bass cleff marker', () => {
    render(<Staff clef={'bass'}/>)
    expect(screen.getByTestId('base-cleff-marker')).toBeInTheDocument()
    expect(screen.findByTestId('treble-cleff-marker')).not.toBeInTheDocument()
  })

  it('should display key information for Db major', () => {
    render(<Staff musicalKey={MAJOR_KEYS["Db"]}/>)
    expect(screen.findByTestId('key-Db-marker')).toBeInTheDocument()
    expect(screen.findByTestId('key-Eb-marker')).toBeInTheDocument()
    expect(screen.findByTestId('key-Gb-marker')).toBeInTheDocument()
    expect(screen.findByTestId('key-Ab-marker')).toBeInTheDocument()
    expect(screen.findByTestId('key-Bb-marker')).toBeInTheDocument()
  })

  it('should display key information for E major', () => {
    render(<Staff musicalKey={MAJOR_KEYS["E"]}/>)
    expect(screen.findByTestId('key-F#-marker')).toBeInTheDocument()
    expect(screen.findByTestId('key-C#-marker')).toBeInTheDocument()
    expect(screen.findByTestId('key-G#-marker')).toBeInTheDocument()
    expect(screen.findByTestId('key-D#-marker')).toBeInTheDocument()
  })
})
