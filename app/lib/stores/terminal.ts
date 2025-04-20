import type { WebContainer, WebContainerProcess } from '@webcontainer/api';
import { atom, type WritableAtom } from 'nanostores';
import type { ITerminal } from '~/types/terminal';
import { newSparkShellProcess, newShellProcess } from '~/utils/shell';
import { coloredText } from '~/utils/terminal';

export class TerminalStore {
  #webcontainer: Promise<WebContainer>;
  #terminals: Array<{ terminal: ITerminal; process: WebContainerProcess }> = [];
  #sparkTerminal = newSparkShellProcess();

  showTerminal: WritableAtom<boolean> = import.meta.hot?.data.showTerminal ?? atom(true);

  constructor(webcontainerPromise: Promise<WebContainer>) {
    this.#webcontainer = webcontainerPromise;

    if (import.meta.hot) {
      import.meta.hot.data.showTerminal = this.showTerminal;
    }
  }
  get sparkTerminal() {
    return this.#sparkTerminal;
  }

  get boltTerminal() {
    return this.#sparkTerminal;
  }

  toggleTerminal(value?: boolean) {
    this.showTerminal.set(value !== undefined ? value : !this.showTerminal.get());
  }
  async attachSparkTerminal(terminal: ITerminal) {
    try {
      const wc = await this.#webcontainer;
      await this.#sparkTerminal.init(wc, terminal);
    } catch (error: any) {
      terminal.write(coloredText.red('Failed to spawn spark shell\n\n') + error.message);
      return;
    }
  }

  async attachBoltTerminal(terminal: ITerminal) {
    return this.attachSparkTerminal(terminal);
  }

  async attachTerminal(terminal: ITerminal) {
    try {
      const shellProcess = await newShellProcess(await this.#webcontainer, terminal);
      this.#terminals.push({ terminal, process: shellProcess });
    } catch (error: any) {
      terminal.write(coloredText.red('Failed to spawn shell\n\n') + error.message);
      return;
    }
  }

  onTerminalResize(cols: number, rows: number) {
    for (const { process } of this.#terminals) {
      process.resize({ cols, rows });
    }
  }
}
