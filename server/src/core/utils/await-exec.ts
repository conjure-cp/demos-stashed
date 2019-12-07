const spawn = require('child_process').spawn

export const promiseSpawn = (cmd: string, args: string[] = [], opts: any = { timeout: 100000 }, input: string = '') =>
  new Promise((resolve, reject) => {
    const stdout = []
    const stderr = []
    const options = Object.assign({}, opts)

    // ensure no override
    if (options.stdio) {
      delete options.stdio
    }


    const child = spawn(cmd, args, options)

    if (options.timeout) {
      setTimeout(() => {
        child.stdin.pause();
        child.kill();
      }, options.timeout);

      delete options.timeout;
    }

    child.on('error', (err) => reject(err))
    child.stdout.on('error', (err) => reject(err));
    child.stderr.on('error', (err) => reject(err));
    child.stdin.on('error', (err) => reject(err));

    child.stdout.on('data', (data) => stdout.push(data));
    child.stderr.on('data', (data) => stderr.push(data));

    child.stdin.end(input)

    child.on('close', (code) => {
      const out =
        [undefined, 'buffer'].includes(options.encoding)
          ? Buffer.concat(stdout)
          : stdout.join('').trim()
      const err =
        [undefined, 'buffer'].includes(options.encoding)
          ? Buffer.concat(stderr)
          : stderr.join('').trim()

      if (code === 0) {
        return resolve({ out, err })
      }

      const error: any = {
        code,
        message: `command exited with code: ${code}`,
        out,
        err
      }

      // emulate actual Child Process Errors
      error.path = cmd
      error.syscall = 'spawn ' + cmd
      error.spawnargs = args

      return reject(error)
    })
  });
