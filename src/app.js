import React, { Component } from 'react'
import html2canvas from 'html2canvas'
import { Cascader, Button } from 'antd'
import { saveAs } from 'file-saver'
import { devices } from './devices'

export default class App extends Component {
  state = {
    container: null,
    screenshot: null,
  }

  $container = null

  render() {
    const { container, screenshot, top, left } = this.state
    return (
      <div>
        <Cascader
          options={devices}
          onChange={(value, options) => {
            const selected = options[options.length - 1]
            this.setState({
              container: selected.image,
              top: selected.top,
              left: selected.left,
            })
          }}
          placeholder="Please select device"
        />
        <input
          type="file"
          onChange={e => {
            // https://codepen.io/hartzis/pen/VvNGZP
            const reader = new FileReader()
            const file = e.target.files[0]

            reader.onloadend = () => {
              this.setState({
                screenshot: reader.result,
              })
            }

            reader.readAsDataURL(file)
          }}
        />
        <Button
          onClick={async () => {
            // e.preventDefault()
            const canvas = await html2canvas(this.$container)
            canvas.toBlob(blob => {
              saveAs(blob, 'test.png')
            })
          }}
        >
          Download
        </Button>
        <div
          ref={element => {
            this.$container = element
          }}
        >
          {screenshot && (
            <img
              src={screenshot}
              style={{
                position: 'absolute',
                top,
                left,
              }}
            />
          )}
          {container && <img src={container} style={{}} />}
        </div>
      </div>
    )
  }
}
