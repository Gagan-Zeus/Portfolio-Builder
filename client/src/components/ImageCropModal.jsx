import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'

function getCroppedImg(imageSrc, pixelCrop) {
  return new Promise((resolve) => {
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = pixelCrop.width
      canvas.height = pixelCrop.height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(
        image,
        pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height,
        0, 0, pixelCrop.width, pixelCrop.height
      )
      resolve(canvas.toDataURL('image/jpeg', 0.92))
    }
    image.src = imageSrc
  })
}

export default function ImageCropModal({ imageSrc, onCropDone, onCancel, aspect = 1 }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

  const onCropComplete = useCallback((_, pixels) => {
    setCroppedAreaPixels(pixels)
  }, [])

  const handleDone = async () => {
    if (!croppedAreaPixels) return
    const cropped = await getCroppedImg(imageSrc, croppedAreaPixels)
    onCropDone(cropped)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        background: '#fff', borderRadius: 16, width: '90%', maxWidth: 480,
        overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
      }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb' }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#1a1a1a' }}>Crop Image</h3>
        </div>

        <div style={{ position: 'relative', height: 340, background: '#f0f0f0' }}>
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 12, color: '#888', flexShrink: 0 }}>Zoom</span>
          <input
            type="range" min={1} max={3} step={0.05} value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            style={{ flex: 1, accentColor: '#4f46e5' }}
          />
        </div>

        <div style={{
          padding: '12px 20px', borderTop: '1px solid #e5e7eb',
          display: 'flex', justifyContent: 'flex-end', gap: 10,
        }}>
          <button onClick={onCancel} style={{
            padding: '8px 20px', borderRadius: 8, fontSize: 14, fontWeight: 500,
            color: '#555', border: '1px solid #d1d5db', background: '#fff', cursor: 'pointer',
          }}>Cancel</button>
          <button onClick={handleDone} style={{
            padding: '8px 20px', borderRadius: 8, fontSize: 14, fontWeight: 600,
            color: '#fff', background: '#4f46e5', border: 'none', cursor: 'pointer',
          }}>Apply</button>
        </div>
      </div>
    </div>
  )
}
