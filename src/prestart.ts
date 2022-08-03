/**
 * Startup script for checking existence of the configuration files
 */

import * as fs from 'fs/promises'

const fileNames = ['config.mjs']

for (const fileName of fileNames) {
  // Check if file exists in root directory
  try {
    await fs.access(fileName)
    continue
  } catch (e) {}
  // File doesn't exist yet and needs to be created
  console.log(
    `Could not open ${fileName}. Attempting to copy from example.${fileName}.`
  )

  // Check if example file exists in root directory
  try {
    await fs.copyFile(`example.${fileName}`, fileName)
    continue
  } catch (e) {}
  // Example file doesn't exist anymore
  console.log(`Could not open example.${fileName} either.`)

  // User has deliberately removed files
  console.error('Error: Missing important configuration file(s). Terminating.')
  process.exit(1)
}
