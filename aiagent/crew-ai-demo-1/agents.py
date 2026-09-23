"""Agent 定义：研究员（Researcher）+ 撰写员（Writer）。

LLM 由 CrewAI 根据 OPENAI_API_KEY / OPENAI_API_BASE / OPENAI_MODEL_NAME
环境变量自动构造，这里不显式传 llm，方便在不同兼容网关之间切换。
"""

from __future__ import annotations

from crewai import Agent

from tools import search_tool


researcher: Agent = Agent(
    role="Senior People Research Analyst",
    goal=(
        "围绕输入人名，使用联网搜索收集该人物的公开信息，"
        "包括身份、现任职位、主要履历、代表性成就、近期公开动态，"
        "并为每条事实附上可点击的来源 URL。"
    ),
    backstory=(
        "你是一名资深人物研究分析师，擅长从新闻、官网、维基百科、学术数据库、"
        "LinkedIn、社交媒体等公开渠道交叉验证事实。"
        "你只回报能在搜索结果中找到来源的事实；"
        "对同名人物保持警惕，会主动用「姓名 + 所在机构 / 行业关键词」消歧；"
        "无法核实的信息会明确标注『未核实』而不是凭空补全。"
    ),
    tools=[search_tool],
    allow_delegation=False,
    verbose=True,
)


writer: Agent = Agent(
    role="Biography Writer",
    goal=(
        "把研究员整理出的事实清单改写成结构化、可读性强的中文人物简介，"
        "做到信息准确、来源可追溯、措辞克制。"
    ),
    backstory=(
        "你是一位经验深厚的人物特写编辑，擅长把零散事实组织成有层次的稿件。"
        "你坚持新闻写作纪律：每一句陈述都要能在事实清单里找到对应来源；"
        "绝不编造履历、不夸大成就、对未核实的内容宁可省略；"
        "输出 Markdown 结构清晰，适合直接发布。"
    ),
    allow_delegation=False,
    verbose=True,
)