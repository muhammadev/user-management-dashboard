import { http, HttpResponse, delay } from "msw";
import { mockRoles } from "../mockData/mockRoles";

const delayInRange = Math.floor(Math.random() * (800 - 300 + 1)) + 300;

export const handlers = [
  http.get("/api/roles", async () => {
    await delay(delayInRange)

    return HttpResponse.json(mockRoles)
  })
]
