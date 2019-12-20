import uuidv5 from 'uuid/v5';

export default function (code: string): string {
  return `vnd_${uuidv5(code, '78530ab6-554f-46a9-bd72-8607b28560fb').replace(
    /-/g,
    '',
  )}`;
}
