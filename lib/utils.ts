import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ImageKit transformation utilities
export interface AspectRatioDimensions {
  width: number;
  height: number;
}

export const ASPECT_RATIO_PRESETS: Record<string, AspectRatioDimensions> = {
  horizontal: { width: 1920, height: 1080 }, // 16:9 for YouTube
  vertical: { width: 1080, height: 1920 },   // 9:16 for Stories
  square: { width: 1080, height: 1080 },     // 1:1 for Instagram
};

export function transformImageKitUrl(
  originalUrl: string,
  orientation: string,
  customDimensions?: AspectRatioDimensions
): string {
  try {
    // Parse the original ImageKit URL
    const url = new URL(originalUrl);

    // Check if it's an ImageKit URL
    if (!url.hostname.includes('imagekit.io')) {
      return originalUrl;
    }

    // Get dimensions from preset or custom
    const dimensions = customDimensions || ASPECT_RATIO_PRESETS[orientation];
    if (!dimensions) {
      return originalUrl;
    }

    // Extract the path after the domain and any existing transformations
    const pathParts = url.pathname.split('/').filter(part => part !== '');
    let imagePath = '';
    let transformationIndex = -1;
    let subdomain = '';

    // Find if there are existing transformations (starts with 'tr:')
    for (let i = 0; i < pathParts.length; i++) {
      if (pathParts[i].startsWith('tr:')) {
        transformationIndex = i;
        break;
      }
    }

    if (transformationIndex !== -1) {
      // Extract subdomain and image path, removing existing transformations
      subdomain = pathParts.slice(0, transformationIndex).join('/');
      imagePath = pathParts.slice(transformationIndex + 1).join('/');
    } else {
      // No existing transformations
      // First part is subdomain (e.g., 'rith'), rest is image path
      subdomain = pathParts[0] || '';
      imagePath = pathParts.slice(1).join('/');
    }

    // Build transformation parameters - always set background color
    const transformations = [
      `w-${dimensions.width}`,
      `h-${dimensions.height}`,
      'cm-pad_resize',
      'bg-F3F3F3'
    ].join(',');

    // Construct the new URL with correct format: domain/subdomain/tr:params/imagepath
    const baseUrl = `${url.protocol}//${url.hostname}`;
    const transformedPath = `/${subdomain}/tr:${transformations}/${imagePath}`;
    const searchParams = url.search;

    return `${baseUrl}${transformedPath}${searchParams}`;
  } catch (error) {
    console.error('Error transforming ImageKit URL:', error);
    return originalUrl;
  }
}

export function parseCustomAspectRatio(aspectRatio: string): AspectRatioDimensions | null {
  try {
    // Handle formats like "19:6", "16:9", "9:16", etc.
    const parts = aspectRatio.split(':');
    if (parts.length !== 2) return null;

    const widthRatio = parseInt(parts[0]);
    const heightRatio = parseInt(parts[1]);

    if (isNaN(widthRatio) || isNaN(heightRatio) || widthRatio <= 0 || heightRatio <= 0) {
      return null;
    }

    // Calculate dimensions maintaining aspect ratio with reasonable base size
    const baseSize = 1080;
    const aspectRatioValue = widthRatio / heightRatio;

    let width: number;
    let height: number;

    if (aspectRatioValue > 1) {
      // Landscape
      width = Math.round(baseSize * aspectRatioValue);
      height = baseSize;
    } else {
      // Portrait or square
      width = baseSize;
      height = Math.round(baseSize / aspectRatioValue);
    }

    return { width, height };
  } catch (error) {
    console.error('Error parsing custom aspect ratio:', error);
    return null;
  }
}
