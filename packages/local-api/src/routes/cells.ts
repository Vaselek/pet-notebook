import express from 'express';
import fs from 'fs/promises';
import path from 'path';

interface Cell {
  id: string;
  content: string;
  type: 'text' | 'code';
}

interface LocalApiError {
  code: string;
}

export const createCellRouter = (filename: string, dir: string) => {
  const router = express.Router()
  router.use(express.json())

  const fullPath = path.join(dir, filename)

  router.get('/cells', async (req, res) => {
    const isLocalApiError = (err: any): err is LocalApiError => {
      return typeof err.code === 'string'
    }
    try {
      const result = await fs.readFile(fullPath, {encoding: 'utf-8'})
      res.send(JSON.parse(result))
    } catch (e) {
      if (isLocalApiError(e)) {
        if (e.code === 'ENOENT') {
          await fs.writeFile(fullPath, '[]', 'utf-8')
          res.send([])
        }
      } else {
        throw e
      }
    }
  })

  router.post('/cells', async (req, res) => {
    const {cells}: { cells: Cell[] } = req.body
    await fs.writeFile(fullPath, JSON.stringify(cells), 'utf-8')
    res.send({status: 'ok'})
  })

  return router
}