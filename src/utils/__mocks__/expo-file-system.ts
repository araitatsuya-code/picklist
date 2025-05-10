const files: Record<string, string> = {};

export const documentDirectory = '/mock/documents/';

export const _clearFiles = () => {
  Object.keys(files).forEach(key => delete files[key]);
};

export const getInfoAsync = async (fileUri: string) => {
  if (!fileUri) {
    return { exists: false, isDirectory: false };
  }
  
  if (!fileUri.startsWith(documentDirectory)) {
    return { exists: false, isDirectory: false };
  }
  
  const key = fileUri.replace(documentDirectory, '');
  const exists = key in files;
  
  return {
    exists,
    isDirectory: false,
    size: exists ? files[key].length : 0,
    modificationTime: exists ? Date.now() : 0,
    uri: fileUri,
  };
};

export const writeAsStringAsync = async (fileUri: string, contents: string) => {
  if (!fileUri || !fileUri.startsWith(documentDirectory)) {
    throw new Error(`Invalid file URI: ${fileUri}`);
  }
  
  const key = fileUri.replace(documentDirectory, '');
  files[key] = contents;
  return;
};

export const readAsStringAsync = async (fileUri: string) => {
  if (!fileUri || !fileUri.startsWith(documentDirectory)) {
    throw new Error(`Invalid file URI: ${fileUri}`);
  }
  
  const key = fileUri.replace(documentDirectory, '');
  if (files[key]) {
    return files[key];
  }
  throw new Error(`File not found: ${fileUri}`);
};

export const deleteAsync = async (fileUri: string, options = {}) => {
  if (!fileUri) {
    throw new Error('File URI is required');
  }
  
  if (!fileUri.startsWith(documentDirectory)) {
    throw new Error(`Invalid file URI: ${fileUri}`);
  }
  
  const key = fileUri.replace(documentDirectory, '');
  
  if (key in files) {
    delete files[key];
  }
  
  return;
};

export const copyAsync = async ({ from, to }: { from: string; to: string }) => {
  if (!from || !to) {
    throw new Error('Source and destination URIs are required');
  }
  
  if (!from.startsWith(documentDirectory) && !from.startsWith('file://')) {
    throw new Error(`Invalid source URI: ${from}`);
  }
  
  if (!to.startsWith(documentDirectory)) {
    throw new Error(`Invalid destination URI: ${to}`);
  }
  
  const fromKey = from.startsWith(documentDirectory) 
    ? from.replace(documentDirectory, '') 
    : from.replace('file://', '');
  const toKey = to.replace(documentDirectory, '');
  
  files[toKey] = fromKey in files ? files[fromKey] : 'mock file content';
  
  return;
};

export const makeDirectoryAsync = async (dirUri: string) => {
  return;
};

export const readDirectoryAsync = async (dirUri: string) => {
  if (!dirUri || !dirUri.startsWith(documentDirectory)) {
    throw new Error(`Invalid directory URI: ${dirUri}`);
  }
  
  const prefix = dirUri.replace(documentDirectory, '');
  return Object.keys(files)
    .filter(key => key.startsWith(prefix) && key !== prefix)
    .map(key => key.replace(prefix, '').split('/')[0]);
};
