import {createContext} from "react";
import MidiPiano from "@/lib/music/MidiPiano";

export const MidiPianoContext = createContext(new MidiPiano())
export const MidiInputContext = createContext<WebMidi.MIDIInput | undefined>(undefined)
export const WebAudioContext = createContext<AudioContext | undefined>(undefined)
export const InstrumentContext = createContext<string>("electric_grand_piano")
