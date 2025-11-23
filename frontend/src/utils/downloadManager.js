import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DOWNLOADS_KEY = "@downloaded_resources";
const DOWNLOADS_DIR = `${FileSystem.documentDirectory}downloads/`;

/**
 * Get all downloaded resources
 */
export const getDownloadedResources = async () => {
  try {
    const data = await AsyncStorage.getItem(DOWNLOADS_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error("Error getting downloaded resources:", error);
    return {};
  }
};

/**
 * Check if a resource is downloaded
 */
export const isResourceDownloaded = async (resourceId) => {
  try {
    const downloads = await getDownloadedResources();
    return downloads[resourceId] !== undefined;
  } catch (error) {
    console.error("Error checking download status:", error);
    return false;
  }
};

/**
 * Get local file path for a downloaded resource
 */
export const getLocalFilePath = async (resourceId) => {
  try {
    const downloads = await getDownloadedResources();
    const downloadInfo = downloads[resourceId];
    if (downloadInfo && downloadInfo.localPath) {
      // Check if file still exists
      const fileInfo = await FileSystem.getInfoAsync(downloadInfo.localPath);
      if (fileInfo.exists) {
        return downloadInfo.localPath;
      } else {
        // File doesn't exist, remove from storage
        await removeDownloadedResource(resourceId);
        return null;
      }
    }
    return null;
  } catch (error) {
    console.error("Error getting local file path:", error);
    return null;
  }
};

/**
 * Download a resource
 */
export const downloadResource = async (resourceId, url, title) => {
  try {
    // Ensure downloads directory exists
    const dirInfo = await FileSystem.getInfoAsync(DOWNLOADS_DIR);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(DOWNLOADS_DIR, {
        intermediates: true,
      });
    }

    // Get file extension from URL
    const urlParts = url.split(".");
    const extension = urlParts[urlParts.length - 1].split("?")[0] || "mp4";
    const fileName = `${resourceId}.${extension}`;
    const localPath = `${DOWNLOADS_DIR}${fileName}`;

    // Check if already downloaded
    const existingPath = await getLocalFilePath(resourceId);
    if (existingPath) {
      return { success: true, localPath: existingPath, alreadyExists: true };
    }

    // Download the file
    const downloadResult = await FileSystem.downloadAsync(url, localPath);

    if (downloadResult.status === 200) {
      // Save download info to AsyncStorage
      const downloads = await getDownloadedResources();
      downloads[resourceId] = {
        resourceId,
        url,
        title,
        localPath: downloadResult.uri,
        downloadedAt: new Date().toISOString(),
        fileSize: downloadResult.headers?.["content-length"] || 0,
      };
      await AsyncStorage.setItem(DOWNLOADS_KEY, JSON.stringify(downloads));

      return {
        success: true,
        localPath: downloadResult.uri,
        alreadyExists: false,
      };
    } else {
      throw new Error("Download failed");
    }
  } catch (error) {
    console.error("Error downloading resource:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Remove a downloaded resource
 */
export const removeDownloadedResource = async (resourceId) => {
  try {
    const downloads = await getDownloadedResources();
    const downloadInfo = downloads[resourceId];

    if (downloadInfo && downloadInfo.localPath) {
      // Delete the file
      const fileInfo = await FileSystem.getInfoAsync(downloadInfo.localPath);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(downloadInfo.localPath, {
          idempotent: true,
        });
      }
    }

    // Remove from storage
    delete downloads[resourceId];
    await AsyncStorage.setItem(DOWNLOADS_KEY, JSON.stringify(downloads));

    return { success: true };
  } catch (error) {
    console.error("Error removing downloaded resource:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Get download info for a resource
 */
export const getDownloadInfo = async (resourceId) => {
  try {
    const downloads = await getDownloadedResources();
    return downloads[resourceId] || null;
  } catch (error) {
    console.error("Error getting download info:", error);
    return null;
  }
};
