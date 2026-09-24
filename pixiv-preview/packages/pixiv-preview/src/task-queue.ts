/** 使用固定数量的 worker 按数组顺序领取任务。 */
export async function consumeTasks<T>(
  tasks: readonly T[],
  workerCount: number,
  consume: (task: T) => Promise<void>,
  signal: AbortSignal
): Promise<void> {
  let cursor = 0
  const consumeNext = async (): Promise<void> => {
    while (!signal.aborted && cursor < tasks.length) {
      const task = tasks[cursor++]
      try {
        await consume(task)
      } catch {
        // 单项失败不应阻塞同一作品的剩余图片。
      }
    }
  }
  const count = Math.min(Math.max(1, Math.floor(workerCount)), tasks.length)
  await Promise.all(Array.from({ length: count }, consumeNext))
}
