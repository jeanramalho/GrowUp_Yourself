import * as FileSystem from 'expo-file-system';

export const exportBackup = async (json: any, filename = 'growup-backup.json') => {
  const path = `${FileSystem.cacheDirectory}${filename}`;
  await FileSystem.writeAsStringAsync(path, JSON.stringify(json));
  return path;
};

export const importBackup = async (filePath: string) => {
  const content = await FileSystem.readAsStringAsync(filePath);
  return JSON.parse(content);
};
