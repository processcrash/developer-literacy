"""联网搜索工具：SerperDevTool 单一来源，便于以后扩展其它工具。

SerperDevTool 内部访问 https://google.serper.dev/search，
需要环境变量 SERPER_API_KEY。
免费层每月 2500 次，注册地址：https://serper.dev
"""

from __future__ import annotations

import os

from crewai_tools import SerperDevTool


def assert_env() -> None:
    """在 Crew 启动前做一次环境变量体检，缺哪项就给出明确指引。"""
    missing = [k for k in ("OPENAI_API_KEY", "SERPER_API_KEY") if not os.environ.get(k)]
    if missing:
        raise EnvironmentError(
            "缺少以下环境变量："
            + ", ".join(missing)
            + "\n请先复制 .env.example 为 .env 并填入对应 key，"
            "或直接在 shell 中 export。\n"
            "  - OPENAI_API_KEY: LLM 网关 key（OpenAI 兼容协议）\n"
            "  - SERPER_API_KEY: https://serper.dev 注册即得"
        )


def build_search_tool() -> SerperDevTool:
    """构造联网搜索工具实例。"""
    assert_env()  # 在工具构造期就 fail-fast
    return SerperDevTool(n_results=10)


# 模块级单例，便于 agents.py 直接引用
search_tool: SerperDevTool = build_search_tool()