import {createMocks} from 'node-mocks-http'
import handler from "@/app/api/health/route";

describe('the health check endpoint', () => {
  it('should return a 200 healthy', async () => {
    const {req, res} = createMocks({method: 'GET'});

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
  })
})
