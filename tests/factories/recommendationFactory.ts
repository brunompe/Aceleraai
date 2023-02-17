import { prisma } from "../../src/database";
import { CreateRecommendationData } from "../../src/services/recommendationsService";
import supertest from "supertest";
import { faker } from "@faker-js/faker";
import app from "../../src/app";

const server = supertest(app);

export function recommendationValidBody(
  name?: string
): CreateRecommendationData {
  return {
    name: name || faker.name.fullName(),
    youtubeLink: "https://www.youtube.com/watch?v=Nqy5B8R40Pg",
  };
}

export function recommendationInvalidBody() {
  return {
    name: faker.datatype.number(),
    youtubeLink: "https://www.youtube.com/watch?v=Nqy5B8R40Pg",
  };
}

export function allRecommendation() {
  const recommendations = [
    {
      id: 1,
      name: "BALAZUL",
      youtubeLink: "https://www.youtube.com/watch?v=HVtE2rcJ5yk",
      score: 10,
    },
    {
      id: 2,
      name: "SEM DÓ",
      youtubeLink: "https://www.youtube.com/watch?v=G-zyOLsfEBQ&",
      score: 11,
    },
    {
      id: 3,
      name: "TAVABOM",
      youtubeLink: "https://www.youtube.com/watch?v=Z1WV8Q-wgKQ",
      score: 20,
    },
    {
      id: 4,
      name: "Tiffany",
      youtubeLink: "https://www.youtube.com/watch?v=iOM20kM2gOQ",
      score: 16,
    },
    {
      id: 5,
      name: "Paypal",
      youtubeLink: "https://www.youtube.com/watch?v=DsdjqBfTpaI",
      score: 7,
    },
    {
      id: 6,
      name: "Mustang Preto",
      youtubeLink: "https://www.youtube.com/watch?v=iDJM3HTdjck&",
      score: 3,
    },
    {
      id: 7,
      name: "INDUSTRY BABY",
      youtubeLink: "https://www.youtube.com/watch?v=eg-AwKRUFec",
      score: 5,
    },
    {
      id: 8,
      name: "M4",
      youtubeLink: "https://www.youtube.com/watch?v=DHYd4EyCE9M",
      score: 0,
    },
    {
      id: 9,
      name: "SICKO MODE",
      youtubeLink: "https://www.youtube.com/watch?v=6ONRf7h3Mdk",
      score: -1,
    },
    {
      id: 10,
      name: "Kenny G",
      youtubeLink:
        "https://www.youtube.com/watch?v=b-PhvPKgWjY&list=RDHVtE2rcJ5yk",
      score: 0,
    },
  ];
  return recommendations;
}

export async function insertRecommendation() {
  const recommendation = await recommendationValidBody();
  const insertedRecommendation = await prisma.recommendation.create({
    data: recommendation,
  });

  return { recommendation, insertedRecommendation };
}

export async function getIdByName(name: string) {
  const response = await prisma.recommendation.findFirst({
    where: {
      name,
    },
  });
  return response.id;
}

export async function insertValidRecommendation() {
  return await prisma.recommendation.create({
    data: {
      name: faker.animal.horse(),
      youtubeLink: "https://www.youtube.com/watch?v=Nqy5B8R40Pg",
    },
  });
}
