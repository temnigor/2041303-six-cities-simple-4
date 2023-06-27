export interface CliCommandInterface {
  name:string;
  execute (...parameters: string[]):void
}
