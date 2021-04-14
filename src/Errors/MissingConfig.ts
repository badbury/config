export class MissingConfig extends Error {
  public name = 'MissingConfig';
  public message = 'Missing config';
  public configKey: string;

  constructor(configKey: string, options: string[]) {
    super();
    this.message = `${this.message} for ${configKey}. Configure using ${options.join(' or ')}`;
    this.configKey = configKey;
  }
}
