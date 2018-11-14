import { v4 as uuidV4 } from 'uuid';

export function generateId(prefix: string = 'bal', uuid?: string): string {
  const id = uuid ? uuid : uuidV4();
  return `${prefix}_${id.split('-').join('')}`;
}
