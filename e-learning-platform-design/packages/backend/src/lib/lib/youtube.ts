// Utility functions for YouTube video handling
export function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null

  // Regular expressions for different YouTube URL formats
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^"&?\/\s]{11})/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/v\/([^"&?\/\s]{11})/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }

  return null
}

export function isYouTubeUrl(url: string): boolean {
  return extractYouTubeVideoId(url) !== null
}

export function getYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}`
}