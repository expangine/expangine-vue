import { EventBase } from './EventBase';
import { Store } from './Store';


export interface Transcoder<I, O>
{
  canSave?: () => boolean;
  encode(input: I): O;
  decode(output: O): I;
  getDefault(): I;
}

export function newStore<I, O>(key: string, transcoder: Transcoder<I, O>)
{
  return new TranscoderStore<I, O>(key, transcoder);
}

export interface TranscoderStoreEvents<I, O>
{
  saveError(error: any, store: TranscoderStore<I, O>): Promise<boolean>;
}

export class TranscoderStore<I, O> extends EventBase<TranscoderStoreEvents<I, O>> implements Transcoder<I, O>
{

  public key: string;
  public transcoder: Transcoder<I, O>;

  public constructor(key: string, transcoder: Transcoder<I, O>)
  {
    super();

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

  public canSave(): boolean
  {
    return !this.transcoder.canSave || this.transcoder.canSave();
  }

  public stringify(input: I): string
  {
    return JSON.stringify(this.encode(input));
  }

  public parse(json: string): I
  {
    return this.decode(JSON.parse(json) as unknown as O);
  }

  public async load(): Promise<I>
  {
    const loaded = await Store.get(this.key);

    return loaded !== null ? this.parse(loaded) : this.getDefault();
  }

  public async save(input: I)
  {
    if (!this.canSave())
    {
      return;
    }

    try 
    {
      window.console.log('saving', this.key);

      await Store.set(this.key, this.stringify(input));
    }
    catch (e) 
    {
      const results = await Promise.all(this.trigger('saveError', e, this));
      const retry = results.some((r) => r);

      if (retry)
      {
        await this.save(input);
      }
    }
  }

}
