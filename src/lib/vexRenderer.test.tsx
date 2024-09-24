import {render} from "@testing-library/react";
import _ from "lodash";
import {renderVex} from "@/lib/vexRenderer";

describe('the vex renderer', () => {
  it('should render', () => {
    const renderElementId = _.uniqueId('vexRendererTest')
    render(<div id={renderElementId}/>)

    expect(() => renderVex(renderElementId, {trebleVoice: 'C4/w'})).not.toThrow()
    expect(() => renderVex(renderElementId, {bassVoice: 'C3/w'})).not.toThrow()
  })

  it('should not render if there are no voices', () => {
    const renderElementId = _.uniqueId('vexRendererTest')
    render(<div id={renderElementId}/>)

    expect(() => renderVex(renderElementId)).toThrow()
  })

  it.skip('should render voices', () => {

  })

  it.skip('should render multiple voices', () => {

  })

  it.skip('should render when there are different amounts of treble and bass voices', () => {

  })
})
