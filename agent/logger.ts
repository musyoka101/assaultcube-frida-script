export function log(message: string): void {
    console.log(message);
}

export const colorize = new (class {
    color = (code: number, ended = false, ...messages: any[]) =>
      `\x1b[${code}m${messages.join(" ")}${ended ? "\x1b[0m" : ""}`;
    black = this.color.bind(null, 30, false);
    red = this.color.bind(null, 31, false);
    green = this.color.bind(null, 32, false);
    yellow = this.color.bind(this, 33, false);
    blue = this.color.bind(this, 34, false);
    magenta = this.color.bind(this, 35, false);
    cyan = this.color.bind(this, 36, false);
    white = this.color.bind(this, 37, false);
    bgBlack = this.color.bind(this, 40, true);
    bgRed = this.color.bind(this, 41, true);
    bgGreen = this.color.bind(this, 42, true);
    bgYellow = this.color.bind(this, 43, true);
    bgBlue = this.color.bind(this, 44, true);
    bgMagenta = this.color.bind(this, 45, true);
    bgCyan = this.color.bind(this, 46, true);
    bgWhite = this.color.bind(this, 47, true);
  })();
  
  export const color = colorize;

  export function log_info(message: string): void {
    console.log(color.bgBlue(message));
  }

  export function log_error(message: string): void {
    console.log(color.bgRed(message));
  }

  export function log_warning(message: string): void {
    console.log(color.bgYellow(message));
  }

  export function log_debug(message: string): void {
    console.log(color.bgCyan(message));
  }

  export function log_success(message: string): void {
    console.log(color.bgGreen(message));
  }