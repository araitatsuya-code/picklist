import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THUMBNAIL_SIZE = 300;
const IMAGE_QUALITY = 0.7;
const IMAGE_KEYS_KEY = 'image_keys';

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

export async function saveImage(
  uri: string,
  productId: string
): Promise<string> {
  const optimizedUri = await optimizeImage(uri);
  const key = `product_image_${productId}`;
  await AsyncStorage.setItem(key, optimizedUri);
  return key;
}

export async function loadImage(key: string): Promise<string | null> {
  return AsyncStorage.getItem(key);
}

export async function deleteImage(key: string): Promise<void> {
  await AsyncStorage.removeItem(key);
}

// 使用中の画像キーを保存
export async function saveImageKeys(keys: string[]) {
  await AsyncStorage.setItem(IMAGE_KEYS_KEY, JSON.stringify(keys));
}

// 不要な画像を削除
export async function cleanupUnusedImages() {
  try {
    // 現在使用中の画像キーを取得
    const keysJson = await AsyncStorage.getItem(IMAGE_KEYS_KEY);
    const usedKeys = new Set(keysJson ? JSON.parse(keysJson) : []);

    // 保存されている全てのキーを取得
    const allKeys = await AsyncStorage.getAllKeys();
    const imageKeys = allKeys.filter((key) => key.startsWith('product_image_'));

    // 使用されていない画像を削除
    for (const key of imageKeys) {
      if (!usedKeys.has(key)) {
        await AsyncStorage.removeItem(key);
      }
    }
  } catch (error) {
    console.error('Failed to cleanup images:', error);
  }
}
