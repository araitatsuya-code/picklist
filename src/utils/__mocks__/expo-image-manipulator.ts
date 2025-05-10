export const SaveFormat = {
  JPEG: 'jpeg',
  PNG: 'png',
};

export const manipulateAsync = jest.fn().mockImplementation(
  (uri, actions, options) => {
    console.log(`Mock manipulateAsync called with uri: ${uri}, actions: ${JSON.stringify(actions)}, options: ${JSON.stringify(options)}`);
    return Promise.resolve({
      uri: 'file:///mock/manipulated/image.jpg',
      width: 300,
      height: 300,
    });
  }
);
