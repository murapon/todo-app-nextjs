/**
 * デモ用タスクを100件生成するスクリプト
 * 実行: task seed:demo
 */
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// 仮のユーザーID（seed.tsと同じ）
const TEMP_USER_ID = "ebf4a9d7-a7ef-4566-a838-e437d6f27bb7";

// プロジェクトID
const PROJECT_IDS = [
  "00000000-0000-0000-0000-000000000001",
  "00000000-0000-0000-0000-000000000002",
];

// ステータス
const STATUSES = ["todo", "doing", "done"];

// タスク名のサンプル
const TASK_TITLES = [
  "ドキュメント作成",
  "コードレビュー",
  "バグ修正",
  "機能実装",
  "テスト作成",
  "デザイン確認",
  "ミーティング準備",
  "レポート作成",
  "データ分析",
  "環境構築",
  "リファクタリング",
  "パフォーマンス改善",
  "セキュリティ対応",
  "ユーザー対応",
  "仕様確認",
];

// ランダムな日付を生成（今日から30日以内）
function randomDueDate(): Date | null {
  if (Math.random() < 0.3) return null; // 30%は期限なし
  const days = Math.floor(Math.random() * 30);
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

// ランダムな要素を取得
function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
  console.log("🚀 デモ用タスクを100件生成します...");

  // 既存のデモタスクを削除（タイトルに [DEMO] が含まれるもの）
  const deleted = await prisma.task.deleteMany({
    where: {
      title: { contains: "[DEMO]" },
    },
  });
  console.log(`🗑️  既存のデモタスクを ${deleted.count} 件削除しました`);

  // 100件のタスクを生成
  const tasks = [];
  for (let i = 1; i <= 100; i++) {
    tasks.push({
      projectId: randomElement(PROJECT_IDS),
      title: `[DEMO] ${randomElement(TASK_TITLES)} #${i}`,
      description: `これはデモ用のタスク ${i} です。\n自動生成されたデータです。`,
      status: randomElement(STATUSES),
      priority: Math.floor(Math.random() * 5) + 1,
      dueDate: randomDueDate(),
    });
  }

  // 一括作成
  const created = await prisma.task.createMany({
    data: tasks,
  });

  console.log(`✅ ${created.count} 件のデモタスクを作成しました`);

  // 統計を表示
  const stats = await prisma.task.groupBy({
    by: ["status"],
    where: { title: { contains: "[DEMO]" } },
    _count: true,
  });

  console.log("\n📊 ステータス別件数:");
  stats.forEach((s) => {
    const label =
      s.status === "todo" ? "未着手" : s.status === "doing" ? "進行中" : "完了";
    console.log(`   ${label}: ${s._count} 件`);
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (e) => {
    console.error("❌ エラー:", e);
    await prisma.$disconnect();
    process.exit(1);
  });

