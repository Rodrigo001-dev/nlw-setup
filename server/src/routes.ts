import dayjs from "dayjs";
import { FastifyInstance } from "fastify";
import { date, z } from "zod";

import { prisma } from "./lib/prisma";

export async function appRoutes(app: FastifyInstance) {
  app.post("/habits", async (request) => {
    const createHabitBody = z.object({
      title: z.string(),
      weekDays: z.array(z.number().min(0).max(6)),
    });

    const { title, weekDays } = createHabitBody.parse(request.body);

    // o startOf vai zerar as horas minutos e segundos
    const today = dayjs().startOf("day").toDate();

    await prisma.habit.create({
      data: {
        title,
        created_at: today,
        weekDays: {
          create: weekDays.map((weekDay) => {
            return {
              week_day: weekDay,
            };
          }),
        },
      },
    });
  });

  app.get("/day", async (request) => {
    const getDayParams = z.object({
      // o coerce vai converter o parâmetro que eu recebo no date em uma data
      date: z.coerce.date(),
    });

    const { date } = getDayParams.parse(request.query);

    const parsedDate = dayjs(date).startOf("day");
    const weekDay = parsedDate.get("day");

    const possibleHabits = await prisma.habit.findMany({
      where: {
        created_at: {
          // lte(menor ou igual)
          lte: date,
        },
        // vou procurar hábitos onde eu tenha weekDays
        weekDays: {
          // que pelo menos algum dia da semana preenche os requisitos que eu vou
          // colocar
          some: {
            // vou procurar hábitos onde tenha pelo menos um dia da semana
            // cadastrado onde o week_day seja igual o dia da semana que estou
            // recebendo na data
            week_day: weekDay,
          },
        },
      },
    });

    const day = await prisma.day.findUnique({
      where: {
        date: parsedDate.toDate(),
      },
      include: {
        dayHabits: true,
      },
    });

    const completedHabits = day?.dayHabits.map((dayHabit) => {
      return dayHabit.habit_id;
    });

    return { possibleHabits, completedHabits };
  });

  // essa rota vai mudar um status de um hábito, se ele está completo ou não
  // considerando a semântica do método patch, faz sentido utilizar ele aqui
  // o patch é utilizado para mudar informações pequenas(com um status)
  app.patch("/habits/:id/toggle", async (request) => {
    const toggleHabitParams = z.object({
      id: z.string().uuid(),
    });

    const { id } = toggleHabitParams.parse(request.params);

    const today = dayjs().startOf("day").toDate();

    let day = await prisma.day.findUnique({
      where: {
        date: today,
      },
    });

    // se eu não encontrar o dia, ou seja, se esse dia não estiver cadastrado no
    // banco de dados quer dizer que pessoa não tinha completado nenhum hábito
    // ainda
    if (!day) {
      day = await prisma.day.create({
        data: { date: today },
      });
    }

    const dayHabit = await prisma.dayHabit.findUnique({
      where: {
        day_id_habit_id: {
          day_id: day.id,
          habit_id: id,
        },
      },
    });

    // se ele encontrou esse registrou, quer dizer que o usuário tinha marcado
    // o hábito como completo
    if (dayHabit) {
      // remover a marcação como completo
      await prisma.dayHabit.delete({
        where: { id: dayHabit.id },
      });
    } else {
      // completar o hábito nesse dia pela primeira vez
      await prisma.dayHabit.create({
        data: { day_id: day.id, habit_id: id },
      });
    }
  });

  app.get("/summary", async () => {
    const summary = await prisma.$queryRaw`
      SELECT 
        D.id,
        D.date,
        (
          SELECT 
            cast(count(*) as float)
          FROM days_habits DH
          WHERE DH.day_id = D.id
        ) as completed,
        (
          SELECT
            cast(count(*) as float)
          FROM habit_week_days HWD
          JOIN habits H
            ON H.id = HWD.habit_id
          WHERE
            HWD.week_day = cast(strftime('%w', D.date/1000.0, 'unixepoch') as int)
            AND H.created_at <= D.date
        ) as amount
      FROM days D
    `;

    return summary;
  });
}
