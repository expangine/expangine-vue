import { getPromiser } from './Promiser';
import { isString } from 'expangine-runtime';


export interface FileImportOptions
{
  accept?: string;
  text?: boolean;
  json?: boolean;
}

export enum FileImportStatus
{
  SUCCESS,
  NONE_SELECTED,
  NOT_TEXT_FILE,
  ERROR_PARSING_JSON,
}

export interface FileImportResult
{
  status: FileImportStatus;
  file?: File;
  text?: string;
  json?: any;
  error?: Error;
}

export function getFile(options: FileImportOptions = {}): Promise<FileImportResult>
{
  const { promise, resolve } = getPromiser<FileImportResult>();

  const finput = document.createElement('input');
  finput.type = 'file';
  finput.multiple = true;
  finput.accept = options.accept || '';
  finput.onchange = (e) => 
  {
    if (finput.files && finput.files.length > 0) 
    {
      const file = finput.files[0];
      const parse = options.text || options.json;

      if (parse) 
      {
        const reader = new FileReader();

        reader.onload = () => 
        {
          const text = reader.result;

          if (isString(text)) 
          {
            if (options.json) 
            {
              try 
              {
                const json = JSON.parse(text);

                resolve({
                  status: FileImportStatus.SUCCESS,
                  file,
                  json,
                  text,
                });
              } 
              catch (error) 
              {
                resolve({
                  status: FileImportStatus.ERROR_PARSING_JSON,
                  file,
                  text,
                  error,
                });
              }
            } 
            else 
            {
              resolve({
                status: FileImportStatus.SUCCESS,
                file,
                text,
              });
            }
          } 
          else 
          {
            resolve({
              status: FileImportStatus.NOT_TEXT_FILE,
              file,
            });
          }
        };
        reader.readAsText(file);
      } 
      else 
      {
        resolve({
          status: FileImportStatus.SUCCESS,
          file,
        });
      }
    } 
    else 
    {
      resolve({
        status: FileImportStatus.NONE_SELECTED,
      });
    }

    finput.remove();
  };

  finput.click();

  document.body.onfocus = (e) =>
  {
    if (!finput.files || finput.files.length === 0) 
    {
      resolve({
        status: FileImportStatus.NONE_SELECTED,
      });
    }

    finput.remove();

    document.body.onfocus = null;
  };

  return promise;
}
