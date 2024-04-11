import {Command} from 'commander';
import {serve} from '@pet-notebook/local-api';
import path from 'path';

const isProduction = process.env.NODE_ENV === 'production';

interface LocalApiError {
  code: string;
}

export const serveCommand = new Command()
  .command('serve [filename]')
  .description('Open file for editing')
  .option('-p, --port <number>', 'port to run server on', '4005')
  .action(async (filename = 'notebook.js', options: { port: string }) => {
    const isLocalApiError = (e: any): e is LocalApiError => {
      return typeof e.code === 'string'
    }
    try {
      const dir = path.join(process.cwd(), path.dirname(filename))

      console.log('!isProduction', !isProduction)

      await serve(parseInt(options.port), path.basename(filename), dir, !isProduction)

      console.log(`Opened ${filename}. Navigate to http://localhost:${options.port} to edit the file`)
    } catch (err) {
      if (isLocalApiError(err)) {
        if (err.code === 'EADDRINUSE') {
          console.error('Port is in use. Try running on a different port.');
        }
      } else if (err instanceof Error) {
        console.log('Heres the problem', err.message);
      }
      process.exit(1)
    }
  })
