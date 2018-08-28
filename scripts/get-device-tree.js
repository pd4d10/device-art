const fs = require('fs')
const path = require('path')

const data = []

// const root =

function readdir(root) {
  return fs.readdirSync(root).map(folder => {
    if (
      [
        'Device',
        'Device with shadow',
        'Device with Shadow',
        'Device with Shadows',
        'Device Closed',
        'Device Open',
      ].includes(folder)
    ) {
      return fs.readdirSync(path.resolve(root, folder)).reduce(
        (result, item) => [
          ...result,
          {
            value: folder + '' + item,
          },
        ],
        [],
      )
    }
    return {
      value: folder,
      children: readdir(path.resolve(root, folder)),
    }
  })
}

const tree = readdir(path.resolve(__dirname, '../src/images'))

fs.writeFileSync(
  path.resolve(__dirname, '../src/devices.json'),
  JSON.stringify(tree, null, 2),
)
