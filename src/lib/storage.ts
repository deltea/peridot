export async function getFileHandle(root: FileSystemDirectoryHandle, path: string, create: boolean = true): Promise<FileSystemFileHandle | null> {
  let dirHandle = root;
  const parts = path.split("/").filter(Boolean);
  const dirPath = parts.slice(0, -1);
  const fileName = parts[parts.length - 1];
  try {
    for (const part of dirPath) {
      dirHandle = await dirHandle.getDirectoryHandle(part, { create });
    }
    const handle = await dirHandle.getFileHandle(fileName, { create });
    return handle;
  } catch {
    return null;
  }
}

export async function getDirectoryHandle(root: FileSystemDirectoryHandle, path: string, create: boolean = true): Promise<FileSystemDirectoryHandle | null> {
  let dirHandle = root;
  const parts = path.split("/").filter(Boolean);
  try {
    for (const part of parts) {
      dirHandle = await dirHandle.getDirectoryHandle(part, { create });
    }
    return dirHandle;
  } catch {
    return null;
  }
}

export async function getEntries(root: FileSystemDirectoryHandle, path: string): Promise<string[] | null> {
  const dirHandle = await getDirectoryHandle(root, path, false);
  if (!dirHandle) return null;

  const entries: string[] = [];
  for await (const [name] of dirHandle.entries()) {
    entries.push(name);
  }
  return entries;
}

export async function getEntry<T>(root: FileSystemDirectoryHandle, path: string): Promise<T | null> {
  const handle = await getFileHandle(root, path, false);
  if (!handle) return null;

  const file = await handle.getFile();
  const contents = await file.text();
  const data: T = JSON.parse(contents);

  return data;
}

export async function setEntry(root: FileSystemDirectoryHandle, path: string, data: object): Promise<void> {
  const handle = await getFileHandle(root, path);
  if (!handle) return;

  const writable = await handle.createWritable();
  await writable.write(JSON.stringify(data, null, 2));
  await writable.close();
}

export async function deleteEntry(root: FileSystemDirectoryHandle, path: string): Promise<void> {
  const parts = path.split("/").filter(Boolean);
  const dirPath = parts.slice(0, -1);
  const fileName = parts[parts.length - 1];

  const dirHandle = await getDirectoryHandle(root, dirPath.join("/"), false);
  if (!dirHandle) return;

  await dirHandle.removeEntry(fileName);
}

export async function createDirectory(root: FileSystemDirectoryHandle, path: string): Promise<void> {
  await getDirectoryHandle(root, path, true);
}
