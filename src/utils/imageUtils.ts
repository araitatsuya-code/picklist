import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

const THUMBNAIL_SIZE = 300;
const IMAGE_QUALITY = 0.7;

export async function pickImage(): Promise<string | null> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permission.granted) {
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  });

  if (result.canceled) {
    return null;
  }

  return result.assets[0].uri;
}

export async function takePhoto(): Promise<string | null> {
  const permission = await ImagePicker.requestCameraPermissionsAsync();

  if (!permission.granted) {
    return null;
  }

  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  });

  if (result.canceled) {
    return null;
  }

  return result.assets[0].uri;
}

export async function optimizeImage(uri: string): Promise<string> {
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: THUMBNAIL_SIZE, height: THUMBNAIL_SIZE } }],
    { compress: IMAGE_QUALITY, format: ImageManipulator.SaveFormat.JPEG }
  );

  return result.uri;
}

/**
 * プラットフォーム間で一貫したパス形式に正規化します
 * - iOS: file:// プレフィックスを削除
 * - Android: content:// や file:// は保持
 * @param uri 画像のURI
 * @returns 正規化されたURI
 */
export const normalizeImageUri = (uri: string): string => {
/**
 * プラットフォーム間で一貫したパス形式に正規化します
 *
 * - iOS: file:// プレフィックスを保持または追加
 * - Android: content:// や file:// は保持
 * @param uri 画像のURI
 * @returns 正規化されたURI
 */
if (Platform.OS === 'ios') {
  // iOSの場合、file://プレフィックスを保持
  return uri.startsWith('file://') ? uri : `file://${uri}`;
}
  return uri;
};

export async function saveImage(
  uri: string,
  productId: string
): Promise<string> {
  try {
    // URIを正規化
    const normalizedUri = normalizeImageUri(uri);

    // 画像を最適化
    const optimizedUri = await optimizeImage(normalizedUri);

    // ファイル名を生成
    const fileName = `product_image_${productId}_${Date.now()}.png`;
    
    const docDir = FileSystem.documentDirectory || '/mock/documents/';
    const filePath = `${docDir}${fileName}`;
    
    await FileSystem.copyAsync({
      from: optimizedUri,
      to: filePath
    });

    return fileName;
  } catch (error) {
    console.error('Failed to save image:', error);
    throw error;
  }
}

export async function loadImage(fileName: string): Promise<string | null> {
  try {
    if (!fileName) return null;
    
    const docDir = FileSystem.documentDirectory || '/mock/documents/';
    
    const filePath = `${docDir}${fileName}`;
    const fileInfo = await FileSystem.getInfoAsync(filePath);
    
    if (fileInfo && fileInfo.exists === true) {
      return filePath;
    }
    return null;
  } catch (error) {
    console.error('Failed to load image:', error);
    return null;
  }
}

export async function deleteImage(fileName: string): Promise<void> {
  try {
    if (!fileName) return;
    
    const docDir = FileSystem.documentDirectory || '/mock/documents/';
    
    const filePath = `${docDir}${fileName}`;
    const fileInfo = await FileSystem.getInfoAsync(filePath);
    
    if (fileInfo && fileInfo.exists === true) {
      await FileSystem.deleteAsync(filePath);
      
      const checkAfterDelete = await FileSystem.getInfoAsync(filePath);
      if (checkAfterDelete.exists) {
        console.error('File deletion failed:', filePath);
      }
    }
  } catch (error) {
    console.error('Failed to delete image:', error);
  }
}
