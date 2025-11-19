import fs from 'fs'
import path from 'path'
import type { APIRequestContext } from '@playwright/test'
const API_BASE_URL = process.env.API_BASE_URL 

// File upload helper
export async function uploadFile(
  request: APIRequestContext,
  uploadUrl: string,
  filePath: string,
  contentType: string
): Promise<number> {
  const absolutePath = path.resolve(filePath)
  const fileBuffer = fs.readFileSync(absolutePath)

  const fullUrl = `${API_BASE_URL}/${uploadUrl.replace(/^\/+/, '')}}`

  const response = await request.put(fullUrl, {
    data: fileBuffer,
    headers: { 'Content-Type': contentType }
  })

  return response.status()
}