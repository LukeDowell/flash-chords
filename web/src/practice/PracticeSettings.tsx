import {Checkbox, FormControlLabel, FormGroup, FormLabel, styled, TextField} from "@mui/material";
import {DEFAULT_PRACTICE_SETTINGS, Settings} from "./Settings";


export interface Props {
  settings?: Settings,
  onSettingsUpdate?: (settings: Settings) => void
}

const StyledRoot = styled('div')({
  display: "flex",
  flexDirection: "column",
  width: "80%",
  border: "2px solid black"
})

export function PracticeSettings({
                                   settings = DEFAULT_PRACTICE_SETTINGS,
                                   onSettingsUpdate = () => {
                                   }
                                 }: Props) {
  return <StyledRoot>
    <FormGroup>
      <FormLabel>App Settings</FormLabel>
      <FormControlLabel control={
        <Checkbox checked={settings?.timerEnabled}
                  onClick={() => onSettingsUpdate({...settings, timerEnabled: !settings?.timerEnabled})}/>
      } label="Timer Enabled"/>

      <TextField
        id="filled-number"
        label="Timer Countdown Seconds"
        type="text"
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          inputMode: "numeric",
          pattern: "[0-9]*"
        }}
        variant="filled"
        placeholder={String(settings?.timerSeconds)}

        onChange={(e) => {
          const value = e.target.value
          if (!Number.isSafeInteger(value) || parseInt(value) < 1) return
          else onSettingsUpdate({...settings, timerSeconds: parseInt(e.target.value)})
        }}
      />
    </FormGroup>
    <FormGroup>
      <FormLabel>Chord Settings</FormLabel>
      <FormControlLabel control={
        <Checkbox checked={settings?.triadsEnabled}
                  onClick={() => {
                    if (!settings?.seventhsEnabled) return
                    onSettingsUpdate({...settings, triadsEnabled: !settings?.triadsEnabled})
                  }}/>
      } label="Triads"/>

      <FormControlLabel control={
        <Checkbox checked={settings?.seventhsEnabled}
                  onClick={() => {
                    if (!settings?.triadsEnabled) return
                    onSettingsUpdate({...settings, seventhsEnabled: !settings?.seventhsEnabled})
                  }}/>
      } label="Sevenths"/>

      <FormControlLabel control={
        <Checkbox checked={settings?.minorEnabled}
                  onClick={() => onSettingsUpdate({...settings, minorEnabled: !settings?.minorEnabled})}/>
      } label="Minor"/>

      <FormControlLabel control={
        <Checkbox checked={settings?.majorEnabled}
                  onClick={() => onSettingsUpdate({...settings, majorEnabled: !settings?.majorEnabled})}/>
      } label="Major"/>

      <FormControlLabel control={
        <Checkbox checked={settings?.augmentedEnabled}
                  onClick={() => onSettingsUpdate({...settings, augmentedEnabled: !settings?.augmentedEnabled})}/>
      } label="Augmented"/>

      <FormControlLabel control={
        <Checkbox checked={settings?.diminishedEnabled}
                  onClick={() => onSettingsUpdate({...settings, diminishedEnabled: !settings?.diminishedEnabled})}/>
      } label="Diminished"/>

      <FormControlLabel control={
        <Checkbox checked={settings?.halfDiminishedEnabled}
                  onClick={() => onSettingsUpdate({...settings, halfDiminishedEnabled: !settings?.halfDiminishedEnabled})}/>
      } label="Half Diminished"/>

      <FormControlLabel control={
        <Checkbox checked={settings?.dominantEnabled}
                  onClick={() => onSettingsUpdate({...settings, dominantEnabled: !settings?.dominantEnabled})}/>
      } label="Dominant"/>
    </FormGroup>
  </StyledRoot>
}
