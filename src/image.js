// Downscale a picked photo before we store it. Phone photos are far too large to
// keep as data-URLs in localStorage, so we resize the longest edge down and
// re-encode as JPEG. createImageBitmap with imageOrientation honours EXIF
// rotation (so portrait phone shots aren't sideways); we fall back to an <img>.
export async function fileToThumb(file, max = 1100, quality = 0.8) {
  let bmp
  try {
    bmp = await createImageBitmap(file, { imageOrientation: 'from-image' })
  } catch {
    bmp = await blobToImage(file)
  }

  const scale = Math.min(1, max / Math.max(bmp.width, bmp.height))
  const w = Math.max(1, Math.round(bmp.width * scale))
  const h = Math.max(1, Math.round(bmp.height * scale))

  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  ctx.drawImage(bmp, 0, 0, w, h)
  if (bmp.close) bmp.close()

  return canvas.toDataURL('image/jpeg', quality)
}

function blobToImage(blob) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob)
    const im = new Image()
    im.onload = () => {
      URL.revokeObjectURL(url)
      resolve(im)
    }
    im.onerror = (e) => {
      URL.revokeObjectURL(url)
      reject(e)
    }
    im.src = url
  })
}
