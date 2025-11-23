import * as FileSystem from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

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
 * Download a resource using react-native-blob-util
 */
export const downloadResource = async (resourceId, url, title, onProgress) => {
  try {
    const { fs, config } = ReactNativeBlobUtil;
    const downloadsDir = getDownloadsDir();

    // Ensure downloads directory exists
    const dirExists = await fs.exists(downloadsDir);
    if (!dirExists) {
      await fs.mkdir(downloadsDir);
    }

    // Get file extension from URL
    const urlParts = url.split(".");
    const extension = urlParts[urlParts.length - 1].split("?")[0] || "mp4";
    const fileName = `${resourceId}.${extension}`;
    const localPath = `${downloadsDir}${fileName}`;

    // Check if already downloaded
    const existingPath = await getLocalFilePath(resourceId);
    if (existingPath) {
      return { success: true, localPath: existingPath, alreadyExists: true };
    }

    // Check if file already exists at path
    const fileExists = await fs.exists(localPath);
    if (fileExists) {
      // File exists, use it
      const finalPath =
        Platform.OS === "ios" ? `file://${localPath}` : localPath;
      const downloads = await getDownloadedResources();
      downloads[resourceId] = {
        resourceId,
        url,
        title,
        localPath: finalPath,
        downloadedAt: new Date().toISOString(),
        fileSize: 0,
      };
      await AsyncStorage.setItem(DOWNLOADS_KEY, JSON.stringify(downloads));
      return { success: true, localPath: finalPath, alreadyExists: true };
    }

    // Download the file with progress tracking
    const downloadOptions = {
      fileCache: true,
      path: localPath,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        title: title || "Downloading video",
        description: "Downloading video file...",
        mime: `video/${extension}`,
        mediaScannable: true,
      },
    };

    const response = await ReactNativeBlobUtil.config(downloadOptions)
      .fetch("GET", url)
      .progress((received, total) => {
        if (onProgress) {
          const progress = received / total;
          onProgress(progress);
        }
      });

    // Get the file path
    let finalPath = response.path();

    // For iOS, ensure file:// prefix
    if (Platform.OS === "ios" && !finalPath.startsWith("file://")) {
      finalPath = `file://${finalPath}`;
    }

    // Get file size
    const fileInfo = await fs.stat(finalPath);
    const fileSize = fileInfo.size || 0;

    // Save download info to AsyncStorage
    const downloads = await getDownloadedResources();
    downloads[resourceId] = {
      resourceId,
      url,
      title,
      localPath: finalPath,
      downloadedAt: new Date().toISOString(),
      fileSize: fileSize,
    };
    await AsyncStorage.setItem(DOWNLOADS_KEY, JSON.stringify(downloads));

    return {
      success: true,
      localPath: finalPath,
      alreadyExists: false,
    };
  } catch (error) {
    console.error("Error downloading resource:", error);
    return { success: false, error: error.message || "Download failed" };
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
