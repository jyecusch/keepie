import { promises as dns } from "dns";
import "dotenv/config";
import { ConnectionLog, PrismaClient } from "@prisma/client";

import { parseFrequency, runEvery } from "./frequency";

const second = 1;

const defaultFrequencySeconds = 10 * second;

const frequencySeconds =
  parseFrequency(process.env.FREQUENCY_SECONDS) || defaultFrequencySeconds;

const resolver = new dns.Resolver();
resolver.setServers(["1.1.1.1", "1.0.0.1"]);

console.log(`Checking connectivity every ${frequencySeconds} seconds`);

const prisma = new PrismaClient();

function logStatus({ createdAt, up }: ConnectionLog) {
  const statusString = up ? "AVAILABLE" : "UNAVAILABLE";
  console.debug(`${createdAt.toISOString()}: Internet Status ${statusString}`);
}

runEvery(frequencySeconds, async () => {
  let status: ConnectionLog | undefined;
  try {
    await dns.resolve("www.google.com");
    status = await prisma.connectionLog.create({
      data: {
        up: true,
      },
    });
  } catch (err) {
    status = await prisma.connectionLog.create({
      data: {
        up: true,
      },
    });
  }

  if (status) {
    logStatus(status);
  }
});
