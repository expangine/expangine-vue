

export type TranscoderErrorHandler<I, O> = (error: any, transcoder: Transcoder<I, O>) => boolean | Promise<boolean>;

export interface Transcoder<I, O>
{
  onSaveError?: TranscoderErrorHandler<I, O>;
  encode(input: I): O;
  decode(output: O): I;
  getDefault(): I;
}

export function newStore<I, O>(key: string, transcoder: Transcoder<I, O>)
{
  return new TranscoderStore<I, O>(key, transcoder);
}


export class TranscoderStore<I, O> implements Transcoder<I, O>
{

  public key: string;
  public transcoder: Transcoder<I, O>;

  public constructor(key: string, transcoder: Transcoder<I, O>)
  {
    this.key = key;
    this.transcoder = transcoder;
  }

  public encode(input: I): O
  {
    return this.transcoder.encode(input);
  }

  public decode(output: O): I
  {
    return this.transcoder.decode(output);
  }

  public getDefault(): I
  {
    return this.transcoder.getDefault();
  }

  public stringify(input: I): string
  {
    return JSON.stringify(this.encode(input));
  }

  public parse(json: string): I
  {
    return this.decode(JSON.parse(json) as unknown as O);
  }

  public load(): I
  {
    const loaded = localStorage.getItem(this.key);

    return loaded !== null ? this.parse(loaded) : this.getDefault();
  }

  public async save(input: I)
  {
    try 
    {
      window.console.log('saving', this.key);

      localStorage.setItem(this.key, this.stringify(input));
    } 
    catch (e) 
    {
      if (this.transcoder.onSaveError)
      {
        if (await this.transcoder.onSaveError(e, this))
        {
          this.save(input);
        }
      }
    }
  }

}
