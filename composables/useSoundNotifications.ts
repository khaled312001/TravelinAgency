export const useSoundNotifications = () => {
  const playNotificationSound = () => {
    if (process.client) {
      try {
        // Create audio context for notification sound
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
        
        // Create a simple beep sound
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)
        
        // Configure the sound
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime) // 800 Hz
        oscillator.type = 'sine'
        
        // Configure volume
        gainNode.gain.setValueAtTime(0, audioContext.currentTime)
        gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
        
        // Play the sound
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.3)
        
        // Play a second beep for better notification
        setTimeout(() => {
          const oscillator2 = audioContext.createOscillator()
          const gainNode2 = audioContext.createGain()
          
          oscillator2.connect(gainNode2)
          gainNode2.connect(audioContext.destination)
          
          oscillator2.frequency.setValueAtTime(1000, audioContext.currentTime)
          oscillator2.type = 'sine'
          
          gainNode2.gain.setValueAtTime(0, audioContext.currentTime)
          gainNode2.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01)
          gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)
          
          oscillator2.start(audioContext.currentTime)
          oscillator2.stop(audioContext.currentTime + 0.2)
        }, 200)
        
      } catch (error) {
        console.log('Could not play notification sound:', error)
      }
    }
  }

  const playSuccessSound = () => {
    if (process.client) {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
        
        // Create a pleasant success sound
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)
        
        // Success sound: ascending notes
        oscillator.frequency.setValueAtTime(523, audioContext.currentTime) // C5
        oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1) // E5
        oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2) // G5
        
        oscillator.type = 'sine'
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime)
        gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.01)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4)
        
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.4)
        
      } catch (error) {
        console.log('Could not play success sound:', error)
      }
    }
  }

  const playErrorSound = () => {
    if (process.client) {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
        
        // Create an error sound
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)
        
        // Error sound: low descending tone
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime)
        oscillator.frequency.setValueAtTime(150, audioContext.currentTime + 0.1)
        oscillator.frequency.setValueAtTime(100, audioContext.currentTime + 0.2)
        
        oscillator.type = 'sawtooth'
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime)
        gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
        
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.3)
        
      } catch (error) {
        console.log('Could not play error sound:', error)
      }
    }
  }

  const playNewMessageSound = () => {
    if (process.client) {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
        
        // Create a pleasant new message notification sound
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)
        
        // New message sound: gentle chime
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
        oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1)
        oscillator.frequency.setValueAtTime(1200, audioContext.currentTime + 0.2)
        
        oscillator.type = 'sine'
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime)
        gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
        
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.5)
        
      } catch (error) {
        console.log('Could not play new message sound:', error)
      }
    }
  }

  return {
    playNotificationSound,
    playSuccessSound,
    playErrorSound,
    playNewMessageSound
  }
}
