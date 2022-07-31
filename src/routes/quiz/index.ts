import { PrismaClient } from "@prisma/client";
import { MIN_ROUNDS, MAX_ROUNDS, MIN_TIMER, MAX_TIMER, MIN_DIFFICULTY, MAX_DIFFICULTY } from "$lib/constants";
import type { RequestHandler } from "@sveltejs/kit";
import type { kanjiData } from "$lib/types";

const prisma = new PrismaClient();

function getRandomInt(range: number) {
  return Math.floor(Math.random() * range);
}

function sliceByDifficulty<T>(list: T[], difficulty: number) {
  const segmentSize = Math.floor(list.length / (MAX_DIFFICULTY * (MAX_DIFFICULTY + 1) / 2));
  const start = Math.floor(difficulty * (difficulty - 1) / 2 * segmentSize);
  const sliceSize = difficulty * segmentSize;
  return list.slice(start, start + sliceSize);
}

function selectRandomlyFromIntervals<T>(list: T[], numIntervals: number) {
  const intervalSize = Math.floor(list.length / numIntervals);
  const result: T[] = [];
  for (let i = 0; i < numIntervals; i++) {
    result.push(list[Math.min(list.length - 1, Math.floor(i * intervalSize) + getRandomInt(intervalSize))])
  }
  return result;
}

async function getKanjiListByStrokes(rounds: number, difficulty: number): Promise<kanjiData[]> {
  let rows = await prisma.kanjidict.findMany({ orderBy: { strokes: 'asc' } });
  rows = sliceByDifficulty(rows, difficulty);
  return selectRandomlyFromIntervals(rows, rounds);
}

async function getKanjiListByFrequency(rounds: number, difficulty: number): Promise<kanjiData[]> {
  let rows = await prisma.kanjidict.findMany({
    where: { frequency: { not: null } },
    orderBy: { frequency: 'asc' }
  });
  rows = sliceByDifficulty(rows, difficulty);
  return selectRandomlyFromIntervals(rows, rounds);
}

export const GET: RequestHandler = async ({ url }) => {
  const metric = url.searchParams.get('metric');
  const roundsQuery = url.searchParams.get('rounds');
  const timerQuery = url.searchParams.get('timer');
  const difficultyQuery = url.searchParams.get('difficulty');

  if (!(metric && roundsQuery && timerQuery && difficultyQuery)) {
    return {
      status: 400,
      body: new Error('Missing query parameters for quiz')
    }
  }

  if (metric !== 'strokes' && metric !== 'frequency') {
    return {
      status: 400,
      body: new Error('Invalid strokes value')
    }
  }

  const rounds = parseInt(roundsQuery);
  const timer = parseInt(timerQuery);
  const difficulty = parseInt(difficultyQuery);

  if (!Number.isInteger(rounds) || rounds < MIN_ROUNDS || rounds > MAX_ROUNDS) {
    return {
      status: 400,
      body: new Error('Invalid rounds value')
    }
  }

  if (!Number.isInteger(timer) || timer < MIN_TIMER || timer > MAX_TIMER) {
    return {
      status: 400,
      body: new Error('Invalid timer value')
    }
  }

  if (!Number.isInteger(difficulty) || difficulty < MIN_DIFFICULTY || difficulty > MAX_DIFFICULTY) {
    return {
      status: 400,
      body: new Error('Invalid difficulty value')
    }
  }

  let kanjiList: kanjiData[];
  if (metric === 'strokes') {
    kanjiList = await getKanjiListByStrokes(rounds, difficulty);
  }
  else {
    kanjiList = await getKanjiListByFrequency(rounds, difficulty);
  }

  return {
    status: 200,
    body: {
      rounds,
      timer,
      kanjiList
    }
  }
}
