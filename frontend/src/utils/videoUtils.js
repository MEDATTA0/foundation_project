/**
 * Extract YouTube video ID from various URL formats
 */
export const extractYouTubeVideoId = (url) => {
  if (!url) return null;

  // Regular YouTube URL: https://www.youtube.com/watch?v=VIDEO_ID
  const watchMatch = url.match(/[?&]v=([^&]+)/);
  if (watchMatch) return watchMatch[1];

  // Short YouTube URL: https://youtu.be/VIDEO_ID
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
  if (shortMatch) return shortMatch[1];

  // Embed URL: https://www.youtube.com/embed/VIDEO_ID
  const embedMatch = url.match(/\/embed\/([^?&]+)/);
  if (embedMatch) return embedMatch[1];

  return null;
};

/**
 * Extract Vimeo video ID from URL
 */
export const extractVimeoVideoId = (url) => {
  if (!url) return null;

  // Vimeo URL: https://vimeo.com/VIDEO_ID
  const match = url.match(/vimeo\.com\/(\d+)/);
  if (match) return match[1];

  return null;
};

/**
 * Convert YouTube URL to embed URL
 */
export const getYouTubeEmbedUrl = (url) => {
  const videoId = extractYouTubeVideoId(url);
  if (!videoId) return null;
  // Add parameters for better compatibility
  // Note: origin parameter helps with CORS and referrer issues
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`;
};

/**
 * Convert Vimeo URL to embed URL
 */
export const getVimeoEmbedUrl = (url) => {
  const videoId = extractVimeoVideoId(url);
  if (!videoId) return null;
  return `https://player.vimeo.com/video/${videoId}?autoplay=1`;
};

/**
 * Check if URL is YouTube
 */
export const isYouTubeUrl = (url) => {
  return url && (url.includes("youtube.com") || url.includes("youtu.be"));
};

/**
 * Check if URL is Vimeo
 */
export const isVimeoUrl = (url) => {
  return url && url.includes("vimeo.com");
};
