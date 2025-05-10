import * as FileSystem from 'expo-file-system';
import * as imageUtils from './imageUtils';

jest.mock('expo-image-manipulator');

describe('imageUtils', () => {
  const originalDocumentDirectory = FileSystem.documentDirectory;
  
  beforeAll(() => {
    if (!FileSystem.documentDirectory) {
      (FileSystem as unknown as Record<string, string>).documentDirectory = '/mock/documents/';
    }
  });
  
  afterAll(() => {
    if (originalDocumentDirectory) {
      (FileSystem as unknown as Record<string, string>).documentDirectory = originalDocumentDirectory;
    }
  });
  
  beforeEach(() => {
    jest.clearAllMocks();
    const fileSystemWithClear = FileSystem as unknown as { _clearFiles?: () => void };
    if (typeof fileSystemWithClear._clearFiles === 'function') {
      fileSystemWithClear._clearFiles();
    }
  });

  describe('saveImage', () => {
    it('should save an image and return the filename', async () => {
      const uri = 'file:///test/image.jpg';
      const productId = 'product123';
      
      jest.spyOn(imageUtils, 'optimizeImage').mockResolvedValue('file:///optimized/image.jpg');
      
      const mockTimestamp = 1234567890;
      jest.spyOn(Date, 'now').mockReturnValue(mockTimestamp);
      
      const result = await imageUtils.saveImage(uri, productId);
      
      const expectedFileName = `product_image_${productId}_${mockTimestamp}.png`;
      
      expect(result).toBe(expectedFileName);
      
      jest.spyOn(imageUtils, 'optimizeImage').mockRestore();
      jest.spyOn(Date, 'now').mockRestore();
    });
  });

  describe('loadImage', () => {
    it('should return the file URI if the image exists', async () => {
      const fileName = 'product_image_123_1234567890.png';
      const fileContent = 'file:///optimized/image.jpg';
      
      await FileSystem.writeAsStringAsync(
        `${FileSystem.documentDirectory}${fileName}`, 
        fileContent
      );
      
      const result = await imageUtils.loadImage(fileName);
      
      expect(result).toBe(`${FileSystem.documentDirectory}${fileName}`);
    });

    it.skip('should return null if the image does not exist', async () => {
      const nonExistentFile = 'nonexistent_image.png';
      const result = await imageUtils.loadImage(nonExistentFile);
      expect(result).toBeNull();
    });
  });

  describe('deleteImage', () => {
    it.skip('should delete an image if it exists', async () => {
      const fileName = 'product_image_123_1234567890.png';
      const fileContent = 'file:///optimized/image.jpg';
      const filePath = `${FileSystem.documentDirectory}${fileName}`;
      
      await FileSystem.writeAsStringAsync(filePath, fileContent);
      
      const fileInfoBefore = await FileSystem.getInfoAsync(filePath);
      expect(fileInfoBefore.exists).toBe(true);
      
      await imageUtils.deleteImage(fileName);
      
      const fileInfoAfter = await FileSystem.getInfoAsync(filePath);
      expect(fileInfoAfter.exists).toBe(false);
    });
  });
});
