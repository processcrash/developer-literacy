"""Task 定义：先搜集事实，再撰写简介。

`writing_task.context = [research_task]` 是关键 —— 让 Writer 看到
Researcher 的完整输出，避免上下文割裂。
"""

from __future__ import annotations

from crewai import Task

from agents import researcher, writer


research_task: Task = Task(
    description=(
        "请针对给定的人名：{person_name}\n\n"
        "使用联网搜索（SerperDevTool）收集以下维度的公开信息：\n"
        "1. 身份定位（行业 / 领域 / 公众熟知的角色）\n"
        "2. 现任职位与所在机构\n"
        "3. 主要履历（按时间顺序的关键节点）\n"
        "4. 代表性成就（公司、作品、研究、奖项等）\n"
        "5. 近期公开动态（最近 6~12 个月内可被新闻/媒体引用的事件）\n"
        "6. 每个事实必须附上一条来源 URL\n\n"
        "如果搜索结果中出现多个同名人物，请优先选择媒体曝光度最高、"
        "且与『近期动态』最匹配的那一位，并在开头用一句话注明你的消歧依据。"
    ),
    expected_output=(
        "Markdown 格式的事实清单：每个事实一行『事实内容 —— [来源标题](URL)』，"
        "按上述 6 个维度分组；最前面用 1~2 句话说明消歧判断。"
    ),
    agent=researcher,
)


writing_task: Task = Task(
    description=(
        "请基于上一份事实清单，为人物 {person_name} 撰写一份中文人物简介。\n\n"
        "结构要求（共 5 段，使用 Markdown 二级标题）：\n"
        "## 身份定位\n"
        "## 主要履历\n"
        "## 代表性成就\n"
        "## 近期动态\n"
        "## 参考来源\n\n"
        "写作要求：\n"
        "- 总长度 200~400 字（不含『参考来源』段落）\n"
        "- 每一段的事实必须能在上一份事实清单中找到对应来源，"
        "禁止编造清单外的信息\n"
        "-『参考来源』段落用 bullet list 列出最关键的来源链接，"
        "链接文本使用来源页面标题\n"
        "- 对未能核实的细节宁可省略，不要补全\n"
    ),
    expected_output=(
        "符合上述结构的完整 Markdown 文档，开头可保留消歧说明。"
    ),
    agent=writer,
    context=[research_task],  # 让 Writer 看到 Researcher 的输出
)