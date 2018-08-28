import React, { Component } from 'react'
import { Cascader, Button } from 'antd'
import { saveAs } from 'file-saver'
import { devices } from './devices'

export default class App extends Component {
  state = {
    container: null,
    screenshot: null,
    width: 0,
    height: 0,
  }

  $container = null
  canvas = null
  ctx = null

  loadImageAsElement(url) {
    return new Promise(resolve => {
      // https://stackoverflow.com/a/6011402
      const image = new Image()
      image.onload = () => {
        resolve(image)
      }
      image.src = url
    })
  }

  render() {
    const { container, screenshot, top, left, width, height } = this.state
    return (
      <div>
        <Cascader
          options={devices}
          onChange={async (value, options) => {
            const selected = options[options.length - 1]
            this.setState({
              container: selected.image,
              top: selected.top,
              left: selected.left,
              width: selected.width,
              height: selected.height,
            })

            const image = await this.loadImageAsElement(selected.image)
            this.ctx.drawImage(image, 0, 0)
          }}
          placeholder="Please select device"
        />
        <input
          type="file"
          onChange={e => {
            // https://codepen.io/hartzis/pen/VvNGZP
            const reader = new FileReader()
            reader.onloadend = async () => {
              this.setState({
                screenshot: reader.result,
              })
              let image = await this.loadImageAsElement(reader.result)
              this.ctx.drawImage(image, left, top)
              image = await this.loadImageAsElement(container)
              this.ctx.drawImage(image, 0, 0)
            }
            reader.readAsDataURL(e.target.files[0])
          }}
        />
        <Button
          onClick={async () => {
            this.canvas.toBlob(blob => {
              saveAs(blob, 'test.png')
            })
          }}
        >
          Download
        </Button>
        <div>
          <canvas
            ref={element => {
              if (element) {
                this.canvas = element
                this.ctx = element.getContext('2d')
              }
            }}
            width={width}
            height={height}
            style={{ height: 600 }}
          />
        </div>
        <div style={{ position: 'relative' }}>
          {screenshot && (
            <img
              src={screenshot}
              style={{
                position: 'absolute',
                zIndex: -1,
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
