import {Checkbox, FormControlLabel, FormGroup, styled} from "@mui/material";
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
      <FormControlLabel control={
        <Checkbox checked={settings?.timerEnabled}
                  onClick={() => onSettingsUpdate({...settings, timerEnabled: !settings?.timerEnabled})}/>
      } label="Timer Enabled"/>
      <FormControlLabel control={
        <Checkbox defaultChecked/>
      } label="Triads"/>
      <FormControlLabel control={
        <Checkbox defaultChecked/>
      } label="Sevenths"/>
    </FormGroup>
  </StyledRoot>
}
