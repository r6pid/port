import { getServerSession } from 'next-auth'
import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { UploadThingError } from 'uploadthing/server'
import { authOptions } from '../../../lib/auth'
import { db } from '../../../lib/db'

const f = createUploadthing()
const getUser = async () => {
    const session = await getServerSession(authOptions)
    if (!session || !session.user.email)
        throw new UploadThingError('Unauthorized')
    const user = await db.user.findUnique({
        where: { email: session.user.email },
    })
    if (!user) throw new UploadThingError('Unauthorized')
    return user
}
const auth = async (req: Request) => await getUser()

export const ourFileRouter = {
    imageUploader: f({ image: { maxFileSize: '4MB' } })
        .middleware(async ({ req }) => {
            const user = await auth(req)

            if (!user) throw new UploadThingError('Unauthorized')

            return { username: user.username }
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log(file.name, 'was uploaded by:', metadata.username)
            return { uploadedBy: metadata.username }
        }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
