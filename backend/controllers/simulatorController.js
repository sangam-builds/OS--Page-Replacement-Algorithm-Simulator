// Simulator Controller
// Handles requests for page replacement algorithm simulations

const { spawn } = require('child_process');
const path = require('path');

function getCliPath() {
  const binName = process.platform === 'win32' ? 'algorithms_cli.exe' : 'algorithms_cli';
  return path.join(__dirname, '..', 'algorithms', 'build', binName);
}

exports.simulate = (req, res) => {
  try {
    const { algorithm, pageSequence, frameSize } = req.body;

    if (!algorithm || !Array.isArray(pageSequence) || !frameSize) {
      return res.status(400).json({ error: 'Invalid request: algorithm, pageSequence, frameSize required' });
    }

    const cli = getCliPath();
    const seqStr = pageSequence.join(',');
    const args = [algorithm, seqStr, String(frameSize)];

    const child = spawn(cli, args);

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => { stdout += data.toString(); });
    child.stderr.on('data', (data) => { stderr += data.toString(); });

    child.on('close', (code) => {
      if (code !== 0) {
        return res.status(500).json({ error: stderr || `CLI exited with code ${code}` });
      }

      try {
        const parsed = JSON.parse(stdout);
        return res.json({ success: true, algorithm, frameSize, pageSequence, result: parsed });
      } catch (err) {
        return res.status(500).json({ error: 'Failed to parse CLI output', raw: stdout, err: err.message });
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAlgorithms = (req, res) => {
  const algorithms = [
    { name: 'FIFO', description: 'First In First Out' },
    { name: 'LRU', description: 'Least Recently Used' },
    { name: 'LFU', description: 'Least Frequently Used' },
    { name: 'Optimal', description: 'Optimal (Belady\'s Algorithm)' }
  ];
  res.json(algorithms);
};

exports.compareAlgorithms = async (req, res) => {
  try {
    const { pageSequence, frameSize } = req.body;
    if (!Array.isArray(pageSequence) || !frameSize) return res.status(400).json({ error: 'pageSequence and frameSize required' });

    const algs = ['FIFO', 'LRU', 'LFU', 'Optimal'];
    const results = {};

    // run CLI for each algorithm sequentially
    for (const alg of algs) {
      const cli = getCliPath();
      const args = [alg, pageSequence.join(','), String(frameSize)];
      const out = await new Promise((resolve, reject) => {
        const c = spawn(cli, args);
        let s = '';
        let e = '';
        c.stdout.on('data', d => s += d.toString());
        c.stderr.on('data', d => e += d.toString());
        c.on('close', code => {
          if (code !== 0) return reject(e || `exit ${code}`);
          resolve(s);
        });
      });
      results[alg] = JSON.parse(out);
    }

    res.json({ success: true, comparison: results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
