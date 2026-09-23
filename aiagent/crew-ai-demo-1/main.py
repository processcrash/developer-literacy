"""CLI 入口：

    python main.py "马斯克"            # 直接打印结果
    python main.py "Sam Altman" --save # 同时写入 output/Sam Altman.md
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

from dotenv import load_dotenv

from crew import crew
from tools import assert_env


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="根据人名，使用 CrewAI + 联网搜索生成结构化人物简介。",
    )
    parser.add_argument(
        "name",
        help="要了解的人名（中英文均可），例如 '马斯克'、'Sam Altman'。",
    )
    parser.add_argument(
        "--save",
        action="store_true",
        help="把生成结果写入 output/<name>.md。",
    )
    return parser.parse_args(argv)


def write_output(name: str, content: str) -> Path:
    output_dir = Path(__file__).parent / "output"
    output_dir.mkdir(parents=True, exist_ok=True)

    # 用连字符替代文件系统不安全字符，避免中英文路径混用带来的歧义
    safe_name = name.strip().replace("/", "-").replace("\\", "-")
    target = output_dir / f"{safe_name}.md"
    target.write_text(content, encoding="utf-8")
    return target


def main(argv: list[str] | None = None) -> int:
    # 1. 先加载本地 .env，再做环境变量体检
    load_dotenv()
    assert_env()

    args = parse_args(argv)
    name = args.name.strip()
    if not name:
        print("人名不能为空", file=sys.stderr)
        return 2

    print(f"\n>>> 正在为「{name}」生成人物简介 ...\n")

    # 2. 启动 Crew：inputs 中的 key 必须和 task description 里的 {person_name} 对齐
    result = crew.kickoff(inputs={"person_name": name})

    # 3. 输出结果
    final_text = str(result)
    print("\n" + "=" * 60)
    print(final_text)
    print("=" * 60 + "\n")

    if args.save:
        path = write_output(name, final_text)
        print(f">>> 已保存到 {path}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())