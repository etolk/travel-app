const request = require("supertest");
const app = require("../src/server/indexMockData.js");

const expectedDataFormat = "/test/moscow/2020-12-20/2020-12-21";

describe("Testing mock endpoint", () => {
    it("should return data object", async () => {
        const res = await request(app).get(expectedDataFormat);
        expect(res.status).toBe(200);
        expect(res.body.city).toBe("moscow");
        expect(res.body.img).toBeDefined();
        expect(res.body.temp_avg).toBeDefined();
        expect(res.body.temp_max).toBeDefined();
        expect(res.body.temp_min).toBeDefined();
    });
});
