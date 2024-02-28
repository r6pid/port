import { createRouteHandler } from 'uploadthing/next'

import { ourFileRouter } from './core'
import { UTApi } from 'uploadthing/server'

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
    router: ourFileRouter,
})

export async function DELETE(request: Request) {
    const body = await request.json()
    const { avatarURL } = body
    const newURL = avatarURL.substring(avatarURL.lastIndexOf('/') + 1)
    const utapi = new UTApi()
    await utapi.deleteFiles(newURL)
    return Response.json({ message: 'Success' })
}
