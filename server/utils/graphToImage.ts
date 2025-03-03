import { Buffer } from 'node:buffer'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import consola from 'consola'

export async function graphToImage(graph: any, outputPath?: string) {
  try {
    const drawableGraph = await graph.getGraphAsync()
    const image = await drawableGraph.drawMermaidPng()
    const arrayBuffer = await image.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const filePath = outputPath || path.join(defaultPath(), 'graph.png')
    await fs.writeFile(filePath, buffer)
    consola.success({ tag: 'eventHandler', message: `Graph image saved to ${filePath}` })
  }
  catch (error) {
    consola.error({ tag: 'eventHandler', message: `Error saving graph image: ${error}` })
  }
}

function defaultPath() {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  return __dirname
}
