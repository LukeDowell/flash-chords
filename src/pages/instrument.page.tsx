import React, {useContext, useEffect, useState} from 'react'
import {styled} from "@mui/material/styles";
import {useInstrument} from "@/lib/hooks";
import {FormControl, InputLabel, NativeSelect} from '@mui/material';
import {InstrumentName} from "soundfont-player";
import {MidiInputContext, MidiPianoContext} from "@/pages/_app.page";
import _ from "lodash";

const StyledRoot = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100vw',
  height: '100vh',
})

export default function InstrumentPage({}) {
  const [instrumentSample, setInstrumentSample] = useState<InstrumentName>('electric_grand_piano')
  const instrument = useInstrument(instrumentSample)
  const midiInput = useContext(MidiInputContext)
  const piano = useContext(MidiPianoContext)

  useEffect(() => {
    if (!instrument || !midiInput) return
    instrument.listenToMidi(midiInput)

    const id = _.uniqueId('instrument-page-')
    piano.setListener(id, (notes) => {
      console.log('played ', notes)
    })

    return () => piano.removeListener(id)
  }, [instrument, midiInput, piano])

  return <StyledRoot>
    <h1>Instrument Page</h1>
    <FormControl>
      <InputLabel variant={"standard"} htmlFor={"uncontrolled-native"}>Instrument</InputLabel>
      <NativeSelect
        value={instrumentSample}
        inputProps={{
          onChange: (e) => {
            setInstrumentSample(e.target.value as InstrumentName)
          }
        }}
      >
        {SAMPLES.map(s => <option key={s} value={s}>{s.replaceAll('_', ' ')}</option>)}
      </NativeSelect>
    </FormControl>
  </StyledRoot>
}

const SAMPLES = [
  "accordion",
  "acoustic_bass",
  "acoustic_grand_piano",
  "acoustic_guitar_nylon",
  "acoustic_guitar_steel",
  "agogo",
  "alto_sax",
  "applause",
  "bagpipe",
  "banjo",
  "baritone_sax",
  "bassoon",
  "bird_tweet",
  "blown_bottle",
  "brass_section",
  "breath_noise",
  "bright_acoustic_piano",
  "celesta",
  "cello",
  "choir_aahs",
  "church_organ",
  "clarinet",
  "clavinet",
  "contrabass",
  "distortion_guitar",
  "drawbar_organ",
  "dulcimer",
  "electric_bass_finger",
  "electric_bass_pick",
  "electric_grand_piano",
  "electric_guitar_clean",
  "electric_guitar_jazz",
  "electric_guitar_muted",
  "electric_piano_1",
  "electric_piano_2",
  "english_horn",
  "fiddle",
  "flute",
  "french_horn",
  "fretless_bass",
  "fx_1_rain",
  "fx_2_soundtrack",
  "fx_3_crystal",
  "fx_4_atmosphere",
  "fx_5_brightness",
  "fx_6_goblins",
  "fx_7_echoes",
  "fx_8_scifi",
  "glockenspiel",
  "guitar_fret_noise",
  "guitar_harmonics",
  "gunshot",
  "harmonica",
  "harpsichord",
  "helicopter",
  "honkytonk_piano",
  "kalimba",
  "koto",
  "lead_1_square",
  "lead_2_sawtooth",
  "lead_3_calliope",
  "lead_4_chiff",
  "lead_5_charang",
  "lead_6_voice",
  "lead_7_fifths",
  "lead_8_bass__lead",
  "marimba",
  "melodic_tom",
  "music_box",
  "muted_trumpet",
  "oboe",
  "ocarina",
  "orchestra_hit",
  "orchestral_harp",
  "overdriven_guitar",
  "pad_1_new_age",
  "pad_2_warm",
  "pad_3_polysynth",
  "pad_4_choir",
  "pad_5_bowed",
  "pad_6_metallic",
  "pad_7_halo",
  "pad_8_sweep",
  "pan_flute",
  "percussive_organ",
  "piccolo",
  "pizzicato_strings",
  "recorder",
  "reed_organ",
  "reverse_cymbal",
  "rock_organ",
  "seashore",
  "shakuhachi",
  "shamisen",
  "shanai",
  "sitar",
  "slap_bass_1",
  "slap_bass_2",
  "soprano_sax",
  "steel_drums",
  "string_ensemble_1",
  "string_ensemble_2",
  "synth_bass_1",
  "synth_bass_2",
  "synth_brass_1",
  "synth_brass_2",
  "synth_choir",
  "synth_drum",
  "synth_strings_1",
  "synth_strings_2",
  "taiko_drum",
  "tango_accordion",
  "telephone_ring",
  "tenor_sax",
  "timpani",
  "tinkle_bell",
  "tremolo_strings",
  "trombone",
  "trumpet",
  "tuba",
  "tubular_bells",
  "vibraphone",
  "viola",
  "violin",
  "voice_oohs",
  "whistle",
  "woodblock",
  "xylophone",
]
