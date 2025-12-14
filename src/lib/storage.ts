export async function getFileHandle(root: FileSystemDirectoryHandle, path: string): Promise<FileSystemFileHandle> {
  let dirHandle = root;
  const parts = path.split("/").filter(Boolean);
  const dirPath = parts.slice(0, -1);
  const fileName = parts[parts.length - 1];
  for (const part of dirPath) {
    dirHandle = await dirHandle.getDirectoryHandle(part, { create: true });
  }
  const handle = await dirHandle.getFileHandle(fileName, { create: true });
  return handle;
}

export async function getDirectoryHandle(root: FileSystemDirectoryHandle, path: string): Promise<FileSystemDirectoryHandle> {
  let dirHandle = root;
  const parts = path.split("/").filter(Boolean);
  for (const part of parts) {
    dirHandle = await dirHandle.getDirectoryHandle(part, { create: true });
  }
  return dirHandle;
}

export async function getEntries(root: FileSystemDirectoryHandle, path: string): Promise<string[]> {
  const dirHandle = await getDirectoryHandle(root, path);
  const entries: string[] = [];
  for await (const [name] of dirHandle.entries()) {
    entries.push(name);
  }
  return entries;
}

export async function getEntry<T>(root: FileSystemDirectoryHandle, path: string): Promise<T> {
  const handle = await getFileHandle(root, path);
  const file = await handle.getFile();
  const contents = await file.text();
  const data: T = JSON.parse(contents);

  return data;
}

export async function setEntry(root: FileSystemDirectoryHandle, path: string, data: object): Promise<void> {
  const handle = await getFileHandle(root, path);
  const writable = await handle.createWritable();
  await writable.write(JSON.stringify(data, null, 2));
  await writable.close();
}

export async function deleteEntry(root: FileSystemDirectoryHandle, path: string): Promise<void> {
  const parts = path.split("/").filter(Boolean);
  const dirPath = parts.slice(0, -1);
  const fileName = parts[parts.length - 1];
  const dirHandle = await getDirectoryHandle(root, dirPath.join("/"));
  await dirHandle.removeEntry(fileName);
}
