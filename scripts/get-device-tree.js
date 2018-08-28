const fs = require('fs')
const path = require('path')
const sizeOf = require('image-size')

function readdir(dir) {
  const subDirs = fs.readdirSync(dir)
  let children

  if (subDirs[0].toLowerCase().includes('device')) {
    children = []
    subDirs.forEach(subDir => {
      fs.readdirSync(path.resolve(dir, subDir)).forEach(file => {
        // console.log(path.resolve(dir, subDir, file))
        const { width, height } = sizeOf(path.resolve(dir, subDir, file))
        children.push({
          value: file.replace(/\.png$/, '') + subDir.replace(/^Device/, ''),
          width,
          height,
        })
      })
    })
  } else {
    children = subDirs.map(subDir => readdir(path.resolve(dir, subDir)))
  }

  return {
    value: dir,
    children,
  }
}

const tree = readdir(path.resolve(__dirname, '../src/images'))

fs.writeFileSync(
  path.resolve(__dirname, '../src/devices.json'),
  JSON.stringify(tree, null, 2),
)
