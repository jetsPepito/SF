import { prisma } from "@/lib/prisma";
import type { DailyStat } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    let entries;

    if (from && to) {
      entries = await prisma.dailyStat.findMany({
        where: {
          date: {
            gte: new Date(from),
            lte: new Date(to),
          },
        },
        orderBy: {
          date: "asc",
        },
      });
    } else {
      // Par défaut, on retourne les 60 derniers jours
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - 60);

      entries = await prisma.dailyStat.findMany({
        where: {
          date: {
            gte: cutoffDate,
          },
        },
        orderBy: {
          date: "asc",
        },
      });
    }

    return NextResponse.json(
      entries.map((entry: DailyStat) => ({
        id: entry.id,
        date: entry.date.toISOString().split("T")[0], // Format YYYY-MM-DD
        seenCount: entry.seenCount,
        noShowCount: entry.noShowCount,
      }))
    );
  } catch (error) {
    console.error("Erreur lors de la récupération des données:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des données" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { date, seenCount, noShowCount } = body as {
      date?: string;
      seenCount?: number;
      noShowCount?: number;
    };

    if (!date || typeof seenCount !== "number" || typeof noShowCount !== "number") {
      return NextResponse.json(
        { error: "date, seenCount et noShowCount sont obligatoires" },
        { status: 400 }
      );
    }

    if (seenCount < 0 || noShowCount < 0) {
      return NextResponse.json(
        { error: "Les valeurs ne peuvent pas être négatives" },
        { status: 400 }
      );
    }

    const total = seenCount + noShowCount;
    if (total === 0) {
      return NextResponse.json(
        { error: "Il doit y avoir au moins 1 patiente (vue ou absente)" },
        { status: 400 }
      );
    }

    // Upsert : créer ou mettre à jour si la date existe déjà
    const entry = await prisma.dailyStat.upsert({
      where: {
        date: new Date(date),
      },
      update: {
        seenCount,
        noShowCount,
      },
      create: {
        date: new Date(date),
        seenCount,
        noShowCount,
      },
    });

    return NextResponse.json(
      {
        id: entry.id,
        date: entry.date.toISOString().split("T")[0], // Format YYYY-MM-DD
        seenCount: entry.seenCount,
        noShowCount: entry.noShowCount,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur lors de l'enregistrement:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'enregistrement" },
      { status: 500 }
    );
  }
}
