"use client"

import { useState, useEffect, useRef } from "react"
import { extractYouTubeVideoId, getYouTubeEmbedUrl } from "@/lib/youtube"

interface YouTubeEmbedProps {
  url: string
  title?: string
  className?: string
  onVideoComplete?: () => void  // Callback when video reaches 90% watched
}

export function YouTubeEmbed({ url, title = "YouTube video", className = "", onVideoComplete }: YouTubeEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [watchProgress, setWatchProgress] = useState(0)
  const playerRef = useRef<YT.Player | null>(null)
  const completionNotifiedRef = useRef(false)
  const videoId = extractYouTubeVideoId(url)

  // Load YouTube IFrame API
  useEffect(() => {
    // Check if YouTube API is already loaded
    if (window.YT && window.YT.Player) {
      // API already loaded
      return
    }

    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    const firstScriptTag = document.getElementsByTagName('script')[0]
    firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag)

    // Create global callback for YT API
    window.onYouTubeIframeAPIReady = () => {
      console.log('YouTube API ready')
    }
  }, [])

  // Setup player tracking
  useEffect(() => {
    if (!isLoaded || !playerRef.current) return

    const checkProgress = () => {
      try {
        const duration = playerRef.current?.getDuration?.()
        const currentTime = playerRef.current?.getCurrentTime?.()
        
        if (duration && currentTime) {
          const progress = Math.round((currentTime / duration) * 100)
          setWatchProgress(progress)

          // Auto-complete when 90% watched or video ends
          if ((progress >= 90 || progress === 100) && !completionNotifiedRef.current && onVideoComplete) {
            completionNotifiedRef.current = true
            onVideoComplete()
          }
        }
      } catch (error) {
        // Silent error handling for player API
      }
    }

    // Check progress every second
    const interval = setInterval(checkProgress, 1000)
    return () => clearInterval(interval)
  }, [isLoaded, onVideoComplete])

  if (!videoId) {
    return (
      <div className={`bg-muted rounded-lg p-4 text-center ${className}`}>
        <p className="text-muted-foreground">Invalid YouTube URL</p>
      </div>
    )
  }

  const embedUrl = getYouTubeEmbedUrl(videoId)

  return (
    <div className={`relative bg-black rounded-lg overflow-hidden ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted z-10">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a2.997 2.997 0 0 0-2.108-2.108C19.72 3.5 12 3.5 12 3.5s-7.72 0-9.39.578A2.997 2.997 0 0 0 .502 6.186C0 7.84 0 12 0 12s0 4.16.502 5.814a2.997 2.997 0 0 0 2.108 2.108c1.67.578 9.39.578 9.39.578s7.72 0 9.39-.578a2.997 2.997 0 0 0 2.108-2.108C24 16.16 24 12 24 12s0-4.16-.502-5.814z"/>
                <path d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="white"/>
              </svg>
            </div>
            <p className="text-sm text-muted-foreground">Loading video...</p>
          </div>
        </div>
      )}
      
      {/* Progress Indicator */}
      {isLoaded && watchProgress > 0 && watchProgress < 100 && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-muted-foreground/20 z-20">
          <div 
            className="h-full bg-primary transition-all"
            style={{ width: `${watchProgress}%` }}
          />
        </div>
      )}

      {/* Completion Badge */}
      {watchProgress >= 90 && (
        <div className="absolute top-4 right-4 bg-green-500/90 text-white px-3 py-1 rounded-full text-xs font-medium z-20">
          ✓ {watchProgress}% watched
        </div>
      )}

      <iframe
        ref={(node) => {
          if (node) {
            // Try to get player from iframe
            try {
              playerRef.current = (window as any).YT?.Player?.(node) || null
            } catch (e) {
              // Silent error
            }
          }
        }}
        src={embedUrl}
        title={title}
        className="w-full aspect-video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  )
}