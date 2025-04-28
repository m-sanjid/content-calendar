export function getShareURL(platform: "twitter" | "linkedin" | "facebook", text: string, url: string) {
    const encodedText = encodeURIComponent(text);
    const encodedURL = encodeURIComponent(url);
  
    switch (platform) {
      case "twitter":
        return `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedURL}`;
      case "linkedin":
        return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedURL}`;
      case "facebook":
        return `https://www.facebook.com/sharer/sharer.php?u=${encodedURL}`;
      default:
        return "#";
    }
  }
  