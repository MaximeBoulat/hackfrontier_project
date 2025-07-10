import { useState, useRef } from 'react'
import './App.css'

// Global configuration
const IS_DEVELOPMENT = true; // Set to false for production
const DEV_SERVER_URL = 'http://localhost:8080';
const PROD_SERVER_URL = 'https://your-production-domain.com'; // Update with your production URL
const SERVER_URL = IS_DEVELOPMENT ? DEV_SERVER_URL : PROD_SERVER_URL;

function App() {
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [serverResponse, setServerResponse] = useState(null)
  const [streaming, setStreaming] = useState(false)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)

  // Start live camera feed
  const startCamera = async () => {
    setError('')
    setServerResponse(null)
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
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8)
      setImage(dataUrl)
      setStreaming(false)
      // Stop the camera
      if (video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop())
      }
    }
  }

  // Send image to server
  const sendToServer = async () => {
    if (!image || !canvasRef.current) return
    
    setLoading(true)
    setError('')
    setServerResponse(null)
    
    try {
      // Convert canvas to blob (following the index.html example)
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) {
          setError('Failed to convert image to blob')
          setLoading(false)
          return
        }

        const formData = new FormData()
        formData.append('image', blob, 'webcam.jpg')

        try {
          const response = await fetch(`${SERVER_URL}/upload`, {
            method: 'POST',
            body: formData,
          })
          
          if (response.ok) {
            const result = await response.text()
            // Try to parse as JSON, fallback to text
            try {
              const jsonResult = JSON.parse(result)
              setServerResponse(jsonResult)
            } catch {
              setServerResponse(result)
            }
          } else {
            setError(`Server error: ${response.status}`)
          }
        } catch (err) {
          setError('Network error - make sure server is running')
        } finally {
          setLoading(false)
        }
      }, 'image/jpeg')
    } catch (err) {
      setError('Failed to process image')
      setLoading(false)
    }
  }

  return (
    <div className="App">
      <h1>Image Analysis App</h1>
      
      {!streaming && !image && (
        <button onClick={startCamera} style={{ margin: '1em 0', padding: '10px 20px', fontSize: '16px' }}>
          📷 Start Camera
        </button>
      )}
      
      {streaming && (
        <div>
          <video ref={videoRef} style={{ maxWidth: '100%', width: '400px' }} autoPlay playsInline />
          <div>
            <button onClick={captureImage} style={{ margin: '1em 0', padding: '10px 20px', fontSize: '16px' }}>
              📸 Capture Image
            </button>
          </div>
        </div>
      )}
      
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
      {image && (
        <div>
          <img src={image} alt="Captured" style={{ maxWidth: '100%', width: '400px', margin: '1em 0' }} />
          <div>
            <button 
              onClick={sendToServer} 
              disabled={loading} 
              style={{ margin: '1em 0', padding: '10px 20px', fontSize: '16px' }}
            >
              {loading ? 'Sending...' : '📤 Send to Server'}
            </button>
          </div>
        </div>
      )}
      
      {loading && (
        <div style={{ margin: '1em 0' }}>
          <div style={{ 
            margin: '1em auto', 
            width: 40, 
            height: 40, 
            border: '4px solid #ccc', 
            borderTop: '4px solid #333', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite' 
          }} />
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          <div>Sending to server...</div>
        </div>
      )}
      
      {serverResponse && (
        <div style={{ margin: '1em 0', background: '#f0f0f0', padding: '1em', borderRadius: '8px' }}>
          <h3>Server Response:</h3>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: '14px' }}>
            {JSON.stringify(serverResponse, null, 2)}
          </pre>
        </div>
      )}
      
      {error && (
        <div style={{ color: 'red', margin: '1em 0', padding: '10px', background: '#ffe6e6', borderRadius: '4px' }}>
          {error}
        </div>
      )}
    </div>
  )
}

export default App
