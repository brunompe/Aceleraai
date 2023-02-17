import app from "../../src/app";
import supertest from "supertest";
import {
  recommendationValidBody,
  getIdByName,
  recommendationInvalidBody,
  insertValidRecommendation,
} from "../factories/recommendationFactory";
import { cleanDb } from "../helpers";

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe("POST /recommendations", () => {
  it("should return status 201 if valid input", async () => {
    const body = recommendationValidBody();
    const response = await server.post("/recommendations").send(body);
    expect(response.status).toEqual(201);
  });
  it("should return 422 if invalid name", async () => {
    const body = recommendationInvalidBody();
    const response = await server.post("/recommendations").send(body);
    expect(response.status).toEqual(422);
  });
  it("should return 422 if invalid youtube link", async () => {
    const body = recommendationValidBody();
    body.youtubeLink = "Vai Corinthians!";
    const response = await server.post("/recommendations").send(body);

    expect(response.status).toEqual(422);
  });
  it("should return 409 if name already exist", async () => {
    const { name, youtubeLink } = await insertValidRecommendation();
    const response = await server
      .post("/recommendations")
      .send({ name, youtubeLink });
    expect(response.status).toEqual(409);
  });
});

describe("POST /:id/upvote", () => {
  it("should return 200 on success", async () => {
    const body = recommendationValidBody("super vídeo mega ultra maneiro");
    await server.post("/recommendations").send(body);
    const id = await getIdByName("super vídeo mega ultra maneiro");
    const response = await server.post(`/recommendations/${id}/upvote`);

    expect(response.status).toEqual(200);
  });
  it("should return 404 if id not found", async () => {
    const response = await server.post("/recommendations/9999999/upvote");

    expect(response.status).toEqual(404);
  });
});

describe("POST /:id/downvote", () => {
  it("should return 200 if success", async () => {
    const videoName =
      "Lady Gaga - Bloody Mary (1 HOUR/Lyrics) | I'll dance dance dance with my hands hands hands";
    const body = recommendationValidBody(videoName);
    await server.post("/recommendations").send(body);
    const id = await getIdByName(videoName);
    const response = await server.post(`/recommendations/${id}/downvote`);

    expect(response.status).toEqual(200);
  });

  it("should return 404 if id not found", async () => {
    const response = await server.post("/recommendations/9999999/downvote");

    expect(response.status).toEqual(404);
  });
});

describe("GET /recommendations", () => {
  it("should return 200 if success", async () => {
    const response = await server.get("/recommendations");

    expect(response.status).toEqual(200);
  });
});

describe("GET /recommendations/random", () => {
  it("should return 200 if success", async () => {
    const body = recommendationValidBody();
    await server.post("/recommendations").send(body);
    const response = await server.get("/recommendations/random");

    expect(response.status).toEqual(200);
  });
  it("should return 404 if no recommendations in database", async () => {
    const response = await server.get("/recommendations/random");

    expect(response.status).toEqual(404);
  });
});

describe("GET /recommendations/top/:amount", () => {
  it("should return 200 on success", async () => {
    const amount = Math.ceil(Math.random() * 10);
    const response = await server.get(`/recommendations/top/${amount}`);

    expect(response.status).toEqual(200);
  });
});

describe("GET /recommendations/:id", () => {
  it("should return 200 on success", async () => {
    const videoName = "vídeo toppen";
    const body = recommendationValidBody(videoName);
    await server.post("/recommendations").send(body);
    const id = await getIdByName(videoName);
    const response = await server.get(`/recommendations/${id}`);

    expect(response.status).toEqual(200);
    expect(response.body).toBeInstanceOf(Object);
  });
  it("should return 404 if id not found", async () => {
    const response = await supertest(app).get(`/recommendations/9999999`);

    expect(response.status).toEqual(404);
    expect(response.text).toBe("");
    expect(response.body).toStrictEqual({});
  });
});
