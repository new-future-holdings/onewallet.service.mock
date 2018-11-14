import * as uuidV4 from 'uuid/v4';

export function generateId(prefix: string = 'bal', uuid?: string): string {
  const id = uuid ? uuid : uuidV4();
  return `${prefix}_${id.split('-').join('')}`;
}
