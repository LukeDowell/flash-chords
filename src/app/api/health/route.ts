export const dynamic = 'force-static'

export async function GET(req: Request) {
  return new Response('Hello!', {status: 200})
}
