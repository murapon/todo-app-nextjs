import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// 仮のユーザーID（app/page.tsxと同じ）
const TEMP_USER_ID = "ebf4a9d7-a7ef-4566-a838-e437d6f27bb7";

async function main() {
  // テストユーザーを作成
  const user = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      id: TEMP_USER_ID,
      email: "test@example.com",
      name: "テストユーザー",
      googleId: "google-test-id-12345",
    },
  });

  console.log("Created user:", user);

  // サンプルプロジェクトを作成
  const project1 = await prisma.project.upsert({
    where: { id: "00000000-0000-0000-0000-000000000001" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000001",
      userId: user.id,
      name: "個人タスク",
    },
  });

  const project2 = await prisma.project.upsert({
    where: { id: "00000000-0000-0000-0000-000000000002" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000002",
      userId: user.id,
      name: "仕事プロジェクト",
    },
  });

  console.log("Created projects:", { project1, project2 });

  // サンプルタスクを作成
  const tasks = await Promise.all([
    prisma.task.upsert({
      where: { id: "00000000-0000-0000-0000-000000000101" },
      update: {},
      create: {
        id: "00000000-0000-0000-0000-000000000101",
        projectId: project1.id,
        title: "買い物リストを作成",
        description: "週末の買い物リストを作る",
        status: "todo",
        priority: 3,
        dueDate: new Date("2025-12-28"),
      },
    }),
    prisma.task.upsert({
      where: { id: "00000000-0000-0000-0000-000000000102" },
      update: {},
      create: {
        id: "00000000-0000-0000-0000-000000000102",
        projectId: project1.id,
        title: "部屋の掃除",
        description: "リビングと寝室を掃除する",
        status: "doing",
        priority: 2,
        dueDate: new Date("2025-12-26"),
      },
    }),
    prisma.task.upsert({
      where: { id: "00000000-0000-0000-0000-000000000103" },
      update: {},
      create: {
        id: "00000000-0000-0000-0000-000000000103",
        projectId: project2.id,
        title: "週次レポート作成",
        description: "今週の進捗をまとめる",
        status: "todo",
        priority: 1,
        dueDate: new Date("2025-12-27"),
      },
    }),
    prisma.task.upsert({
      where: { id: "00000000-0000-0000-0000-000000000104" },
      update: {},
      create: {
        id: "00000000-0000-0000-0000-000000000104",
        projectId: project2.id,
        title: "ミーティング資料準備",
        description: "来週のミーティング用スライドを作成",
        status: "done",
        priority: 2,
        dueDate: new Date("2025-12-24"),
      },
    }),
  ]);

  console.log("Created tasks:", tasks.length);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

