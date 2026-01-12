// Shared types for sidebar components

export type UserInfo = {
  name: string;
  email: string;
};

export type FolderItem = {
  id: string;
  name: string;
  type: 'folder' | 'plan';
  children?: FolderItem[];
  date?: string;
};
