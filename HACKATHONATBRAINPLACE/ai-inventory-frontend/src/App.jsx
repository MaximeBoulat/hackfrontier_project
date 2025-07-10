import { useState, useRef } from 'react'
import './App.css'

function App() {
  const [image, setImage] = useState(null)
  const [inventory, setInventory] = useState([])
  const [info, setInfo] = useState(null)
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [streaming, setStreaming] = useState(false)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  // Start live camera feed
  const startCamera = async () => {
    setError('')
    setInfo(null)
    setInventory([])
    setImage(null)
    setStreaming(true)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }
    } catch (err) {
      setError('Camera access denied or not available.')
      setStreaming(false)
    }
  }

  // Capture image from video feed
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      const dataUrl = canvas.toDataURL('image/png')
      setImage(dataUrl)
      setStreaming(false)
      // Stop the camera
      if (video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop())
      }
    }
  }

  // Upload image to API and await response
  const uploadImage = async () => {
    setLoading(true)
    setError('')
    setInfo(null)
    setInventory([])
    // Simulate API call
    setTimeout(() => {
      setInventory([
        { name: 'Apple', description: 'A red fruit', id: 1 },
        { name: 'Banana', description: 'A yellow fruit', id: 2 },
        { name: 'Water Bottle', description: 'Reusable bottle', id: 3 },
      ])
      setLoading(false)
    }, 2000)
  }

  // Simulate item info lookup
  const handleQuery = () => {
    const item = inventory.find(i => i.name.toLowerCase() === query.toLowerCase())
    if (item) {
      setInfo(item)
      setError('')
    } else {
      setInfo(null)
      setError('Item not found in inventory.')
    }
  }

  return (
    <div className="App">
      <h1>AI Inventory Camera</h1>
      {!streaming && !image && (
        <button onClick={startCamera} style={{ margin: '1em 0' }}>Start Camera</button>
      )}
      {streaming && (
        <div>
          <video ref={videoRef} style={{ maxWidth: '300px' }} autoPlay playsInline />
          <div>
            <button onClick={captureImage} style={{ margin: '1em 0' }}>Capture Image</button>
          </div>
        </div>
      )}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {image && (
        <div>
          <img src={image} alt="Captured" style={{ maxWidth: '300px', margin: '1em 0' }} />
          <div>
            <button onClick={uploadImage} disabled={loading} style={{ margin: '1em 0' }}>
              Upload & Analyze
            </button>
          </div>
        </div>
      )}
      {loading && (
        <div style={{ margin: '1em 0' }}>
          <div className="spinner" style={{ margin: '1em auto', width: 40, height: 40, border: '4px solid #ccc', borderTop: '4px solid #333', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          <div>Analyzing image...</div>
        </div>
      )}
      {inventory.length > 0 && (
        <div>
          <h2>Detected Inventory</h2>
          <ul>
            {inventory.map(item => (
              <li key={item.id}>{item.name}</li>
            ))}
          </ul>
          <div style={{ margin: '1em 0' }}>
            <input
              type="text"
              placeholder="Ask about an item (e.g. Apple)"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <button onClick={handleQuery} style={{ marginLeft: '0.5em' }}>Get Info</button>
          </div>
        </div>
      )}
      {info && (
        <div style={{ margin: '1em 0', background: '#f0f0f0', padding: '1em', borderRadius: '8px' }}>
          <h3>Item Info</h3>
          <strong>{info.name}</strong>: {info.description}
        </div>
      )}
      {error && <div style={{ color: 'red', margin: '1em 0' }}>{error}</div>}
    </div>
  )
}

export default App
