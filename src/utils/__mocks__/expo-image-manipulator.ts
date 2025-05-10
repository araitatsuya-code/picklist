export const SaveFormat = {
  JPEG: 'jpeg',
  PNG: 'png',
};

export const manipulateAsync = jest.fn().mockImplementation(
  (_uri, _actions, _options) => {
    return Promise.resolve({
      uri: 'file:///mock/manipulated/image.jpg',
      width: 300,
      height: 300,
    });
  }
);
