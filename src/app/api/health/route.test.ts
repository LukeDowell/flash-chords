import {GET} from "@/app/api/health/route";

describe('the health check endpoint', () => {
  it('should return a 200 healthy', async () => {
    const response = await GET(new Request(''));
    expect(response.status).toBe(200);
  })
})
