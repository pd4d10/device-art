import React, { Component } from 'react'
import Select from 'react-select'
import { saveAs } from 'file-saver'
import { devices } from './devices'

export default class App extends Component {
  state = {
    fileName: 'download',
    deviceUrl: null,
    screenshotUrl: null,
    width: 0,
    height: 0,
  }

  $container = null
  canvas = null
  fileInput = null
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

  drawImage = async () => {
    const { deviceUrl, screenshotUrl, top, left } = this.state
    if (screenshotUrl) {
      const image = await this.loadImageAsElement(screenshotUrl)
      this.ctx.drawImage(image, left, top)
    }
    if (deviceUrl) {
      const image = await this.loadImageAsElement(deviceUrl)
      this.ctx.drawImage(image, 0, 0)
    }
  }

  render() {
    const {
      deviceUrl,
      screenshotUrl,
      top,
      left,
      width,
      height,
      fileName,
    } = this.state
    return (
      <div className="container" style={{ marginTop: 20, marginBottom: 20 }}>
        <div className="row">
          <div className="col-9">
            <Select
              placeholder="Select or search device here..."
              options={devices}
              onChange={selected => {
                this.setState(
                  {
                    deviceUrl: selected.image,
                    fileName: selected.label,
                    top: selected.top,
                    left: selected.left,
                    width: selected.width,
                    height: selected.height,
                  },
                  () => {
                    this.drawImage()
                  },
                )
              }}
            />
          </div>
          <div className="col-3">
            <button
              disabled={!screenshotUrl && !deviceUrl}
              className="btn btn-primary"
              onClick={async () => {
                this.canvas.toBlob(blob => {
                  saveAs(blob, fileName + '.png')
                })
              }}
            >
              Download as PNG
            </button>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 30,
            position: 'relative',
          }}
        >
          {deviceUrl &&
            !screenshotUrl && (
              <div
                style={{
                  position: 'absolute',
                  width: '100%',
                  top: window.screen.availHeight * 0.3,
                  textAlign: 'center',
                }}
              >
                <button
                  className="btn btn-outline-primary"
                  onClick={() => {
                    this.fileInput.click()
                  }}
                >
                  Upload screenshot
                </button>
              </div>
            )}
          <canvas
            ref={element => {
              if (element) {
                this.canvas = element
                this.ctx = element.getContext('2d')
              }
            }}
            width={width}
            height={height}
            style={{ height: window.screen.availHeight * 0.7 }}
          />
          <input
            type="file"
            hidden
            ref={element => {
              this.fileInput = element
            }}
            onChange={e => {
              // https://codepen.io/hartzis/pen/VvNGZP
              const reader = new FileReader()
              reader.onloadend = async () => {
                this.setState(
                  {
                    screenshotUrl: reader.result,
                  },
                  () => {
                    this.drawImage()
                  },
                )
              }
              reader.readAsDataURL(e.target.files[0])
            }}
          />
        </div>

        <footer style={{ textAlign: 'center', marginTop: 30 }}>
          <a href="https://github.com/pd4d10/device-art" target="_blank">
            Source code at GitHub
          </a>
          <a
            href="https://facebook.design/devices#filters"
            target="_blank"
            style={{ marginLeft: 20 }}
          >
            Devices
          </a>
        </footer>

        {false && (
          <div style={{ position: 'relative' }}>
            {screenshotUrl && (
              <img
                src={screenshotUrl}
                style={{
                  position: 'absolute',
                  zIndex: -1,
                  top,
                  left,
                }}
              />
            )}
            {deviceUrl && <img src={deviceUrl} />}
          </div>
        )}
      </div>
    )
  }
}
